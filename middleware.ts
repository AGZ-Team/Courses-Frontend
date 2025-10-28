import createMiddleware from 'next-intl/middleware';
import {routing} from './src/i18n/routing';

export default createMiddleware(routing);

// Match "/" and any localized path "/(en|ar)/:path*"
export const config = {
  matcher: ['/', '/(en|ar)/:path*']
};