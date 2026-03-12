import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { isAdmin } from '@/lib/auth'

export async function DELETE(request: NextRequest) {
  if (!await isAdmin()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { reviewId } = await request.json()

    await prisma.review.delete({
      where: { id: reviewId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Review delete error:', error)
    return NextResponse.json({ error: 'Er ging iets mis' }, { status: 500 })
  }
}
