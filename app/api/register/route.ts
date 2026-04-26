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
      categorySlugs,
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

    // Link categories by slug — upsert so they always exist
    const slugsToLink: string[] = Array.isArray(categorySlugs) && categorySlugs.length > 0
      ? categorySlugs
      : ["islamitische-kleding"]

    for (const slug of slugsToLink) {
      const cat = await prisma.category.upsert({
        where: { slug },
        update: {},
        create: {
          slug,
          name: slug === "hijab-shops" ? "Hijab Shops" : slug === "abaya-shops" ? "Abaya Winkels" : "Islamitische Kleding",
          namePlural: slug === "hijab-shops" ? "Hijab Shops" : slug === "abaya-shops" ? "Abaya Winkels" : "Islamitische Kledingwinkels",
          icon: slug === "hijab-shops" ? "🧕" : slug === "abaya-shops" ? "👗" : "🌙",
          sortOrder: slug === "hijab-shops" ? 1 : slug === "abaya-shops" ? 2 : 4,
          isActive: true,
        },
      })
      await prisma.shopCategory.upsert({
        where: { shopId_categoryId: { shopId: shop.id, categoryId: cat.id } },
        update: {},
        create: { shopId: shop.id, categoryId: cat.id },
      })
    }

    await sendNewShopNotification(name, email, city, invoiceRequested)

    return NextResponse.json({ success: true, shopId: shop.id })
  } catch (error) {
    console.error('Register error:', error)
    return NextResponse.json({ error: 'Er ging iets mis' }, { status: 500 })
  }
}
