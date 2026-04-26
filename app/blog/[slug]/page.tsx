import prisma from '@/lib/db'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { generateBlogPostJsonLd } from '@/lib/seo'

export const dynamic = 'force-dynamic'

async function getBlogPost(slug: string) {
  return prisma.blogPost.findUnique({
    where: { slug, isPublished: true },
  })
}

async function getCountry(slug: string) {
  return prisma.country.findUnique({
    where: { slug },
  })
}

async function getRelatedPosts(currentSlug: string, tags: string[]) {
  if (tags.length === 0) return []
  
  return prisma.blogPost.findMany({
    where: {
      isPublished: true,
      slug: { not: currentSlug },
      tags: { hasSome: tags },
    },
    take: 3,
    orderBy: { publishedAt: 'desc' },
  })
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  // Check if it's a country first
  const country = await getCountry(params.slug)
  if (country) {
    const title = `Blog over Modest Fashion in ${country.name}`
    const description = `Lees het laatste blog content over modest fashion in ${country.name}`
    return {
      title,
      description,
      alternates: { canonical: `/blog/${params.slug}` },
      openGraph: { title, description, type: 'website' },
    }
  }

  // Otherwise check for blog post
  const post = await getBlogPost(params.slug)

  if (!post) {
    return { title: 'Artikel niet gevonden' }
  }

  return {
    title: post.metaTitle || `${post.title} | ModestDirectory Blog`,
    description: post.metaDesc || post.excerpt,
    alternates: { canonical: `/blog/${params.slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.publishedAt?.toISOString(),
      images: [{ url: '/icon-512.png', width: 512, height: 512, alt: post.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.metaTitle || post.title,
      description: post.metaDesc || post.excerpt,
      images: ['/icon-512.png'],
    },
  }
}

export default async function BlogPage({
  params,
}: {
  params: { slug: string }
}) {
  // Check if it's a country first
  const country = await getCountry(params.slug)
  
  if (country) {
    // Show all blog posts for this country
    const blogPosts = await prisma.blogPost.findMany({
      where: { isPublished: true },
      orderBy: { publishedAt: 'desc' },
    })

    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <nav className="text-sm text-gray-500 mb-8">
          <Link href="/" className="hover:text-accent">Home</Link>
          <span className="mx-2">›</span>
          <Link href="/blog" className="hover:text-accent">Blog</Link>
          <span className="mx-2">›</span>
          <span className="text-gray-900">{country.name}</span>
        </nav>

        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Modest Fashion Blog - {country.name}
          </h1>
          <p className="text-xl text-gray-600">
            Lees de nieuwste trends, tips en inspiratie over modest fashion in {country.name}
          </p>
        </div>

        {blogPosts.length === 0 ? (
          <div className="text-center text-gray-600 py-12">
            Nog geen blog posts beschikbaar
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {blogPosts.map(post => (
              <article key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
                <Link href={`/blog/${post.slug}`} className="p-6 block">
                  <h2 className="text-xl font-bold text-gray-900 mb-2">{post.title}</h2>
                  <p className="text-gray-600 mb-4 line-clamp-2">{post.excerpt}</p>
                  {post.publishedAt && (
                    <p className="text-sm text-gray-500">
                      {new Date(post.publishedAt).toLocaleDateString('nl-NL', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  )}
                </Link>
              </article>
            ))}
          </div>
        )}

        <div className="mt-12 text-center">
          <Link href="/alles/{country.slug}" className="btn-primary">
            Bekijk winkels in {country.name}
          </Link>
        </div>
      </div>
    )
  }

  // Otherwise show individual blog post
  const post = await getBlogPost(params.slug)

  if (!post) {
    notFound()
  }

  const relatedPosts = await getRelatedPosts(params.slug, post.tags || [])
  const jsonLd = generateBlogPostJsonLd(post)

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-accent">Home</Link>
        <span className="mx-2">›</span>
        <Link href="/blog" className="hover:text-accent">Blog</Link>
        <span className="mx-2">›</span>
        <span className="text-gray-900">{post.title}</span>
      </nav>

      {/* Article */}
      <article>
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {post.title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
            {post.publishedAt && (
              <time dateTime={post.publishedAt.toISOString()}>
                {new Date(post.publishedAt).toLocaleDateString('nl-NL', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </time>
            )}
            {post.tags && post.tags.length > 0 && (
              <div className="flex gap-2">
                {post.tags.map(tag => (
                  <span key={tag} className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </header>

        <div 
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </article>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <div className="mt-16 pt-8 border-t">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Gerelateerde artikelen</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {relatedPosts.map(related => (
              <Link
                key={related.id}
                href={`/blog/${related.slug}`}
                className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
              >
                <h3 className="font-medium text-gray-900 mb-2">{related.title}</h3>
                <p className="text-sm text-gray-600 line-clamp-2">{related.excerpt}</p>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* CTA */}
      <div className="mt-12 p-8 bg-accent/5 rounded-xl text-center">
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          Op zoek naar islamitische kledingwinkels?
        </h3>
        <p className="text-gray-600 mb-4">
          Ontdek de beste winkels in jouw regio
        </p>
        <Link href="/shops" className="btn-primary">
          Bekijk alle winkels
        </Link>
      </div>
    </div>
  )
}
