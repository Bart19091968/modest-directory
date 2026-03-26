import { NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { verifyAuth } from '@/lib/auth'
import { cookies } from 'next/headers'

export const dynamic = 'force-dynamic'

export async function DELETE(request: Request) {
  const cookieStore = await cookies()
  const token = cookieStore.get('admin_token')?.value
  
  if (!token || !verifyAuth(token)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { reviewId } = await request.json()

    await prisma.review.delete({
      where: { id: reviewId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting review:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
