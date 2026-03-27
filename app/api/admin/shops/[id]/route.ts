import { NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { verifyAuth } from '@/lib/auth'
import { cookies } from 'next/headers'

export const dynamic = 'force-dynamic'

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

// GET /api/admin/shops/[id] — fetch shop with categories
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const cookieStore = await cookies()
  const token = cookieStore.get('admin_token')?.value

  if (!token || !verifyAuth(token)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const shop = await prisma.shop.findUnique({
      where: { id: params.id },
      include: {
        categories: {
          include: { category: true },
        },
      },
    })

    if (!shop) {
      return NextResponse.json({ error: 'Winkel niet gevonden' }, { status: 404 })
    }

    // Fetch all available categories
    const allCategories = await prisma.category.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
    })

    return NextResponse.json({ shop, allCategories })
  } catch (error) {
    console.error('Error fetching shop:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

// PUT /api/admin/shops/[id] — update shop + categories
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const cookieStore = await cookies()
  const token = cookieStore.get('admin_token')?.value

  if (!token || !verifyAuth(token)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const {
      name,
      shortDescription,
      longDescription,
      address,
      city,
      country,
      websiteUrl,
      email,
      phone,
      logoUrl,
      photos,
      isPhysicalStore,
      isWebshop,
      isFeatured,
      status,
      categoryIds,
      // Google Places
      googlePlaceId,
      googleName,
      googleAddress,
      googleRating,
      googleReviewCount,
      googleReviewsUrl,
      googleLastSyncedAt,
    } = body

    // Validate required fields
    if (!name || !shortDescription) {
      return NextResponse.json(
        { error: 'Naam en korte beschrijving zijn verplicht' },
        { status: 400 }
      )
    }

    // Check if shop exists
    const existing = await prisma.shop.findUnique({ where: { id: params.id } })
    if (!existing) {
      return NextResponse.json({ error: 'Winkel niet gevonden' }, { status: 404 })
    }

    // Generate new slug if name changed
    let slug = existing.slug
    if (name !== existing.name) {
      slug = generateSlug(name)
      // Check slug uniqueness
      const slugExists = await prisma.shop.findFirst({
        where: { slug, id: { not: params.id } },
      })
      if (slugExists) {
        slug = `${slug}-${Date.now().toString(36)}`
      }
    }

    const citySlug = city ? generateSlug(city) : null

    // Update shop
    const updatedShop = await prisma.shop.update({
      where: { id: params.id },
      data: {
        name,
        slug,
        shortDescription: shortDescription.substring(0, 200),
        longDescription: longDescription || null,
        address: address || null,
        city: city || null,
        citySlug,
        country: country || 'BE',
        websiteUrl: websiteUrl || null,
        email: email || null,
        phone: phone || null,
        logoUrl: logoUrl || null,
        photos: photos || [],
        isPhysicalStore: !!isPhysicalStore,
        isWebshop: !!isWebshop,
        isFeatured: !!isFeatured,
        status: status || existing.status,
        // Google Places
        googlePlaceId: googlePlaceId || null,
        googleName: googleName || null,
        googleAddress: googleAddress || null,
        googleRating: googleRating != null ? parseFloat(googleRating) : null,
        googleReviewCount: googleReviewCount != null ? parseInt(googleReviewCount) : null,
        googleReviewsUrl: googleReviewsUrl || null,
        googleLastSyncedAt: googleLastSyncedAt ? new Date(googleLastSyncedAt) : null,
      },
    })

    // Update categories: delete all existing, then create new ones
    if (Array.isArray(categoryIds)) {
      await prisma.shopCategory.deleteMany({
        where: { shopId: params.id },
      })

      if (categoryIds.length > 0) {
        await prisma.shopCategory.createMany({
          data: categoryIds.map((categoryId: string) => ({
            shopId: params.id,
            categoryId,
          })),
        })
      }
    }

    // Fetch updated shop with categories
    const result = await prisma.shop.findUnique({
      where: { id: params.id },
      include: {
        categories: {
          include: { category: true },
        },
      },
    })

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error updating shop:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
