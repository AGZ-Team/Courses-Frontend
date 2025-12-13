import { NextRequest, NextResponse } from 'next/server';
import { API_BASE_URL } from './config';

/**
 * Shared media proxy logic used by both /api/media and /media routes.
 * Accepts the NextRequest and an array of path segments and returns a NextResponse.
 */
export async function proxyMedia(request: NextRequest, pathSegments: string[]) {
  try {
    const accessToken = request.cookies.get('access_token')?.value;
    const cookieHeader = request.headers.get('cookie') ?? '';
    const hasAuth = !!(accessToken || cookieHeader);

    const mediaPath = Array.isArray(pathSegments) ? pathSegments.join('/') : '';
    if (!mediaPath) {
      return NextResponse.json({ error: 'Missing media path' }, { status: 400 });
    }

    const base = String(API_BASE_URL).replace(/\/$/, '');
    
    // Try multiple possible endpoints where backend might serve media files
    // Django typically uses /media/ or /api/media/ or a custom endpoint
    const candidateUrls = [
      `${base}/api/media/${mediaPath}`,
      `${base}/media/${mediaPath}`,
      `${base.replace(/^https:/, 'http:')}/api/media/${mediaPath}`,
      `${base.replace(/^https:/, 'http:')}/media/${mediaPath}`,
    ].filter((v, i, a) => a.indexOf(v) === i);

    const authHeaders: Record<string, string> = {
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...(cookieHeader ? { Cookie: cookieHeader } : {}),
    };

    let response: Response | null = null;
    let triedUrl: string | null = null;
    let successUrl: string | null = null;

    console.log(`[Media Proxy] Starting fetch for: ${mediaPath}`);
    console.log(`[Media Proxy] Auth status: ${hasAuth ? '✓ Authenticated' : '✗ Anonymous'}`);
    console.log(`[Media Proxy] Trying candidate URLs:`, candidateUrls);

    for (const url of candidateUrls) {
      triedUrl = url;

      // STRATEGY: Try with token first (if available)
      if (hasAuth) {
        console.log(`[Media Proxy] → Attempt 1 (with auth): ${url}`);
        response = await fetch(url, { headers: authHeaders, cache: 'no-store' });

        // If upstream rejects auth, fallback to anonymous
        if (response.status === 401 || response.status === 403) {
          console.log(`[Media Proxy]   ✗ Auth rejected (${response.status}), retrying without auth`);
          console.log(`[Media Proxy] → Attempt 2 (anonymous): ${url}`);
          response = await fetch(url, { cache: 'no-store' });
        }
      } else {
        // No auth available, fetch anonymously
        console.log(`[Media Proxy] → Attempt (anonymous): ${url}`);
        response = await fetch(url, { cache: 'no-store' });
      }

      if (response && response.ok) {
        successUrl = url;
        console.log(`[Media Proxy] ✓ Success! Image loaded from: ${url}`);
        break;
      } else if (response) {
        console.log(`[Media Proxy] ✗ Failed (${response.status}): ${url}`);
      }
    }

    if (!response) {
      console.error('[Media Proxy] All candidate URLs failed. Attempted:', candidateUrls);
      return NextResponse.json({ error: 'Failed to fetch image from any endpoint' }, { status: 500 });
    }

    if (!response.ok) {
      console.error('[Media Proxy] Failed to fetch image:', triedUrl, response.status, response.statusText);
      return NextResponse.json({ error: 'Image not found on backend' }, { status: response.status });
    }

    const contentTypeRaw = response.headers.get('Content-Type') || '';
    const contentType = contentTypeRaw.split(';')[0].trim().toLowerCase();

    const looksLikeNonImage =
      !contentType ||
      contentType.startsWith('text/html') ||
      contentType.startsWith('application/json') ||
      contentType.startsWith('text/plain');

    if (looksLikeNonImage) {
      const text = await response.text().catch(() => '');
      console.error('[Media Proxy] Upstream returned non-image content', {
        path: mediaPath,
        triedUrl,
        contentType: contentTypeRaw,
        snippet: text.slice(0, 200),
      });

      return NextResponse.json(
        {
          error: 'Upstream did not return an image',
          contentType: contentTypeRaw || null,
        },
        {
          status: 502,
          headers: {
            'Cache-Control': 'no-store',
          },
        }
      );
    }

    const imageBlob = await response.blob();

    return new NextResponse(imageBlob, {
      headers: {
        'Content-Type': contentTypeRaw || 'application/octet-stream',
        'Cache-Control': 'private, no-store',
      },
    });
  } catch (error) {
    console.error('[Media Proxy] Error proxying image:', error);
    return NextResponse.json({ error: 'Failed to load image' }, { status: 500 });
  }
}
