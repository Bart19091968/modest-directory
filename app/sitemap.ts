import { MetadataRoute } from 'next'

export const dynamic = 'force-dynamic'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://modestdirectory.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Import prisma here to avoid build-time issues
  const { default: prisma } = await import('@/lib/db')
  
  try {
    const shops = await prisma.shop.findMany({
      where: { status: 'APPROVED' },
      select: { slug: true, updatedAt: true },
    })

    const shopUrls = shops.map(shop => ({
      url: `${SITE_URL}/shops/${shop.slug}`,
      lastModified: shop.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))

    return [
      {
        url: SITE_URL,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1,
      },
      {
        url: `${SITE_URL}/shops`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.9,
      },
      {
        url: `${SITE_URL}/aanmelden`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.6,
      },
      ...shopUrls,
    ]
  } catch {
    return [
      {
        url: SITE_URL,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1,
      },
    ]
  }
}