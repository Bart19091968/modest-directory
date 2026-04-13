import prisma from '@/lib/db'
import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Blog - Islamitische Mode, Hijab & Modest Fashion Tips | ModestDirectory',
  description: 'Tips, trends en inspiratie over hijabs, abayas en modest fashion. Ontdek de nieuwste islamitische mode trends, stylingtips en inspiratie voor modest wear in Nederland en België.',
  alternates: {
    canonical: '/blog',
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

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Blog</h1>
        <p className="text-gray-600">
          Tips, trends en inspiratie over hijabs, modest fashion en islamitische kleding
        </p>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <p className="text-gray-500">Binnenkort meer artikelen</p>
        </div>
      ) : (
        <div className="space-y-8">
          {posts.map(post => (
            <article key={post.id} className="bg-white rounded-xl shadow-sm border p-6 hover:shadow-md transition">
              <Link href={`/blog/${post.slug}`}>
                <h2 className="text-xl font-bold text-gray-900 mb-2 hover:text-accent transition">
                  {post.title}
                </h2>
              </Link>
              <p className="text-gray-600 mb-4">{post.excerpt}</p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">
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
                <div className="flex flex-wrap gap-2 mt-4">
                  {post.tags.map(tag => (
                    <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
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
  )
}
