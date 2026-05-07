'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'

const CATEGORIES = [
  'Hoofdbedekking',
  'Kledingstukken',
  'Stoffen',
  'Accessoires',
  'Stijlen',
  'Gelegenheden',
  'Herenkleding',
  'Kinderkleding',
  'Shoppingtermen',
]

function generateSlug(term: string) {
  return term
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

type RelatedLink = { label: string; href: string; type: string }

function parseLinks(text: string): RelatedLink[] {
  return text
    .split('\n')
    .map(line => line.trim())
    .filter(Boolean)
    .map(line => {
      const [label, href] = line.split('|').map(s => s.trim())
      return { label: label || '', href: href || '', type: 'category' }
    })
    .filter(l => l.label && l.href)
}

function linksToText(links: RelatedLink[]): string {
  return (links || []).map(l => `${l.label} | ${l.href}`).join('\n')
}

export default function EditDictionaryTermPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState('')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const [form, setForm] = useState({
    term: '',
    slug: '',
    arabic: '',
    pronunciation: '',
    shortDefinition: '',
    longDefinition: '',
    category: 'Hoofdbedekking',
    aliases: '',
    transliterationVariants: '',
    relatedTermSlugs: '',
    categoryLinksText: '',
    blogLinksText: '',
    seoTitle: '',
    seoDescription: '',
    isPublished: false,
    isFeatured: false,
  })

  useEffect(() => {
    fetch(`/api/admin/dictionary/${id}`)
      .then(r => r.json())
      .then(data => {
        setForm({
          term: data.term || '',
          slug: data.slug || '',
          arabic: data.arabic || '',
          pronunciation: data.pronunciation || '',
          shortDefinition: data.shortDefinition || '',
          longDefinition: data.longDefinition || '',
          category: data.category || 'Hoofdbedekking',
          aliases: (data.aliases || []).join(', '),
          transliterationVariants: (data.transliterationVariants || []).join(', '),
          relatedTermSlugs: (data.relatedTermSlugs || []).join(', '),
          categoryLinksText: linksToText(data.relatedCategoryLinks || []),
          blogLinksText: linksToText(data.relatedBlogLinks || []),
          seoTitle: data.seoTitle || '',
          seoDescription: data.seoDescription || '',
          isPublished: data.isPublished || false,
          isFeatured: data.isFeatured || false,
        })
        setLoading(false)
      })
      .catch(() => { setError('Kon term niet laden'); setLoading(false) })
  }, [id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')

    try {
      const res = await fetch(`/api/admin/dictionary/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          term: form.term,
          slug: form.slug,
          arabic: form.arabic || null,
          pronunciation: form.pronunciation || null,
          shortDefinition: form.shortDefinition,
          longDefinition: form.longDefinition,
          category: form.category,
          aliases: form.aliases.split(',').map(s => s.trim()).filter(Boolean),
          transliterationVariants: form.transliterationVariants.split(',').map(s => s.trim()).filter(Boolean),
          relatedTermSlugs: form.relatedTermSlugs.split(',').map(s => s.trim()).filter(Boolean),
          relatedCategoryLinks: parseLinks(form.categoryLinksText),
          relatedBlogLinks: parseLinks(form.blogLinksText),
          seoTitle: form.seoTitle || null,
          seoDescription: form.seoDescription || null,
          isPublished: form.isPublished,
          isFeatured: form.isFeatured,
        }),
      })

      if (res.ok) {
        router.push('/admin/dictionary')
      } else {
        const data = await res.json()
        setError(data.error || 'Er ging iets mis')
      }
    } catch {
      setError('Er ging iets mis')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    setDeleting(true)
    try {
      const res = await fetch(`/api/admin/dictionary/${id}`, { method: 'DELETE' })
      if (res.ok) {
        router.push('/admin/dictionary')
      } else {
        setError('Verwijderen mislukt')
        setDeleting(false)
        setShowDeleteConfirm(false)
      }
    } catch {
      setError('Er ging iets mis')
      setDeleting(false)
      setShowDeleteConfirm(false)
    }
  }

  if (loading) return <div className="text-gray-500 py-8">Laden...</div>

  const seoTitleLen = form.seoTitle.length
  const seoDescLen = form.seoDescription.length

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Term bewerken</h1>
        <div className="flex items-center gap-4">
          {form.isPublished && (
            <Link href={`/woordenboek/${form.slug}`} target="_blank" className="text-gray-500 hover:text-gray-700 text-sm">
              Bekijken ↗
            </Link>
          )}
          <Link href="/admin/dictionary" className="text-gray-600 hover:text-gray-800">← Terug</Link>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6 border border-red-200">{error}</div>
      )}

      {showDeleteConfirm && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-6">
          <p className="font-medium text-gray-900 mb-2">Weet je zeker dat je deze term wilt verwijderen?</p>
          <p className="text-sm text-gray-600 mb-4">
            Deze pagina kan organisch verkeer ontvangen. Kies bij voorkeur een redirect of zet de term op unpublished.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => setForm(f => ({ ...f, isPublished: false }))}
              className="px-4 py-2 bg-gray-900 text-white text-sm rounded-lg hover:bg-gray-700"
            >
              Term unpublishen
            </button>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 disabled:opacity-50"
            >
              {deleting ? 'Verwijderen...' : 'Permanent verwijderen'}
            </button>
            <button
              onClick={() => setShowDeleteConfirm(false)}
              className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-50"
            >
              Annuleren
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border p-6 space-y-6">

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Term *</label>
            <input
              type="text"
              value={form.term}
              onChange={e => setForm(f => ({ ...f, term: e.target.value }))}
              required
              className="input"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Slug *</label>
            <input
              type="text"
              value={form.slug}
              onChange={e => setForm(f => ({ ...f, slug: e.target.value }))}
              required
              className="input"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Arabisch schrift</label>
            <input
              type="text"
              value={form.arabic}
              onChange={e => setForm(f => ({ ...f, arabic: e.target.value }))}
              className="input"
              dir="rtl"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Uitspraak / transliteratie</label>
            <input
              type="text"
              value={form.pronunciation}
              onChange={e => setForm(f => ({ ...f, pronunciation: e.target.value }))}
              className="input"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Categorie *</label>
          <select
            value={form.category}
            onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
            className="input"
          >
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Korte definitie *</label>
          <textarea
            value={form.shortDefinition}
            onChange={e => setForm(f => ({ ...f, shortDefinition: e.target.value }))}
            required
            rows={2}
            maxLength={400}
            className="input"
          />
          <p className="text-xs text-gray-400 mt-1">{form.shortDefinition.length}/400</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Lange definitie (HTML) *</label>
          <textarea
            value={form.longDefinition}
            onChange={e => setForm(f => ({ ...f, longDefinition: e.target.value }))}
            required
            rows={10}
            className="input font-mono text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Synoniemen / aliases <span className="text-gray-400 font-normal">(komma gescheiden)</span></label>
          <input
            type="text"
            value={form.aliases}
            onChange={e => setForm(f => ({ ...f, aliases: e.target.value }))}
            className="input"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Spellingsvarianten <span className="text-gray-400 font-normal">(komma gescheiden)</span></label>
          <input
            type="text"
            value={form.transliterationVariants}
            onChange={e => setForm(f => ({ ...f, transliterationVariants: e.target.value }))}
            className="input"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Gerelateerde termen <span className="text-gray-400 font-normal">(slugs, komma gescheiden)</span></label>
          <input
            type="text"
            value={form.relatedTermSlugs}
            onChange={e => setForm(f => ({ ...f, relatedTermSlugs: e.target.value }))}
            className="input"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Directorylinks <span className="text-gray-400 font-normal">(één per regel: label | /pad)</span></label>
          <textarea
            value={form.categoryLinksText}
            onChange={e => setForm(f => ({ ...f, categoryLinksText: e.target.value }))}
            rows={3}
            className="input font-mono text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Bloglinks <span className="text-gray-400 font-normal">(één per regel: label | /pad)</span></label>
          <textarea
            value={form.blogLinksText}
            onChange={e => setForm(f => ({ ...f, blogLinksText: e.target.value }))}
            rows={2}
            className="input font-mono text-sm"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              SEO title
              {seoTitleLen > 60 && <span className="text-amber-500 ml-2 font-normal">{seoTitleLen}/60 — te lang</span>}
            </label>
            <input
              type="text"
              value={form.seoTitle}
              onChange={e => setForm(f => ({ ...f, seoTitle: e.target.value }))}
              className="input"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              SEO beschrijving
              {seoDescLen > 155 && <span className="text-amber-500 ml-2 font-normal">{seoDescLen}/155 — te lang</span>}
            </label>
            <input
              type="text"
              value={form.seoDescription}
              onChange={e => setForm(f => ({ ...f, seoDescription: e.target.value }))}
              className="input"
            />
          </div>
        </div>

        <div className="flex gap-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.isPublished}
              onChange={e => setForm(f => ({ ...f, isPublished: e.target.checked }))}
              className="w-5 h-5 text-accent rounded"
            />
            <span className="text-sm text-gray-700">Gepubliceerd</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.isFeatured}
              onChange={e => setForm(f => ({ ...f, isFeatured: e.target.checked }))}
              className="w-5 h-5 text-accent rounded"
            />
            <span className="text-sm text-gray-700">Featured</span>
          </label>
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={() => setShowDeleteConfirm(true)}
            className="px-4 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 text-sm transition"
          >
            Verwijderen
          </button>
          <div className="flex-1" />
          <Link href="/admin/dictionary" className="px-6 py-2 border rounded-lg hover:bg-gray-50 transition">
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
      </form>
    </div>
  )
}
