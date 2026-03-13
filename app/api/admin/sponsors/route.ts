import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { isAdmin } from '@/lib/auth'

export async function POST(request: NextRequest) {
  const admin = await isAdmin()
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const data = await request.json()

  const sponsor = await prisma.sponsor.create({
    data: {
      name: data.name,
      bannerUrl: data.bannerUrl,
      linkUrl: data.linkUrl,
      position: data.position,
      isActive: data.isActive ?? true,
      endDate: data.endDate ? new Date(data.endDate) : null,
    },
  })

  return NextResponse.json(sponsor)
}

export async function DELETE(request: NextRequest) {
  const admin = await isAdmin()
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { sponsorId } = await request.json()

  await prisma.sponsor.delete({
    where: { id: sponsorId },
  })

  return NextResponse.json({ success: true })
}