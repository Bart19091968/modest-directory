import { NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { sendVerificationEmail } from '@/lib/email'
import crypto from 'crypto'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { shopId, reviewerName, reviewerEmail, score, reviewText } = body

    if (!shopId || !reviewerName || !reviewerEmail || !score || !reviewText) {
      return NextResponse.json({ error: 'Alle velden zijn verplicht' }, { status: 400 })
    }

    if (score < 1 || score > 5) {
      return NextResponse.json({ error: 'Score moet tussen 1 en 5 zijn' }, { status: 400 })
    }

    const shop = await prisma.shop.findUnique({ where: { id: shopId } })
    if (!shop) {
      return NextResponse.json({ error: 'Winkel niet gevonden' }, { status: 404 })
    }

    const verificationToken = crypto.randomBytes(32).toString('hex')
    const tokenExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

    const review = await prisma.review.create({
      data: {
        shopId,
        reviewerName,
        reviewerEmail,
        score,
        reviewText,
        verificationToken,
        tokenExpiresAt,
      },
    })

    await sendVerificationEmail(reviewerEmail, shop.name, verificationToken)

    return NextResponse.json({ success: true, reviewId: review.id })
  } catch (error) {
    console.error('Review error:', error)
    return NextResponse.json({ error: 'Er ging iets mis' }, { status: 500 })
  }
}
