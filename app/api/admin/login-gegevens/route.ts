import { NextResponse } from 'next/server'
import prisma from '@/lib/db'
import bcrypt from 'bcryptjs'
import { getAdminId, isAdmin } from '@/lib/auth'

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const adminId = await getAdminId()
  const admin = await prisma.admin.findUnique({ where: { id: adminId! }, select: { email: true } })
  if (!admin) return NextResponse.json({ error: 'Niet gevonden' }, { status: 404 })

  return NextResponse.json({ email: admin.email })
}

export async function POST(request: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { newEmail, currentPassword } = await request.json()

  if (!newEmail || !currentPassword) {
    return NextResponse.json({ error: 'E-mailadres en huidig wachtwoord zijn verplicht' }, { status: 400 })
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(newEmail)) {
    return NextResponse.json({ error: 'Ongeldig e-mailadres' }, { status: 400 })
  }

  const adminId = await getAdminId()
  const admin = await prisma.admin.findUnique({ where: { id: adminId! } })
  if (!admin) return NextResponse.json({ error: 'Niet gevonden' }, { status: 404 })

  const valid = await bcrypt.compare(currentPassword, admin.passwordHash)
  if (!valid) return NextResponse.json({ error: 'Huidig wachtwoord is onjuist' }, { status: 401 })

  const taken = await prisma.admin.findFirst({ where: { email: newEmail, NOT: { id: adminId! } } })
  if (taken) return NextResponse.json({ error: 'Dit e-mailadres is al in gebruik' }, { status: 409 })

  await prisma.admin.update({ where: { id: adminId! }, data: { email: newEmail } })

  return NextResponse.json({ success: true })
}
