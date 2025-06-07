
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This middleware is currently a pass-through, ensuring all routes are accessible.
// Authentication logic has been removed, and the app is intended for public access.
// It can be adapted for other purposes (e.g., analytics, A/B testing) in the future if needed.
export function middleware(request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Apply middleware to all routes except for API, Next.js internals, static files, etc.
    '/((?!api|_next/static|_next/image|favicon.ico|images/|icons/).*)',
  ],
};
