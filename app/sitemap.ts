import { MetadataRoute } from 'next'
import prisma from '@/lib/db'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://modestdirectory.be'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
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
}
