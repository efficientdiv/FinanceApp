import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const isPublic = ['/login', '/signup'].some((p) => pathname.startsWith(p))
  const isApi = pathname.startsWith('/api/')

  if (isPublic || isApi) return NextResponse.next()

  // NextAuth v5 JWT session cookie (plain HTTP uses first, HTTPS uses __Secure- prefix)
  const sessionToken =
    request.cookies.get('authjs.session-token') ??
    request.cookies.get('__Secure-authjs.session-token')

  if (!sessionToken) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|public/).*)'],
}
