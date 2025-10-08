import { NextResponse, NextRequest } from 'next/server'
// This is an example of how to read a JSON Web Token from an API route
import { getToken } from "next-auth/jwt" 

export { default } from "next-auth/middleware"
// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {

    const token = await getToken({req: request})
    const url = request.nextUrl.pathname;

    if (token && (
        url.startsWith('/signin') ||
        url.startsWith('/signup') ||
        url === '/' ||
        url.startsWith('/verify')
    )) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    if (!token && (
        url.startsWith('/dashboard') 
    )) {
        return NextResponse.redirect(new URL('/signin', request.url))
    }
}
 
export const config = {
  matcher: [
    '/',
    '/signin',
    '/signup',
    '/verify/:path*',
    '/dashboard/:path*',
  ]
}