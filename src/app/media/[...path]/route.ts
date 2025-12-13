import { NextRequest } from 'next/server';
import { proxyMedia } from '@/lib/mediaProxy';

export async function GET(
  request: NextRequest,
  ctx: { params: Promise<{ path: string[] }> }
) {
  const { params } = ctx;
  const resolvedParams = await params;
  const mediaPathSegments = Array.isArray(resolvedParams?.path) ? resolvedParams.path : [];
  return proxyMedia(request, mediaPathSegments);
}
