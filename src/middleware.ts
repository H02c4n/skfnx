import createMiddleware from 'next-intl/middleware';
import { NextRequest } from 'next/server';
 
export default async function middleware(request: NextRequest) {
  const handleI18n = createMiddleware({
    locales: ['sv', 'en', 'tr'],
    defaultLocale: 'sv',
    localePrefix: 'as-needed',
  });
  return handleI18n(request);
}
 
export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)']
};