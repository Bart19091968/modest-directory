import { NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { verifyAuth } from '@/lib/auth'
import { cookies } from 'next/headers'

export const dynamic = 'force-dynamic'

export async function GET() {
  const cookieStore = await cookies()
  const token = cookieStore.get('admin_token')?.value
  
  if (!token || !verifyAuth(token)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const ads = await prisma.adPlacement.findMany({
    orderBy: { slot: 'asc' },
  })

  return NextResponse.json(ads)
}

export async function PATCH(request: Request) {
  const cookieStore = await cookies()
  const token = cookieStore.get('admin_token')?.value
  
  if (!token || !verifyAuth(token)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { id, code, isActive } = await request.json()

    const ad = await prisma.adPlacement.update({
      where: { id },
      data: { code, isActive },
    })

    return NextResponse.json(ad)
  } catch (error) {
    console.error('Error updating ad:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
