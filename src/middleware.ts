import createMiddleware from 'next-intl/middleware';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { routing } from './i18n/routing';

// Create the next-intl middleware
const intlMiddleware = createMiddleware({
  locales: routing.locales,
  defaultLocale: routing.defaultLocale,
});

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Handle verify-email and reset-password query params
  if (
    pathname.includes('/auth/verify-email') ||
    pathname.includes('/auth/reset-password')
  ) {
    const searchParams = request.nextUrl.searchParams;
    const uid = searchParams.get('uid');
    const token = searchParams.get('token');

    // If uid and token are present, store them in a cookie and redirect to clean URL
    if (uid && token) {
      const cookieName =
        pathname.includes('/verify-email') ? 'verify_context' : 'reset_context';

      const response = NextResponse.redirect(
        new URL(pathname, request.url)
      );

      response.cookies.set(cookieName, JSON.stringify({ uid, token }), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 15 * 60,
        path: pathname.split('?')[0],
      });

      return response;
    }
  }

  // Apply next-intl middleware
  return intlMiddleware(request);
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
