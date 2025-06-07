
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Login functionality has been removed, so middleware is simplified.
// It can be used for other purposes in the future if needed.
export function middleware(request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Apply middleware to all routes except for API, Next.js internals, static files, etc.
    '/((?!api|_next/static|_next/image|favicon.ico|images/|icons/).*)',
  ],
};
