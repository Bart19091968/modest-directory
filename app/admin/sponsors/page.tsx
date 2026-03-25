'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Sponsor {
  id: string
  name: string
  bannerUrl: string
  linkUrl: string
  position: string
  isActive: boolean
}

export default function AdminSponsorsPage() {
  const [sponsors, setSponsors] = useState<Sponsor[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSponsors()
  }, [])

  const fetchSponsors = async () => {
    const res = await fetch('/api/admin/sponsors')
    if (res.ok) {
      const data = await res.json()
      setSponsors(data)
    }
    setLoading(false)
  }

  const toggleActive = async (id: string) => {
    await fetch(`/api/admin/sponsors/${id}/toggle`, { method: 'POST' })
    fetchSponsors()
  }

  const deleteSponsor = async (id: string) => {
    if (!confirm('Weet je zeker dat je deze sponsor wilt verwijderen?')) return
    await fetch(`/api/admin/sponsors?id=${id}`, { method: 'DELETE' })
    fetchSponsors()
  }

  if (loading) {
    return <div className="text-center py-8">Laden...</div>
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Sponsors beheren</h1>
        <Link href="/admin/sponsors/new" className="btn-primary">
          + Nieuwe sponsor
        </Link>
      </div>

      {sponsors.length === 0 ? (
        <div className="bg-gray-50 rounded-xl p-8 text-center">
          <p className="text-gray-600 mb-4">Nog geen sponsors.</p>
          <Link href="/admin/sponsors/new" className="btn-primary">
            Eerste sponsor toevoegen
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Naam</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Positie</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Status</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Acties</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {sponsors.map(sponsor => (
                <tr key={sponsor.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {sponsor.bannerUrl && (
                        <img src={sponsor.bannerUrl} alt={sponsor.name} className="w-16 h-10 object-cover rounded" />
                      )}
                      <span className="font-medium text-gray-900">{sponsor.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{sponsor.position}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => toggleActive(sponsor.id)}
                      className={`px-2 py-1 rounded-full text-xs ${
                        sponsor.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      {sponsor.isActive ? 'Actief' : 'Inactief'}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => deleteSponsor(sponsor.id)}
                      className="text-red-600 hover:text-red-700 text-sm"
                    >
                      Verwijderen
                    </button>
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
