import createMiddleware from 'next-intl/middleware';
import {routing} from './src/i18n/routing';

export default createMiddleware(routing);

// Match all paths including root, but exclude static files and API routes
export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};