import { NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { sendNewShopNotification } from '@/lib/email'

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      name,
      email,
      shortDescription,
      longDescription,
      address,
      city,
      country,
      websiteUrl,
      phone,
      isPhysicalStore,
      isWebshop,
      logoUrl,
      photos,
      subscriptionTier,
      categoryIds,
      openingHours,
      facebookUrl,
      instagramUrl,
      pinterestUrl,
      youtubeUrl,
      tiktokUrl,
      // Invoice fields
      invoiceRequested,
      invoiceCompanyName,
      invoiceVatNumber,
      invoiceAddress,
      invoiceEmail,
    } = body

    if (!name || !email || !shortDescription) {
      return NextResponse.json({ error: 'Naam, email en beschrijving zijn verplicht' }, { status: 400 })
    }

    if (shortDescription.length > 200) {
      return NextResponse.json({ error: 'Beschrijving mag max. 200 tekens zijn' }, { status: 400 })
    }

    if (invoiceRequested) {
      if (!invoiceCompanyName || !invoiceVatNumber || !invoiceAddress || !invoiceEmail) {
        return NextResponse.json({ error: 'Alle factuurgegevens zijn verplicht' }, { status: 400 })
      }
    }

    const tier = (['BRONZE', 'SILVER', 'GOLD'] as const).includes(subscriptionTier) ? subscriptionTier as 'BRONZE' | 'SILVER' | 'GOLD' : null
    const isFeatured = tier === 'SILVER' || tier === 'GOLD'

    let slug = generateSlug(name)
    const existing = await prisma.shop.findUnique({ where: { slug } })
    if (existing) {
      slug = `${slug}-${Date.now().toString(36)}`
    }

    const citySlug = city ? generateSlug(city) : null

    const shop = await prisma.shop.create({
      data: {
        name,
        slug,
        shortDescription,
        longDescription: (tier === 'SILVER' || tier === 'GOLD') ? (longDescription || null) : null,
        address: address || null,
        city,
        citySlug,
        country: country || 'BE',
        websiteUrl: websiteUrl || null,
        email,
        phone: phone || null,
        logoUrl: logoUrl || null,
        photos: photos || [],
        isPhysicalStore: isPhysicalStore || false,
        isWebshop: isWebshop !== false,
        isFeatured,
        status: 'PENDING',
        subscriptionTier: tier,
        openingHours: tier === 'GOLD' ? (openingHours || null) : null,
        facebookUrl: tier === 'GOLD' ? (facebookUrl || null) : null,
        instagramUrl: tier === 'GOLD' ? (instagramUrl || null) : null,
        pinterestUrl: tier === 'GOLD' ? (pinterestUrl || null) : null,
        youtubeUrl: tier === 'GOLD' ? (youtubeUrl || null) : null,
        tiktokUrl: tier === 'GOLD' ? (tiktokUrl || null) : null,
        // Invoice fields
        invoiceRequested: invoiceRequested || false,
        invoiceCompanyName: invoiceCompanyName || null,
        invoiceVatNumber: invoiceVatNumber || null,
        invoiceAddress: invoiceAddress || null,
        invoiceEmail: invoiceEmail || null,
      },
    })

    // Link categories — default to "Islamitische Kleding" when none selected
    if (Array.isArray(categoryIds) && categoryIds.length > 0) {
      await prisma.shopCategory.createMany({
        data: categoryIds.map((categoryId: string) => ({ shopId: shop.id, categoryId })),
        skipDuplicates: true,
      })
    } else {
      const defaultCat = await prisma.category.findUnique({ where: { slug: 'islamitische-kleding' } })
      if (defaultCat) {
        await prisma.shopCategory.create({ data: { shopId: shop.id, categoryId: defaultCat.id } })
      }
    }

    await sendNewShopNotification(name, email, city, invoiceRequested)

    return NextResponse.json({ success: true, shopId: shop.id })
  } catch (error) {
    console.error('Register error:', error)
    return NextResponse.json({ error: 'Er ging iets mis' }, { status: 500 })
  }
}
