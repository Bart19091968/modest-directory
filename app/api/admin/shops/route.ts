import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { isAdmin } from '@/lib/auth'

export async function PATCH(request: NextRequest) {
  if (!await isAdmin()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { shopId, status } = await request.json()

    if (!['APPROVED', 'REJECTED', 'PENDING'].includes(status)) {
      return NextResponse.json({ error: 'Ongeldige status' }, { status: 400 })
    }

    await prisma.shop.update({
      where: { id: shopId },
      data: { status },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Shop update error:', error)
    return NextResponse.json({ error: 'Er ging iets mis' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  if (!await isAdmin()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { shopId } = await request.json()

    await prisma.shop.delete({
      where: { id: shopId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Shop delete error:', error)
    return NextResponse.json({ error: 'Er ging iets mis' }, { status: 500 })
  }
}
