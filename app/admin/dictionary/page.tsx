import prisma from '@/lib/db'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

async function getTerms() {
  return prisma.dictionaryTerm.findMany({
    orderBy: { term: 'asc' },
  })
}

export default async function AdminDictionaryPage() {
  const terms = await getTerms()

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Woordenboek beheren</h1>
        <Link href="/admin/dictionary/new" className="btn-primary">
          + Nieuwe term
        </Link>
      </div>

      {terms.length === 0 ? (
        <div className="bg-white rounded-xl p-8 text-center text-gray-500">
          Nog geen woordenboektermen.{' '}
          <Link href="/admin/dictionary/new" className="text-accent hover:underline">
            Voeg de eerste term toe
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Term</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Categorie</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Featured</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Bijgewerkt</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acties</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {terms.map(term => (
                <tr key={term.id}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900">{term.term}</span>
                      {term.arabic && (
                        <span className="text-gray-400 text-sm" dir="rtl">{term.arabic}</span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">/woordenboek/{term.slug}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{term.category}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      term.isPublished ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {term.isPublished ? 'Gepubliceerd' : 'Concept'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {term.isFeatured ? '★' : '—'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(term.updatedAt).toLocaleDateString('nl-NL')}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-3">
                      <Link href={`/admin/dictionary/${term.id}/edit`} className="text-accent hover:underline text-sm">
                        Bewerken
                      </Link>
                      {term.isPublished && (
                        <Link href={`/woordenboek/${term.slug}`} target="_blank" className="text-gray-500 hover:underline text-sm">
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
