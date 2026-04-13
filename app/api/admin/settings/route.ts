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

  const settings = await prisma.siteSetting.findMany()
  return NextResponse.json(settings)
}

export async function POST(request: Request) {
  const cookieStore = await cookies()
  const token = cookieStore.get('admin_token')?.value

  if (!token || !verifyAuth(token)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { key, value } = await request.json()

    const setting = await prisma.siteSetting.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    })

    return NextResponse.json(setting)
  } catch (error) {
    console.error('Error saving setting:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
