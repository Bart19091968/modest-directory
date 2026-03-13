import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { isAdmin } from '@/lib/auth'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await isAdmin()
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params

  const sponsor = await prisma.sponsor.findUnique({
    where: { id },
  })

  if (!sponsor) {
    return NextResponse.json({ error: 'Sponsor not found' }, { status: 404 })
  }

  const updated = await prisma.sponsor.update({
    where: { id },
    data: { isActive: !sponsor.isActive },
  })

  return NextResponse.json({ isActive: updated.isActive })
}