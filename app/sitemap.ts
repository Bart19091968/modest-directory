import { MetadataRoute } from 'next'
import prisma from '@/lib/db'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.modestdirectory.be'

export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${BASE_URL}/shops`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/faq`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/aanmelden`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ]

  // Shop pages
  const shops = await prisma.shop.findMany({
    where: { status: 'APPROVED' },
    select: { slug: true, updatedAt: true },
  })

  const shopPages: MetadataRoute.Sitemap = shops.map(shop => ({
    url: `${BASE_URL}/shops/${shop.slug}`,
    lastModified: shop.updatedAt,
    changeFrequency: 'weekly',
    priority: 0.7,
  }))

  // Blog pages
  const posts = await prisma.blogPost.findMany({
    where: { isPublished: true },
    select: { slug: true, updatedAt: true },
  })

  const blogPages: MetadataRoute.Sitemap = posts.map(post => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: post.updatedAt,
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  // Category + Location SEO pages
  const categories = ['hijab-shops', 'abaya-shops', 'modest-fashion', 'islamitische-kleding', 'jilbab-shops']
  const countries = await prisma.country.findMany({ select: { slug: true } })
  const cities = await prisma.city.findMany({ select: { slug: true } })

  const seoPages: MetadataRoute.Sitemap = []

  for (const category of categories) {
    // Country pages
    for (const country of countries) {
      seoPages.push({
        url: `${BASE_URL}/${category}/${country.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      })
    }

    // City pages
    for (const city of cities) {
      seoPages.push({
        url: `${BASE_URL}/${category}/${city.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.7,
      })
    }
  }

  return [...staticPages, ...shopPages, ...blogPages, ...seoPages]
}
