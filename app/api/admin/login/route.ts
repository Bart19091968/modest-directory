import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { verifyPassword, createToken } from '@/lib/auth'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    const admin = await prisma.admin.findUnique({
      where: { email },
    })

    if (!admin) {
      return NextResponse.json(
        { error: 'Ongeldige inloggegevens' },
        { status: 401 }
      )
    }

    const valid = await verifyPassword(password, admin.passwordHash)
    if (!valid) {
      return NextResponse.json(
        { error: 'Ongeldige inloggegevens' },
        { status: 401 }
      )
    }

    const token = createToken(admin.id)
    
    const cookieStore = await cookies()
    cookieStore.set('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Er ging iets mis' },
      { status: 500 }
    )
  }
}
