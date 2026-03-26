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

  const sponsors = await prisma.sponsor.findMany({
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(sponsors)
}

export async function POST(request: Request) {
  const cookieStore = await cookies()
  const token = cookieStore.get('admin_token')?.value
  
  if (!token || !verifyAuth(token)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { name, bannerUrl, linkUrl, position } = await request.json()

    const sponsor = await prisma.sponsor.create({
      data: {
        name,
        bannerUrl,
        linkUrl,
        position: position || 'SIDEBAR',
        isActive: true,
      },
    })

    return NextResponse.json(sponsor)
  } catch (error) {
    console.error('Error creating sponsor:', error)
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
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'ID verplicht' }, { status: 400 })
    }

    await prisma.sponsor.delete({ where: { id } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting sponsor:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
