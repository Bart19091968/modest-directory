'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function NewBlogPostPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const [form, setForm] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    metaTitle: '',
    metaDesc: '',
    tags: '',
    isPublished: false,
  })

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }

  const handleTitleChange = (title: string) => {
    setForm({
      ...form,
      title,
      slug: form.slug || generateSlug(title),
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/admin/blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
          publishedAt: form.isPublished ? new Date().toISOString() : null,
        }),
      })

      if (res.ok) {
        router.push('/admin/blog')
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
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Nieuw blog artikel</h1>
        <Link href="/admin/blog" className="text-gray-600 hover:text-gray-800">
          ← Terug
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6 border border-red-200">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Titel *</label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => handleTitleChange(e.target.value)}
            required
            className="input"
            placeholder="Welke hijab past bij jouw gezichtsvorm?"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Slug *</label>
          <input
            type="text"
            value={form.slug}
            onChange={(e) => setForm({ ...form, slug: e.target.value })}
            required
            className="input"
            placeholder="hijab-gezichtsvorm-gids"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Excerpt *</label>
          <textarea
            value={form.excerpt}
            onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
            required
            rows={2}
            maxLength={300}
            className="input"
            placeholder="Korte samenvatting voor de blog overzichtspagina..."
          />
          <p className="text-xs text-gray-500 mt-1">{form.excerpt.length}/300</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Content (HTML) *</label>
          <textarea
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
            required
            rows={15}
            className="input font-mono text-sm"
            placeholder="<p>Je artikel inhoud...</p>"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Meta titel</label>
            <input
              type="text"
              value={form.metaTitle}
              onChange={(e) => setForm({ ...form, metaTitle: e.target.value })}
              className="input"
              placeholder="SEO titel (optioneel)"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
            <input
              type="text"
              value={form.tags}
              onChange={(e) => setForm({ ...form, tags: e.target.value })}
              className="input"
              placeholder="hijab, styling, tips"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Meta beschrijving</label>
          <textarea
            value={form.metaDesc}
            onChange={(e) => setForm({ ...form, metaDesc: e.target.value })}
            rows={2}
            maxLength={200}
            className="input"
            placeholder="SEO beschrijving (optioneel)"
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="isPublished"
            checked={form.isPublished}
            onChange={(e) => setForm({ ...form, isPublished: e.target.checked })}
            className="w-5 h-5 text-accent rounded"
          />
          <label htmlFor="isPublished" className="text-sm text-gray-700">
            Direct publiceren
          </label>
        </div>

        <div className="flex gap-3 pt-4">
          <Link href="/admin/blog" className="px-6 py-2 border rounded-lg hover:bg-gray-50 transition">
            Annuleren
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 btn-primary disabled:opacity-50"
          >
            {loading ? 'Opslaan...' : 'Artikel opslaan'}
          </button>
        </div>
      </form>
    </div>
  )
}
