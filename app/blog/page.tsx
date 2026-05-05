import prisma from '@/lib/db'
import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Blog - Islamitische Mode, Hijab & Modest Fashion Tips | ModestDirectory',
  description: 'Tips, trends en inspiratie over hijabs, abayas en modest fashion. Ontdek de nieuwste islamitische mode trends, stylingtips en inspiratie voor modest wear in Nederland en België.',
  alternates: {
    canonical: '/blog',
  },
  openGraph: {
    title: 'Blog - Islamitische Mode, Hijab & Modest Fashion Tips | ModestDirectory',
    description: 'Tips, trends en inspiratie over hijabs, abayas en modest fashion in Nederland en België.',
    type: 'website',
    images: [{ url: '/icon-512.png', width: 512, height: 512, alt: 'ModestDirectory Blog' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog | ModestDirectory',
    description: 'Tips, trends en inspiratie over hijabs, abayas en modest fashion.',
    images: ['/icon-512.png'],
  },
}

export const dynamic = 'force-dynamic'

async function getBlogPosts() {
  return prisma.blogPost.findMany({
    where: { isPublished: true },
    orderBy: { publishedAt: 'desc' },
  })
}

export default async function BlogPage() {
  const posts = await getBlogPosts()
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://modestdirectory.com'

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: `${siteUrl}/blog` },
    ],
  }

  const collectionJsonLd = posts.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Blog - ModestDirectory',
    url: `${siteUrl}/blog`,
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: posts.map((post, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        item: {
          '@type': 'BlogPosting',
          url: `${siteUrl}/blog/${post.slug}`,
          headline: post.title,
        },
      })),
    },
  } : null

  return (
    <div className="min-h-screen bg-gray-50">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      {collectionJsonLd && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }} />}

      {/* Hero header */}
      <div
        className="relative border-b"
        style={{ backgroundImage: 'url(/hero-banner-blog.jpg)', backgroundSize: 'cover', backgroundPosition: 'center 30%' }}
      >
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative max-w-6xl mx-auto px-4 py-10">
          <nav className="text-sm text-white/70 mb-4" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-white">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-white">Blog</span>
          </nav>
          <h1 className="text-4xl font-bold text-white">Blog</h1>
          <p className="text-lg text-white/80 mt-2">
            Tips, trends en inspiratie over hijabs, modest fashion en islamitische kleding
          </p>
        </div>
      </div>

      {/* Posts */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {posts.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border">
            <p className="text-gray-500">Binnenkort meer artikelen</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map(post => (
              <article key={post.id} className="card p-6 flex flex-col">
                <Link href={`/blog/${post.slug}`}>
                  <h2 className="font-semibold text-lg text-gray-900 mb-2 hover:text-accent transition line-clamp-2">
                    {post.title}
                  </h2>
                </Link>
                <p className="text-gray-600 text-sm mb-4 flex-grow line-clamp-3">{post.excerpt}</p>
                <div className="flex justify-between items-center mt-auto pt-3 border-t">
                  <span className="text-xs text-gray-400">
                    {post.publishedAt && new Date(post.publishedAt).toLocaleDateString('nl-NL', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                  <Link href={`/blog/${post.slug}`} className="text-accent hover:underline text-sm">
                    Lees meer →
                  </Link>
                </div>
                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {post.tags.map(tag => (
                      <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
