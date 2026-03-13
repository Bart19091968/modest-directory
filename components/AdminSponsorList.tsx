'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

type Sponsor = {
  id: string
  name: string
  bannerUrl: string
  linkUrl: string
  position: string
  isActive: boolean
  startDate: Date
  endDate: Date | null
}

export default function AdminSponsorList({ sponsors }: { sponsors: Sponsor[] }) {
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)

  const handleToggleActive = async (sponsorId: string) => {
    setLoading(sponsorId)
    try {
      await fetch(`/api/admin/sponsors/${sponsorId}/toggle`, {
        method: 'POST',
      })
      router.refresh()
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(null)
    }
  }

  const handleDelete = async (sponsorId: string, sponsorName: string) => {
    if (!confirm(`Weet je zeker dat je "${sponsorName}" wilt verwijderen?`)) return

    setLoading(sponsorId)
    try {
      await fetch('/api/admin/sponsors', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sponsorId }),
      })
      router.refresh()
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(null)
    }
  }

  const positionLabels = {
    HEADER: 'Header',
    SIDEBAR: 'Sidebar',
    FOOTER: 'Footer',
  }

  if (sponsors.length === 0) {
    return (
      <div className="bg-white rounded-xl p-8 text-center text-gray-500">
        Geen sponsors gevonden.{' '}
        <a href="/admin/sponsors/new" className="text-accent hover:underline">
          Voeg je eerste sponsor toe
        </a>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sponsor</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Positie</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Einddatum</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acties</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {sponsors.map(sponsor => (
            <tr key={sponsor.id} className={loading === sponsor.id ? 'opacity-50' : ''}>
              <td className="px-6 py-4">
                <div className="flex items-center gap-4">
                  <img
                    src={sponsor.bannerUrl}
                    alt={sponsor.name}
                    className="w-16 h-10 object-cover rounded"
                  />
                  <div>
                    <div className="font-medium text-gray-900">{sponsor.name}</div>
                    
                      href={sponsor.linkUrl}
                      target="_blank"
                      className="text-xs text-gray-500 hover:text-accent"
                    >
                      {sponsor.linkUrl}
                    </a>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 text-sm text-gray-600">
                {positionLabels[sponsor.position as keyof typeof positionLabels]}
              </td>
              <td className="px-6 py-4">
                <button
                  onClick={() => handleToggleActive(sponsor.id)}
                  className={`px-2 py-1 text-xs rounded-full ${
                    sponsor.isActive
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {sponsor.isActive ? 'Actief' : 'Inactief'}
                </button>
              </td>
              <td className="px-6 py-4 text-sm text-gray-600">
                {sponsor.endDate
                  ? new Date(sponsor.endDate).toLocaleDateString('nl-BE')
                  : 'Onbeperkt'}
              </td>
              <td className="px-6 py-4">
                <div className="flex gap-2">
                  
                    href={sponsor.linkUrl}
                    target="_blank"
                    className="text-accent hover:underline text-sm"
                  >
                    Preview
                  </a>
                  <button
                    onClick={() => handleDelete(sponsor.id, sponsor.name)}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    Verwijderen
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}