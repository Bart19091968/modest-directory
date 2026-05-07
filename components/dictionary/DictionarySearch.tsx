'use client'

import { useState, useMemo, useRef, useEffect } from 'react'
import Link from 'next/link'

type TermLite = {
  id: string
  term: string
  slug: string
  arabic: string | null
  shortDefinition: string
  category: string
  aliases: string[]
  transliterationVariants: string[]
  isFeatured: boolean
}

function normalizeQuery(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9؀-ۿ\s-]/g, '')
    .trim()
}

function levenshtein(a: string, b: string): number {
  const m = a.length
  const n = b.length
  const dp: number[] = Array.from({ length: n + 1 }, (_, i) => i)
  for (let i = 1; i <= m; i++) {
    let prev = dp[0]
    dp[0] = i
    for (let j = 1; j <= n; j++) {
      const temp = dp[j]
      dp[j] = a[i - 1] === b[j - 1] ? prev : 1 + Math.min(prev, dp[j], dp[j - 1])
      prev = temp
    }
  }
  return dp[n]
}

function matchesTerm(term: TermLite, query: string): boolean {
  if (!query) return true
  const q = normalizeQuery(query)
  if (!q) return true

  const fields = [
    normalizeQuery(term.term),
    normalizeQuery(term.slug),
    ...(term.aliases || []).map(normalizeQuery),
    ...(term.transliterationVariants || []).map(normalizeQuery),
    term.arabic || '',
  ]

  for (const field of fields) {
    if (!field) continue
    if (field.includes(q) || field.startsWith(q)) return true
  }

  // Fuzzy match for 3+ char queries
  if (q.length >= 3) {
    for (const field of fields) {
      if (!field || field.length < 2) continue
      const window = field.substring(0, Math.min(field.length, q.length + 2))
      if (levenshtein(q, window) <= 2) return true
    }
  }

  return false
}

const CATEGORIES = [
  'Alle',
  'Hoofdbedekking',
  'Kledingstukken',
  'Stoffen',
  'Accessoires',
  'Stijlen',
  'Gelegenheden',
  'Herenkleding',
]

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

export default function DictionarySearch({ terms }: { terms: TermLite[] }) {
  const [query, setQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('Alle')
  const [activeLetter, setActiveLetter] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const filtered = useMemo(() => {
    let result = terms

    if (query.trim()) {
      result = result.filter(t => matchesTerm(t, query))
    } else {
      if (activeCategory !== 'Alle') {
        result = result.filter(t => t.category === activeCategory)
      }
      if (activeLetter) {
        result = result.filter(t => t.term.toUpperCase().startsWith(activeLetter))
      }
    }

    return result.sort((a, b) => a.term.localeCompare(b.term, 'nl'))
  }, [terms, query, activeCategory, activeLetter])

  const featuredTerms = useMemo(() => terms.filter(t => t.isFeatured), [terms])

  const availableLetters = useMemo(() => {
    const letters = new Set(terms.map(t => t.term[0]?.toUpperCase()))
    return ALPHABET.filter(l => letters.has(l))
  }, [terms])

  const isSearching = query.trim().length > 0

  function clearSearch() {
    setQuery('')
    inputRef.current?.focus()
  }

  return (
    <div>
      {/* Search bar */}
      <div className="max-w-2xl mx-auto mb-10">
        <div className="relative">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={e => { setQuery(e.target.value); setActiveLetter('') }}
            placeholder="Zoek een term, bijvoorbeeld hijab, khimar of abaya"
            aria-label="Zoek een woordenboekterm"
            className="w-full pl-12 pr-12 py-4 border border-gray-300 rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent shadow-sm"
          />
          {query && (
            <button
              onClick={clearSearch}
              aria-label="Zoekopdracht wissen"
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {!isSearching && (
        <>
          {/* Popular terms */}
          <div className="mb-8">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Populaire termen</p>
            <div className="flex flex-wrap gap-2">
              {featuredTerms.map(t => (
                <Link
                  key={t.slug}
                  href={`/woordenboek/${t.slug}`}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-gray-200 rounded-full text-sm text-gray-700 hover:border-gray-900 hover:text-gray-900 transition-colors shadow-sm"
                >
                  {t.term}
                  {t.arabic && <span className="text-gray-400 text-xs">{t.arabic}</span>}
                </Link>
              ))}
            </div>
          </div>

          {/* Category tabs */}
          <div className="mb-6 flex flex-wrap gap-2">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => { setActiveCategory(cat); setActiveLetter('') }}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  activeCategory === cat
                    ? 'bg-gray-900 text-white'
                    : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-900 hover:text-gray-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* A-Z index */}
          <div className="mb-8 flex flex-wrap gap-1">
            <button
              onClick={() => setActiveLetter('')}
              className={`w-8 h-8 rounded text-sm font-medium transition-colors ${
                !activeLetter ? 'bg-gray-900 text-white' : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              Alle
            </button>
            {ALPHABET.map(letter => (
              <button
                key={letter}
                onClick={() => { setActiveLetter(activeLetter === letter ? '' : letter); setActiveCategory('Alle') }}
                disabled={!availableLetters.includes(letter)}
                className={`w-8 h-8 rounded text-sm font-medium transition-colors ${
                  activeLetter === letter
                    ? 'bg-gray-900 text-white'
                    : availableLetters.includes(letter)
                    ? 'text-gray-700 hover:bg-gray-100'
                    : 'text-gray-300 cursor-default'
                }`}
              >
                {letter}
              </button>
            ))}
          </div>
        </>
      )}

      {/* Results */}
      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-500 mb-2">
            We vonden geen exacte match. Probeer een andere spelling, bijvoorbeeld{' '}
            <button onClick={() => setQuery('hijab')} className="text-gray-900 underline">hijab</button>{' '}
            in plaats van <em>hijaab</em>, of blader alfabetisch door het woordenboek.
          </p>
          <div className="flex flex-wrap justify-center gap-2 mt-4">
            <p className="text-sm text-gray-400 w-full mb-2">Populaire termen:</p>
            {featuredTerms.map(t => (
              <Link key={t.slug} href={`/woordenboek/${t.slug}`} className="text-sm text-gray-700 hover:text-gray-900 underline">
                {t.term}
              </Link>
            ))}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(term => (
            <Link
              key={term.slug}
              href={`/woordenboek/${term.slug}`}
              className="group bg-white border border-gray-200 rounded-xl p-5 hover:border-gray-900 hover:shadow-md transition-all flex flex-col"
            >
              <div className="flex items-start justify-between mb-1">
                <h3 className="font-semibold text-gray-900 group-hover:text-gray-700">{term.term}</h3>
                {term.arabic && (
                  <span className="text-gray-400 text-lg leading-tight ml-2" dir="rtl">{term.arabic}</span>
                )}
              </div>
              <span className="text-xs text-gray-400 uppercase tracking-wide mb-2">{term.category}</span>
              <p className="text-sm text-gray-600 flex-grow line-clamp-3">{term.shortDefinition}</p>
              <span className="text-xs text-gray-400 mt-3 group-hover:text-gray-900 transition-colors">Lees meer →</span>
            </Link>
          ))}
        </div>
      )}

      {!isSearching && filtered.length > 0 && (
        <p className="text-sm text-gray-400 mt-6 text-center">
          {filtered.length} {filtered.length === 1 ? 'term' : 'termen'}
          {activeLetter ? ` op letter ${activeLetter}` : ''}
          {activeCategory !== 'Alle' ? ` in ${activeCategory}` : ''}
        </p>
      )}

      {isSearching && (
        <p className="text-sm text-gray-400 mt-6 text-center">
          {filtered.length === 0
            ? 'Geen resultaten'
            : `${filtered.length} ${filtered.length === 1 ? 'resultaat' : 'resultaten'} voor "${query}"`}
        </p>
      )}
    </div>
  )
}
