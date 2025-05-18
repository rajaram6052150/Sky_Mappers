import { NextResponse } from 'next/server'

export function middleware(request) {
  // Check if user is authenticated
  const token = request.cookies.get('token')?.value
  const { pathname } = request.nextUrl

  // Protected routes
  if (pathname.startsWith('/dashboard')) {
    if (!token) {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  // Public routes - redirect to dashboard if already logged in
  if (pathname === '/' || pathname === '/register') {
    if (token) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/', '/dashboard/:path*', '/register']
}