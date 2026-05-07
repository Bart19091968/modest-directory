'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
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

function parseLinks(text: string) {
  return text
    .split('\n')
    .map(line => line.trim())
    .filter(Boolean)
    .map(line => {
      const [label, href] = line.split('|').map(s => s.trim())
      return { label: label || '', href: href || '', type: 'category' as const }
    })
    .filter(l => l.label && l.href)
}

export default function NewDictionaryTermPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

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

  const handleTermChange = (term: string) => {
    setForm(f => ({ ...f, term, slug: f.slug || generateSlug(term) }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/admin/dictionary', {
        method: 'POST',
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
      setLoading(false)
    }
  }

  const seoTitleLen = form.seoTitle.length
  const seoDescLen = form.seoDescription.length

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Nieuwe woordenboekterm</h1>
        <Link href="/admin/dictionary" className="text-gray-600 hover:text-gray-800">← Terug</Link>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6 border border-red-200">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border p-6 space-y-6">

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Term *</label>
            <input
              type="text"
              value={form.term}
              onChange={e => handleTermChange(e.target.value)}
              required
              className="input"
              placeholder="Hijab"
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
              placeholder="hijab"
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
              placeholder="حجاب"
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
              placeholder="hi-jaab"
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
          <label className="block text-sm font-medium text-gray-700 mb-1">Korte definitie * <span className="text-gray-400 font-normal">(max 400 tekens)</span></label>
          <textarea
            value={form.shortDefinition}
            onChange={e => setForm(f => ({ ...f, shortDefinition: e.target.value }))}
            required
            rows={2}
            maxLength={400}
            className="input"
            placeholder="Een hijab is een hoofddoek die..."
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
            placeholder="<p>Eerste alinea...</p>&#10;<p>Tweede alinea...</p>"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Synoniemen / aliases <span className="text-gray-400 font-normal">(komma gescheiden)</span></label>
          <input
            type="text"
            value={form.aliases}
            onChange={e => setForm(f => ({ ...f, aliases: e.target.value }))}
            className="input"
            placeholder="Hijaab, Hoofddoek, Hijab scarf"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Spellingsvarianten <span className="text-gray-400 font-normal">(komma gescheiden)</span></label>
          <input
            type="text"
            value={form.transliterationVariants}
            onChange={e => setForm(f => ({ ...f, transliterationVariants: e.target.value }))}
            className="input"
            placeholder="hijaab, hidjab, hijab scarf"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Gerelateerde termen <span className="text-gray-400 font-normal">(slugs, komma gescheiden)</span></label>
          <input
            type="text"
            value={form.relatedTermSlugs}
            onChange={e => setForm(f => ({ ...f, relatedTermSlugs: e.target.value }))}
            className="input"
            placeholder="khimar, undercap, chiffon-hijab"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Directorylinks <span className="text-gray-400 font-normal">(één per regel: label | /pad)</span></label>
          <textarea
            value={form.categoryLinksText}
            onChange={e => setForm(f => ({ ...f, categoryLinksText: e.target.value }))}
            rows={3}
            className="input font-mono text-sm"
            placeholder={'Hijab winkels in Nederland | /hijab-shops/nederland\nHijab winkels in België | /hijab-shops/belgie'}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Bloglinks <span className="text-gray-400 font-normal">(één per regel: label | /pad)</span></label>
          <textarea
            value={form.blogLinksText}
            onChange={e => setForm(f => ({ ...f, blogLinksText: e.target.value }))}
            rows={2}
            className="input font-mono text-sm"
            placeholder={'Gids: hijab stijlen voor beginners | /blog/hijab-stijlen'}
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
              placeholder="Wat is een hijab? Betekenis en stijlen | ModestDirectory"
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
              placeholder="Ontdek wat een hijab is..."
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
            <span className="text-sm text-gray-700">Publiceren</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.isFeatured}
              onChange={e => setForm(f => ({ ...f, isFeatured: e.target.checked }))}
              className="w-5 h-5 text-accent rounded"
            />
            <span className="text-sm text-gray-700">Featured (populaire termen)</span>
          </label>
        </div>

        <div className="flex gap-3 pt-4">
          <Link href="/admin/dictionary" className="px-6 py-2 border rounded-lg hover:bg-gray-50 transition">
            Annuleren
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 btn-primary disabled:opacity-50"
          >
            {loading ? 'Opslaan...' : 'Term opslaan'}
          </button>
        </div>
      </form>
    </div>
  )
}
