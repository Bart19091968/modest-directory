export function generateDirectoryJsonLd() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://modestdirectory.com'

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${siteUrl}/#website`,
        name: 'ModestDirectory',
        description: 'De meest complete gids voor islamitische kledingwinkels, hijab shops en abaya winkels in Nederland en België',
        url: siteUrl,
        inLanguage: 'nl',
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: `${siteUrl}/shops?search={search_term_string}`,
          },
          'query-input': 'required name=search_term_string',
        },
      },
      {
        '@type': 'Organization',
        '@id': `${siteUrl}/#organization`,
        name: 'ModestDirectory',
        url: siteUrl,
        logo: {
          '@type': 'ImageObject',
          url: `${siteUrl}/icon-512.png`,
          width: 512,
          height: 512,
        },
        description: 'Online directory voor islamitische kledingwinkels, hijab shops en abaya winkels in Nederland en België.',
        email: 'info@modestdirectory.com',
        areaServed: ['NL', 'BE'],
        contactPoint: {
          '@type': 'ContactPoint',
          email: 'info@modestdirectory.com',
          contactType: 'customer support',
          availableLanguage: ['Dutch'],
        },
      },
    ],
  }
}

export function generateBreadcrumbListJsonLd(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

export function generateLocalBusinessJsonLd(shop: {
  name: string
  slug: string
  shortDescription: string
  city?: string | null
  country: string
  websiteUrl?: string | null
  averageRating?: number
  reviewCount?: number
}) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://modestdirectory.com'

  return {
    '@context': 'https://schema.org',
    '@type': 'Store',
    name: shop.name,
    description: shop.shortDescription,
    url: `${siteUrl}/shops/${shop.slug}`,
    address: {
      '@type': 'PostalAddress',
      addressLocality: shop.city,
      addressCountry: shop.country,
    },
    ...(shop.websiteUrl && { sameAs: [shop.websiteUrl] }),
    ...(shop.averageRating && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: shop.averageRating,
        reviewCount: shop.reviewCount || 0,
        bestRating: 5,
        worstRating: 1,
      },
    }),
  }
}

const DAY_OF_WEEK: Record<string, string> = {
  monday: 'Monday', tuesday: 'Tuesday', wednesday: 'Wednesday',
  thursday: 'Thursday', friday: 'Friday', saturday: 'Saturday', sunday: 'Sunday',
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
  email?: string | null
  phone?: string | null
  logoUrl?: string | null
  averageRating?: number
  reviewCount?: number
  openingHours?: Record<string, { open?: string; close?: string; closed?: boolean }> | null
}) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://modestdirectory.com'
  const shopUrl = `${siteUrl}/shops/${shop.slug}`

  const openingHoursSpec = shop.openingHours
    ? Object.entries(shop.openingHours)
        .filter(([, h]) => !h.closed && h.open && h.close)
        .map(([day, h]) => ({
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: DAY_OF_WEEK[day] || day,
          opens: h.open,
          closes: h.close,
        }))
    : null

  return {
    '@context': 'https://schema.org',
    '@type': 'Store',
    '@id': shopUrl,
    name: shop.name,
    description: shop.longDescription || shop.shortDescription,
    url: shopUrl,
    ...(shop.logoUrl && {
      image: shop.logoUrl,
      logo: { '@type': 'ImageObject', url: shop.logoUrl },
    }),
    address: {
      '@type': 'PostalAddress',
      ...(shop.address && { streetAddress: shop.address }),
      addressLocality: shop.city,
      addressCountry: shop.country,
    },
    ...(shop.email && { email: shop.email }),
    ...(shop.phone && { telephone: shop.phone }),
    ...(shop.websiteUrl && { sameAs: [shop.websiteUrl] }),
    ...(openingHoursSpec && openingHoursSpec.length > 0 && { openingHoursSpecification: openingHoursSpec }),
    ...(shop.averageRating && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: shop.averageRating,
        reviewCount: shop.reviewCount || 0,
        bestRating: 5,
        worstRating: 1,
      },
    }),
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
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://modestdirectory.com'
  const datePublished = post.publishedAt || post.createdAt || new Date()
  const dateModified = post.updatedAt || datePublished

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    url: `${siteUrl}/blog/${post.slug}`,
    datePublished: datePublished instanceof Date ? datePublished.toISOString() : new Date(datePublished).toISOString(),
    dateModified: dateModified instanceof Date ? dateModified.toISOString() : new Date(dateModified).toISOString(),
    author: {
      '@type': 'Organization',
      name: 'ModestDirectory',
      url: siteUrl,
    },
    publisher: {
      '@type': 'Organization',
      name: 'ModestDirectory',
      url: siteUrl,
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/icon-512.png`,
        width: 512,
        height: 512,
      },
    },
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
        text: faq.answer,
      },
    })),
  }
}
