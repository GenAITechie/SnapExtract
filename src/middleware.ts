
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const AUTH_COOKIE_NAME = 'snapExtractAuth';
const PROTECTED_ROUTES = ['/', '/profile']; 
const LOGIN_ROUTE = '/login';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAuthenticated = request.cookies.get(AUTH_COOKIE_NAME)?.value === 'true';

  const isProtectedRoute = PROTECTED_ROUTES.includes(pathname);

  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = new URL(LOGIN_ROUTE, request.url);
    return NextResponse.redirect(loginUrl);
  }

  if (pathname === LOGIN_ROUTE && isAuthenticated) {
    const homeUrl = new URL('/', request.url);
    return NextResponse.redirect(homeUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|images/|icons/).*)',
  ],
};
