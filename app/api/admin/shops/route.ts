import { NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { verifyAuth } from '@/lib/auth'
import { cookies } from 'next/headers'

export const dynamic = 'force-dynamic'

export async function PATCH(request: Request) {
  const cookieStore = await cookies()
  const token = cookieStore.get('admin_token')?.value
  
  if (!token || !verifyAuth(token)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { shopId, status } = await request.json()

    if (!shopId || !status) {
      return NextResponse.json({ error: 'Shop ID en status zijn verplicht' }, { status: 400 })
    }

    const shop = await prisma.shop.update({
      where: { id: shopId },
      data: { status },
    })

    return NextResponse.json(shop)
  } catch (error) {
    console.error('Error updating shop:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  const cookieStore = await cookies()
  const token = cookieStore.get('admin_token')?.value
  
  if (!token || !verifyAuth(token)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { shopId } = await request.json()

    if (!shopId) {
      return NextResponse.json({ error: 'Shop ID is verplicht' }, { status: 400 })
    }

    await prisma.shop.delete({
      where: { id: shopId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting shop:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
