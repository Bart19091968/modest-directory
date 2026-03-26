export function generateDirectoryJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'ModestDirectory',
    description: 'Vind de beste hijab shops en modest fashion winkels in Nederland en België',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://modestdirectory.be',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://modestdirectory.be'}/shops?search={search_term_string}`
      },
      'query-input': 'required name=search_term_string'
    }
  }
}

export function generateShopJsonLd(shop: {
  name: string
  slug: string
  shortDescription: string
  city?: string | null
  country: string
  websiteUrl?: string | null
  averageRating?: number
  reviewCount?: number
}) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://modestdirectory.be'
  
  return {
    '@context': 'https://schema.org',
    '@type': 'Store',
    name: shop.name,
    description: shop.shortDescription,
    url: `${siteUrl}/shops/${shop.slug}`,
    address: {
      '@type': 'PostalAddress',
      addressLocality: shop.city,
      addressCountry: shop.country
    },
    ...(shop.websiteUrl && { sameAs: [shop.websiteUrl] }),
    ...(shop.averageRating && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: shop.averageRating,
        reviewCount: shop.reviewCount || 0,
        bestRating: 5,
        worstRating: 1
      }
    })
  }
}

export function generateBlogPostJsonLd(post: {
  title: string
  slug: string
  excerpt: string
  content: string
  publishedAt: Date | null
  updatedAt?: Date
  createdAt?: Date
}) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://modestdirectory.be'
  const datePublished = post.publishedAt || post.createdAt || new Date()
  const dateModified = post.updatedAt || datePublished
  
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    url: `${siteUrl}/blog/${post.slug}`,
    datePublished: datePublished.toISOString(),
    dateModified: dateModified.toISOString(),
    author: {
      '@type': 'Organization',
      name: 'ModestDirectory'
    },
    publisher: {
      '@type': 'Organization',
      name: 'ModestDirectory',
      url: siteUrl
    }
  }
}

export function generateFAQJsonLd(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  }
}

export function generateLocalBusinessJsonLd(shop: {
  name: string
  slug: string
  shortDescription: string
  city?: string | null
  country: string
  websiteUrl?: string | null
  address?: string | null
  isPhysicalStore?: boolean
  isWebshop?: boolean
  reviews?: { score: number }[]
}) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://modestdirectory.be'
  
  const averageRating = shop.reviews && shop.reviews.length > 0
    ? shop.reviews.reduce((acc, r) => acc + r.score, 0) / shop.reviews.length
    : null

  return {
    '@context': 'https://schema.org',
    '@type': shop.isPhysicalStore ? 'ClothingStore' : 'Store',
    name: shop.name,
    description: shop.shortDescription,
    url: `${siteUrl}/shops/${shop.slug}`,
    ...(shop.websiteUrl && { sameAs: [shop.websiteUrl] }),
    ...(shop.city && {
      address: {
        '@type': 'PostalAddress',
        addressLocality: shop.city,
        addressCountry: shop.country === 'NL' ? 'Nederland' : 'België',
      }
    }),
    ...(averageRating && shop.reviews && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: averageRating.toFixed(1),
        reviewCount: shop.reviews.length,
        bestRating: 5,
        worstRating: 1
      }
    })
  }
}
