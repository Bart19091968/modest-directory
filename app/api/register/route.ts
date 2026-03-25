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
      city, 
      country, 
      websiteUrl, 
      phone,
      isPhysicalStore, 
      isWebshop,
      logoUrl,
      photos,
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

    // Validate invoice fields if requested
    if (invoiceRequested) {
      if (!invoiceCompanyName || !invoiceVatNumber || !invoiceAddress || !invoiceEmail) {
        return NextResponse.json({ error: 'Alle factuurgegevens zijn verplicht' }, { status: 400 })
      }
    }

    let slug = generateSlug(name)
    
    // Check if slug exists
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
        city,
        citySlug,
        country: country || 'BE',
        websiteUrl,
        email,
        phone,
        logoUrl: logoUrl || null,
        photos: photos || [],
        isPhysicalStore: isPhysicalStore || false,
        isWebshop: isWebshop !== false,
        status: 'PENDING',
        // Invoice fields
        invoiceRequested: invoiceRequested || false,
        invoiceCompanyName: invoiceCompanyName || null,
        invoiceVatNumber: invoiceVatNumber || null,
        invoiceAddress: invoiceAddress || null,
        invoiceEmail: invoiceEmail || null,
      },
    })

    // Send notification to admin
    await sendNewShopNotification(name, email, city, invoiceRequested)

    return NextResponse.json({ success: true, shopId: shop.id })
  } catch (error) {
    console.error('Register error:', error)
    return NextResponse.json({ error: 'Er ging iets mis' }, { status: 500 })
  }
}
