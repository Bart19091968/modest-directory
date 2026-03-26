import { NextResponse } from 'next/server'
import prisma from '@/lib/db'
import bcrypt from 'bcryptjs'
import { verifyAuth, getAdminId } from '@/lib/auth'
import { cookies } from 'next/headers'

export async function POST(request: Request) {
  const cookieStore = await cookies()
  const token = cookieStore.get('admin_token')?.value
  
  if (!token || !verifyAuth(token)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { currentPassword, newPassword } = await request.json()

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: 'Beide wachtwoorden zijn verplicht' }, { status: 400 })
    }

    if (newPassword.length < 8) {
      return NextResponse.json({ error: 'Nieuw wachtwoord moet minimaal 8 tekens zijn' }, { status: 400 })
    }

    const adminId = await getAdminId()
    if (!adminId) {
      return NextResponse.json({ error: 'Admin niet gevonden' }, { status: 404 })
    }

    const admin = await prisma.admin.findUnique({
      where: { id: adminId },
    })

    if (!admin) {
      return NextResponse.json({ error: 'Admin niet gevonden' }, { status: 404 })
    }

    const validPassword = await bcrypt.compare(currentPassword, admin.passwordHash)
    if (!validPassword) {
      return NextResponse.json({ error: 'Huidig wachtwoord is onjuist' }, { status: 401 })
    }

    const newHash = await bcrypt.hash(newPassword, 12)

    await prisma.admin.update({
      where: { id: adminId },
      data: { passwordHash: newHash },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Password change error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
