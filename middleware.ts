import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Get the token to check if user is authenticated
  const token = await getToken({ 
    req: request, 
    secret: process.env.NEXTAUTH_SECRET 
  });
  
  // Protected routes that require authentication
  const protectedRoutes = ['/discover', '/matches', '/onboarding'];
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  
  // Auth routes that shouldn't be accessible when logged in
  const authRoutes = ['/auth/signin', '/auth/signup'];
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));
  
  // Redirect to signin if accessing protected routes without authentication
  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL('/auth/signin', request.url));
  }
  
  // Redirect to dashboard if accessing auth routes while authenticated
  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  
  // Special handling for profile setup - redirect to onboarding instead
  if (pathname === '/profile/setup') {
    return NextResponse.redirect(new URL('/onboarding', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/discover/:path*',
    '/matches/:path*',
    '/onboarding/:path*',
    '/profile/setup',
    '/auth/signin',
    '/auth/signup'
  ],
};