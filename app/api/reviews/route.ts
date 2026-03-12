import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { sendVerificationEmail } from '@/lib/email'
import { z } from 'zod'

const reviewSchema = z.object({
  shopId: z.string().min(1),
  reviewerName: z.string().min(2).max(100),
  reviewerEmail: z.string().email(),
  score: z.number().int().min(1).max(5),
  reviewText: z.string().min(10).max(2000),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const data = reviewSchema.parse(body)

    // Check if shop exists
    const shop = await prisma.shop.findUnique({
      where: { id: data.shopId, status: 'APPROVED' },
    })

    if (!shop) {
      return NextResponse.json(
        { error: 'Winkel niet gevonden' },
        { status: 404 }
      )
    }

    // Create review (unverified)
    const review = await prisma.review.create({
      data: {
        shopId: data.shopId,
        reviewerName: data.reviewerName,
        reviewerEmail: data.reviewerEmail,
        score: data.score,
        reviewText: data.reviewText,
        isVerified: false,
      },
    })

    // Send verification email
    await sendVerificationEmail(
      data.reviewerEmail,
      data.reviewerName,
      shop.name,
      data.score,
      data.reviewText,
      review.verificationToken
    )

    return NextResponse.json({ success: true, reviewId: review.id })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Ongeldige gegevens', details: error.errors },
        { status: 400 }
      )
    }
    console.error('Review error:', error)
    return NextResponse.json(
      { error: 'Er ging iets mis' },
      { status: 500 }
    )
  }
}
