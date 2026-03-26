import prisma from '@/lib/db'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

async function getBlogPosts() {
  return prisma.blogPost.findMany({
    orderBy: { createdAt: 'desc' },
  })
}

export default async function AdminBlogPage() {
  const posts = await getBlogPosts()

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Blog beheren</h1>
        <Link href="/admin/blog/new" className="btn-primary">
          + Nieuw artikel
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className="bg-white rounded-xl p-8 text-center text-gray-500">
          Nog geen blog artikelen. 
          <Link href="/admin/blog/new" className="text-accent hover:underline ml-1">
            Maak je eerste artikel
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Titel</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Datum</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acties</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {posts.map(post => (
                <tr key={post.id}>
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-900">{post.title}</p>
                    <p className="text-sm text-gray-500 truncate max-w-md">{post.excerpt}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      post.isPublished ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {post.isPublished ? 'Gepubliceerd' : 'Concept'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(post.createdAt).toLocaleDateString('nl-NL')}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-3">
                      <Link href={`/admin/blog/${post.id}`} className="text-accent hover:underline text-sm">
                        Bewerken
                      </Link>
                      {post.isPublished && (
                        <Link href={`/blog/${post.slug}`} target="_blank" className="text-gray-500 hover:underline text-sm">
                          Bekijken
                        </Link>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
