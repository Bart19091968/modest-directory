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

  const shop = await prisma.shop.findUnique({
    where: { id },
  })

  if (!shop) {
    return NextResponse.json({ error: 'Shop not found' }, { status: 404 })
  }

  const updated = await prisma.shop.update({
    where: { id },
    data: { isFeatured: !shop.isFeatured },
  })

  return NextResponse.json({ isFeatured: updated.isFeatured })
}