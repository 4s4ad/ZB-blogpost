import createMiddleware from 'next-intl/middleware'
import { NextResponse, type NextRequest } from 'next/server'
import { locales, defaultLocale } from '@/i18n/config'

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always'
})

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip locale routing for admin routes
  if (pathname.startsWith('/admin')) {
    if (!pathname.startsWith('/admin/login')) {
      const sessionCookie = request.cookies?.get('admin_session')
      if (!sessionCookie) {
        const loginUrl = new URL('/admin/login', request.url)
        loginUrl.searchParams.set('from', pathname)
        return NextResponse.redirect(loginUrl)
      }
    }
    return NextResponse.next()
  }

  // Skip locale routing for API routes and static files
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.includes('.')
  ) {
    return NextResponse.next()
  }

  // Apply locale middleware for public routes
  return intlMiddleware(request)
}

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)']
}
