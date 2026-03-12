import { Metadata } from 'next'

const SITE_NAME = 'ModestDirectory'
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://modestdirectory.be'

export function generateShopMetadata(shop: {
  name: string
  slug: string
  shortDescription: string
  city?: string | null
  country: string
}): Metadata {
  const location = shop.city ? `${shop.city}, ${shop.country}` : shop.country
  const title = `${shop.name} - Islamitische Kleding ${location} | ${SITE_NAME}`
  const description = shop.shortDescription

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/shops/${shop.slug}`,
      siteName: SITE_NAME,
      type: 'website',
    },
    twitter: {
      card: 'summary',
      title,
      description,
    },
    alternates: {
      canonical: `${SITE_URL}/shops/${shop.slug}`,
    },
  }
}

export function generateShopJsonLd(shop: {
  name: string
  slug: string
  shortDescription: string
  longDescription?: string | null
  address?: string | null
  city?: string | null
  country: string
  websiteUrl?: string | null
  phone?: string | null
  email?: string | null
  isPhysicalStore: boolean
  averageRating?: number
  reviewCount?: number
}) {
  const jsonLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': shop.isPhysicalStore ? 'ClothingStore' : 'OnlineStore',
    name: shop.name,
    description: shop.longDescription || shop.shortDescription,
    url: shop.websiteUrl || `${SITE_URL}/shops/${shop.slug}`,
  }

  if (shop.address && shop.city) {
    jsonLd.address = {
      '@type': 'PostalAddress',
      streetAddress: shop.address,
      addressLocality: shop.city,
      addressCountry: shop.country,
    }
  }

  if (shop.phone) {
    jsonLd.telephone = shop.phone
  }

  if (shop.email) {
    jsonLd.email = shop.email
  }

  if (shop.reviewCount && shop.reviewCount > 0) {
    jsonLd.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: shop.averageRating?.toFixed(1) || '0',
      reviewCount: shop.reviewCount,
      bestRating: '5',
      worstRating: '1',
    }
  }

  return jsonLd
}

export function generateDirectoryJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    description: 'Directory van islamitische kledingwinkels in Nederland en België. Vind hijab shops, abaya winkels en modest fashion.',
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE_URL}/shops?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  }
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')
}
