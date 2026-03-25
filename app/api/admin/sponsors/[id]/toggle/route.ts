import { NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { verifyAuth } from '@/lib/auth'
import { cookies } from 'next/headers'

export const dynamic = 'force-dynamic'

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const cookieStore = await cookies()
  const token = cookieStore.get('admin_token')?.value
  
  if (!token || !verifyAuth(token)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const sponsor = await prisma.sponsor.findUnique({ where: { id: params.id } })

    if (!sponsor) {
      return NextResponse.json({ error: 'Niet gevonden' }, { status: 404 })
    }

    const updated = await prisma.sponsor.update({
      where: { id: params.id },
      data: { isActive: !sponsor.isActive },
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error('Error toggling sponsor:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
