
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const AUTH_COOKIE_NAME = 'snapExtractAuth';
const PROTECTED_ROUTES = ['/', '/profile'];
const LOGIN_ROUTE = '/login';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAuthenticated = request.cookies.get(AUTH_COOKIE_NAME)?.value === 'true';

  // If trying to access a protected route and not authenticated, redirect to login
  if (PROTECTED_ROUTES.includes(pathname) && !isAuthenticated) {
    const loginUrl = new URL(LOGIN_ROUTE, request.url);
    return NextResponse.redirect(loginUrl);
  }

  // If trying to access login page and already authenticated, redirect to home
  if (pathname === LOGIN_ROUTE && isAuthenticated) {
    const homeUrl = new URL('/', request.url);
    return NextResponse.redirect(homeUrl);
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public assets like /images, /icons etc.
     */
    '/((?!api|_next/static|_next/image|favicon.ico|images/|icons/).*)',
  ],
};
