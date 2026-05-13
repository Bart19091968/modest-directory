import { NextResponse, type NextRequest } from 'next/server'
import { detectBot } from '@/lib/analytics/botDetection'

export function middleware(request: NextRequest) {
  const userAgent = request.headers.get('user-agent') ?? ''
  const botResult = detectBot(userAgent)

  // Only fire tracking for known bots — humans are tracked client-side via PageViewTracker
  if (botResult.isBot) {
    const trackUrl = new URL('/api/track', request.url)
    fetch(trackUrl.toString(), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        path: request.nextUrl.pathname,
        userAgent,
        source: 'bot',
      }),
    }).catch(() => {})
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon|robots|sitemap|icon|opengraph|manifest|api|admin).*)',
  ],
}
