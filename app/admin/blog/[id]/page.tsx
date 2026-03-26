'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'

export default function EditBlogPostPage() {
  const router = useRouter()
  const params = useParams()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
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

  useEffect(() => {
    fetch(`/api/admin/blog/${params.id}`)
      .then(res => res.json())
      .then(data => {
        setForm({
          title: data.title || '',
          slug: data.slug || '',
          excerpt: data.excerpt || '',
          content: data.content || '',
          metaTitle: data.metaTitle || '',
          metaDesc: data.metaDesc || '',
          tags: (data.tags || []).join(', '),
          isPublished: data.isPublished || false,
        })
        setLoading(false)
      })
      .catch(() => {
        setError('Artikel niet gevonden')
        setLoading(false)
      })
  }, [params.id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')

    try {
      const res = await fetch(`/api/admin/blog/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
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
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Weet je zeker dat je dit artikel wilt verwijderen?')) return

    try {
      await fetch(`/api/admin/blog/${params.id}`, { method: 'DELETE' })
      router.push('/admin/blog')
    } catch (err) {
      setError('Verwijderen mislukt')
    }
  }

  if (loading) {
    return <div className="text-center py-8">Laden...</div>
  }

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Artikel bewerken</h1>
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
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
            className="input"
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
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Content (HTML) *</label>
          <textarea
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
            required
            rows={15}
            className="input font-mono text-sm"
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
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
            <input
              type="text"
              value={form.tags}
              onChange={(e) => setForm({ ...form, tags: e.target.value })}
              className="input"
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
            Gepubliceerd
          </label>
        </div>

        <div className="flex justify-between pt-4">
          <button
            type="button"
            onClick={handleDelete}
            className="px-4 py-2 text-red-600 hover:text-red-800"
          >
            Verwijderen
          </button>
          <div className="flex gap-3">
            <Link href="/admin/blog" className="px-6 py-2 border rounded-lg hover:bg-gray-50 transition">
              Annuleren
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="btn-primary disabled:opacity-50"
            >
              {saving ? 'Opslaan...' : 'Opslaan'}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
