'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function NewSponsorPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    name: '',
    bannerUrl: '',
    linkUrl: '',
    position: 'SIDEBAR',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/admin/sponsors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      if (res.ok) {
        router.push('/admin/sponsors')
      } else {
        const data = await res.json()
        setError(data.error || 'Er ging iets mis')
      }
    } catch (err) {
      setError('Er ging iets mis')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Nieuwe sponsor</h1>
        <Link href="/admin/sponsors" className="text-gray-600 hover:text-gray-800">
          ← Terug
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6 border border-red-200">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Naam *</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
            className="input"
            placeholder="Sponsor naam"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Banner URL *</label>
          <input
            type="url"
            value={form.bannerUrl}
            onChange={(e) => setForm({ ...form, bannerUrl: e.target.value })}
            required
            className="input"
            placeholder="https://example.com/banner.jpg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Link URL *</label>
          <input
            type="url"
            value={form.linkUrl}
            onChange={(e) => setForm({ ...form, linkUrl: e.target.value })}
            required
            className="input"
            placeholder="https://sponsor-website.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Positie *</label>
          <select
            value={form.position}
            onChange={(e) => setForm({ ...form, position: e.target.value })}
            className="input"
          >
            <option value="HEADER">Header</option>
            <option value="SIDEBAR">Sidebar</option>
            <option value="FOOTER">Footer</option>
          </select>
        </div>

        <div className="flex gap-3 pt-4">
          <Link href="/admin/sponsors" className="px-6 py-2 border rounded-lg hover:bg-gray-50 transition">
            Annuleren
          </Link>
          <button type="submit" disabled={loading} className="flex-1 btn-primary disabled:opacity-50">
            {loading ? 'Opslaan...' : 'Sponsor toevoegen'}
          </button>
        </div>
      </form>
    </div>
  )
}
