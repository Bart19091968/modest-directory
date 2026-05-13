import { NextResponse } from 'next/server'
import prisma from '@/lib/db'
import bcrypt from 'bcryptjs'
import { createOwnerToken } from '@/lib/ownerAuth'
import { cookies } from 'next/headers'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'E-mailadres en wachtwoord zijn verplicht' }, { status: 400 })
    }

    const owner = await prisma.shopOwner.findUnique({ where: { email } })

    if (!owner) {
      return NextResponse.json({ error: 'Ongeldige inloggegevens' }, { status: 401 })
    }

    const valid = await bcrypt.compare(password, owner.hashedPassword)
    if (!valid) {
      return NextResponse.json({ error: 'Ongeldige inloggegevens' }, { status: 401 })
    }

    const token = createOwnerToken(owner.id)
    const cookieStore = await cookies()
    cookieStore.set('owner_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60,
      path: '/',
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Owner login error:', error)
    return NextResponse.json({ error: 'Er ging iets mis' }, { status: 500 })
  }
}
