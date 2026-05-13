import { NextResponse } from 'next/server'
import { createHash } from 'crypto'
import prisma from '@/lib/db'
import { detectBot } from '@/lib/analytics/botDetection'

export const dynamic = 'force-dynamic'

function hashIp(ip: string): string {
  // Daily salt so the same IP hashes differently each day (privacy)
  const day = new Date().toISOString().slice(0, 10)
  return createHash('sha256').update(`${ip}:${day}`).digest('hex').slice(0, 16)
}

function getIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0].trim()
  return request.headers.get('x-real-ip') || 'unknown'
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const path: string = body.path ?? '/'
    const userAgent: string = body.userAgent ?? request.headers.get('user-agent') ?? ''
    const source: string = body.source ?? 'client'

    // Skip admin and API paths
    if (path.startsWith('/admin') || path.startsWith('/api')) {
      return NextResponse.json({ ok: true })
    }

    const ip = getIp(request)
    const visitorId = hashIp(ip)
    const botResult = detectBot(userAgent)

    await prisma.pageView.create({
      data: {
        path,
        visitorId,
        isBot: botResult.isBot,
        botName: botResult.isBot ? botResult.botName : null,
      },
    })

    return NextResponse.json({ ok: true })
  } catch {
    // Never let tracking errors affect the user experience
    return NextResponse.json({ ok: false }, { status: 200 })
  }
}
