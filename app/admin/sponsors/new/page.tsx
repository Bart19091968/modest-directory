'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

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

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 1024 * 1024) {
      setError('Banner is te groot (max 1 MB)')
      e.target.value = ''
      return
    }
    setError('')
    const reader = new FileReader()
    reader.onload = () => setForm(prev => ({ ...prev, bannerUrl: reader.result as string }))
    reader.readAsDataURL(file)
  }

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
          <label className="block text-sm font-medium text-gray-700 mb-1">Banner *</label>
          {form.bannerUrl ? (
            <div className="space-y-2">
              <div className="relative w-full h-32 rounded-lg overflow-hidden border bg-gray-50">
                <Image src={form.bannerUrl} alt="Banner preview" fill className="object-contain" />
              </div>
              <button
                type="button"
                onClick={() => setForm(prev => ({ ...prev, bannerUrl: '' }))}
                className="text-sm text-red-600 hover:underline"
              >
                Banner verwijderen
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-accent hover:bg-accent/5 transition">
              <svg className="w-8 h-8 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-sm text-gray-500">Klik om een banner te uploaden</span>
              <span className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP — max 1 MB</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleBannerChange}
                className="hidden"
                required
              />
            </label>
          )}
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
