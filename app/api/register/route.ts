import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { sendShopRegistrationNotification } from '@/lib/email'
import { slugify } from '@/lib/seo'
import { z } from 'zod'

const registerSchema = z.object({
  name: z.string().min(2).max(100),
  shortDescription: z.string().min(10).max(200),
  longDescription: z.string().max(2000).optional(),
  address: z.string().max(200).optional(),
  city: z.string().max(100).optional(),
  country: z.enum(['BE', 'NL']),
  websiteUrl: z.string().url().optional().or(z.literal('')),
  email: z.string().email(),
  phone: z.string().max(20).optional(),
  isPhysicalStore: z.boolean(),
  isWebshop: z.boolean(),
  contactName: z.string().min(2).max(100),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const data = registerSchema.parse(body)

    // Generate unique slug
    let slug = slugify(data.name)
    let counter = 1
    while (await prisma.shop.findUnique({ where: { slug } })) {
      slug = `${slugify(data.name)}-${counter}`
      counter++
    }

    // Create shop (pending approval)
    const shop = await prisma.shop.create({
      data: {
        name: data.name,
        slug,
        shortDescription: data.shortDescription,
        longDescription: data.longDescription || null,
        address: data.address || null,
        city: data.city || null,
        country: data.country,
        websiteUrl: data.websiteUrl || null,
        email: data.email,
        phone: data.phone || null,
        isPhysicalStore: data.isPhysicalStore,
        isWebshop: data.isWebshop,
        status: 'PENDING',
      },
    })

    // Notify admin
    await sendShopRegistrationNotification(
      data.name,
      data.email,
      data.contactName
    )

    return NextResponse.json({ success: true, shopId: shop.id })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Ongeldige gegevens', details: error.errors },
        { status: 400 }
      )
    }
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Er ging iets mis' },
      { status: 500 }
    )
  }
}
