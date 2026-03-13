'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

type Shop = {
  id: string
  name: string
  slug: string
  shortDescription: string
  city: string | null
  country: string
  status: string
  email: string | null
  websiteUrl: string | null
  isFeatured: boolean
  createdAt: Date
  _count: { reviews: number }
}

export default function AdminShopList({ shops }: { shops: Shop[] }) {
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)

  const handleStatusChange = async (shopId: string, status: string) => {
    setLoading(shopId)
    try {
      await fetch('/api/admin/shops', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ shopId, status }),
      })
      router.refresh()
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(null)
    }
  }

  const handleFeatureToggle = async (shopId: string) => {
    setLoading(shopId)
    try {
      await fetch(`/api/admin/shops/${shopId}/feature`, {
        method: 'POST',
      })
      router.refresh()
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(null)
    }
  }

  const handleDelete = async (shopId: string, shopName: string) => {
    if (!confirm(`Weet je zeker dat je "${shopName}" wilt verwijderen?`)) return
    
    setLoading(shopId)
    try {
      await fetch('/api/admin/shops', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ shopId }),
      })
      router.refresh()
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(null)
    }
  }

  const statusColors = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    APPROVED: 'bg-green-100 text-green-800',
    REJECTED: 'bg-red-100 text-red-800',
  }

  if (shops.length === 0) {
    return (
      <div className="bg-white rounded-xl p-8 text-center text-gray-500">
        Geen winkels gevonden
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Winkel</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Locatie</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Uitgelicht</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reviews</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acties</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {shops.map(shop => (
            <tr key={shop.id} className={loading === shop.id ? 'opacity-50' : ''}>
              <td className="px-6 py-4">
                <div className="font-medium text-gray-900">{shop.name}</div>
                <div className="text-sm text-gray-500 truncate max-w-xs">{shop.shortDescription}</div>
              </td>
              <td className="px-6 py-4 text-sm text-gray-600">
                {shop.city && `${shop.city}, `}{shop.country}
              </td>
              <td className="px-6 py-4">
                <span className={`px-2 py-1 text-xs rounded-full ${statusColors[shop.status as keyof typeof statusColors]}`}>
                  {shop.status}
                </span>
              </td>
              <td className="px-6 py-4">
                <button
                  onClick={() => handleFeatureToggle(shop.id)}
                  disabled={shop.status !== 'APPROVED'}
                  className={`text-xl ${shop.status !== 'APPROVED' ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer hover:scale-110 transition-transform'}`}
                  title={shop.isFeatured ? 'Verwijder uit uitgelicht' : 'Markeer als uitgelicht'}
                >
                  {shop.isFeatured ? '⭐' : '☆'}
                </button>
              </td>
              <td className="px-6 py-4 text-sm text-gray-600">
                {shop._count.reviews}
              </td>
              <td className="px-6 py-4">
                <div className="flex gap-2">
                  {shop.status === 'PENDING' && (
                    <>
                      <button
                        onClick={() => handleStatusChange(shop.id, 'APPROVED')}
                        className="text-green-600 hover:text-green-800 text-sm"
                      >
                        Goedkeuren
                      </button>
                      <button
                        onClick={() => handleStatusChange(shop.id, 'REJECTED')}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Afwijzen
                      </button>
                    </>
                  )}
                  {shop.status === 'APPROVED' && (
                    
                      <a href={`/shops/${shop.slug}`}
                      target="_blank"
                      className="text-accent hover:underline text-sm"
                    >
                      Bekijken
                    </a>
                  )}
                  <button
                    onClick={() => handleDelete(shop.id, shop.name)}
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