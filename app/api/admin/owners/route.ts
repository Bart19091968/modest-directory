import { NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { isAdmin } from '@/lib/auth'
import bcrypt from 'bcryptjs'

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const owners = await prisma.shopOwner.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      shops: { select: { id: true, name: true, slug: true, status: true } },
    },
  })

  return NextResponse.json(owners)
}

export async function POST(request: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { email, password, shopId } = await request.json()

  if (!email || !password) {
    return NextResponse.json({ error: 'Email en wachtwoord zijn verplicht' }, { status: 400 })
  }
  if (password.length < 8) {
    return NextResponse.json({ error: 'Wachtwoord minimaal 8 tekens' }, { status: 400 })
  }

  const hashedPassword = await bcrypt.hash(password, 12)

  const existing = await prisma.shopOwner.findUnique({ where: { email } })
  if (existing) {
    const updated = await prisma.shopOwner.update({
      where: { email },
      data: {
        hashedPassword,
        ...(shopId ? { shops: { connect: { id: shopId } } } : {}),
      },
    })
    return NextResponse.json({ success: true, id: updated.id, updated: true })
  }

  const owner = await prisma.shopOwner.create({
    data: {
      email,
      hashedPassword,
      ...(shopId ? { shops: { connect: { id: shopId } } } : {}),
    },
  })
  return NextResponse.json({ success: true, id: owner.id, updated: false })
}

export async function DELETE(request: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'ID ontbreekt' }, { status: 400 })

  await prisma.shopOwner.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
