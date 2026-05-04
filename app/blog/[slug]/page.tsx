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

  const post = await getBlogPost(params.slug)
  if (!post) return { title: 'Artikel niet gevonden' }

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

export default async function BlogPostPage({
  params,
}: {
  params: { slug: string }
}) {
  const country = await getCountry(params.slug)

  if (country) {
    const blogPosts = await prisma.blogPost.findMany({
      where: { isPublished: true },
      orderBy: { publishedAt: 'desc' },
    })

    return (
      <div className="min-h-screen bg-gray-50">
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
              <Link href="/blog" className="hover:text-white">Blog</Link>
              <span className="mx-2">/</span>
              <span className="text-white">{country.name}</span>
            </nav>
            <h1 className="text-4xl font-bold text-white">
              Modest Fashion Blog — {country.name}
            </h1>
            <p className="text-lg text-white/80 mt-2">
              Lees de nieuwste trends, tips en inspiratie over modest fashion in {country.name}
            </p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 py-8">
          {blogPosts.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl border">
              <p className="text-gray-500">Nog geen blog posts beschikbaar</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogPosts.map(post => (
                <article key={post.id} className="card p-6 flex flex-col">
                  <Link href={`/blog/${post.slug}`}>
                    <h2 className="font-semibold text-lg text-gray-900 mb-2 hover:text-accent transition line-clamp-2">
                      {post.title}
                    </h2>
                  </Link>
                  <p className="text-gray-600 text-sm mb-4 flex-grow line-clamp-3">{post.excerpt}</p>
                  <div className="flex justify-between items-center mt-auto pt-3 border-t">
                    {post.publishedAt && (
                      <span className="text-xs text-gray-400">
                        {new Date(post.publishedAt).toLocaleDateString('nl-NL', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </span>
                    )}
                    <Link href={`/blog/${post.slug}`} className="text-accent hover:underline text-sm ml-auto">
                      Lees meer →
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}

          <div className="mt-12 text-center">
            <Link href={`/modest-fashion/${country.slug}`} className="btn-primary">
              Bekijk winkels in {country.name}
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const post = await getBlogPost(params.slug)
  if (!post) notFound()

  const relatedPosts = await getRelatedPosts(params.slug, post.tags || [])
  const jsonLd = generateBlogPostJsonLd(post)

  return (
    <div className="min-h-screen bg-gray-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

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
            <Link href="/blog" className="hover:text-white">Blog</Link>
            <span className="mx-2">/</span>
            <span className="text-white line-clamp-1">{post.title}</span>
          </nav>
          <h1 className="text-4xl font-bold text-white mb-3">{post.title}</h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-white/70">
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
              <div className="flex flex-wrap gap-2">
                {post.tags.map(tag => (
                  <span key={tag} className="bg-white/20 text-white px-2 py-0.5 rounded-full text-xs">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Article content */}
      <div className="max-w-3xl mx-auto px-4 py-10">
        <article>
          <div
            className="prose prose-lg max-w-none prose-h2:text-xl prose-h2:font-semibold prose-h2:text-gray-900 prose-h3:text-lg prose-h3:font-semibold prose-h3:text-gray-900"
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
                  className="card p-4 hover:shadow-md transition"
                >
                  <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">{related.title}</h3>
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
    </div>
  )
}
