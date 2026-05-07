import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import prisma from '@/lib/db'

export const dynamic = 'force-dynamic'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://modestdirectory.com'

type RelatedLink = {
  label: string
  href: string
  type: string
}

async function getTerm(slug: string) {
  const term = await prisma.dictionaryTerm.findUnique({
    where: { slug, isPublished: true },
  })
  if (!term) return null
  return JSON.parse(JSON.stringify(term))
}

async function getRelatedTerms(slugs: string[]) {
  if (!slugs.length) return []
  const terms = await prisma.dictionaryTerm.findMany({
    where: { slug: { in: slugs }, isPublished: true },
    select: { term: true, slug: true, arabic: true, shortDefinition: true, category: true },
  })
  return JSON.parse(JSON.stringify(terms))
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const term = await prisma.dictionaryTerm.findUnique({
    where: { slug: params.slug, isPublished: true },
    select: { term: true, seoTitle: true, seoDescription: true, slug: true },
  })
  if (!term) return { title: 'Niet gevonden' }

  return {
    title: term.seoTitle || `Wat is een ${term.term}? | ModestDirectory`,
    description: term.seoDescription || `Ontdek wat een ${term.term} is en hoe het gedragen wordt.`,
    alternates: { canonical: `/woordenboek/${term.slug}` },
    openGraph: {
      title: term.seoTitle || `Wat is een ${term.term}? | ModestDirectory`,
      description: term.seoDescription || undefined,
    },
  }
}

export default async function TermPage({ params }: { params: { slug: string } }) {
  const term = await getTerm(params.slug)
  if (!term) notFound()

  const relatedTerms = await getRelatedTerms(term.relatedTermSlugs || [])
  const categoryLinks: RelatedLink[] = (term.relatedCategoryLinks as RelatedLink[]) || []
  const blogLinks: RelatedLink[] = (term.relatedBlogLinks as RelatedLink[]) || []

  const termUrl = `${BASE_URL}/woordenboek/${term.slug}`

  const definedTermJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'DefinedTerm',
    name: term.term,
    alternateName: [
      ...(term.arabic ? [term.arabic] : []),
      ...(term.aliases || []),
    ],
    description: term.shortDefinition,
    inDefinedTermSet: {
      '@type': 'DefinedTermSet',
      name: 'Modest Fashion Woordenboek',
      url: `${BASE_URL}/woordenboek`,
    },
    url: termUrl,
  }

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${BASE_URL}/` },
      { '@type': 'ListItem', position: 2, name: 'Woordenboek', item: `${BASE_URL}/woordenboek` },
      { '@type': 'ListItem', position: 3, name: term.term, item: termUrl },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(definedTermJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      {/* Hero */}
      <div
        className="relative border-b"
        style={{ backgroundImage: 'url(/hero-banner-blog.jpg)', backgroundSize: 'cover', backgroundPosition: 'center 30%' }}
      >
        <div className="absolute inset-0 bg-black/55" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <nav className="text-sm text-white/60 mb-4">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span className="mx-2">›</span>
            <Link href="/woordenboek" className="hover:text-white transition-colors">Woordenboek</Link>
            <span className="mx-2">›</span>
            <span className="text-white/90">{term.term}</span>
          </nav>
          <div className="flex items-start gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-1">
                Wat is een {term.term}?
              </h1>
              {term.arabic && (
                <p className="text-white/60 text-xl mt-1" dir="rtl">{term.arabic}</p>
              )}
            </div>
          </div>
          <div className="mt-3 flex items-center gap-3">
            <span className="inline-block bg-white/20 text-white text-xs px-3 py-1 rounded-full">
              {term.category}
            </span>
            {term.pronunciation && (
              <span className="text-white/60 text-sm italic">{term.pronunciation}</span>
            )}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Short definition card */}
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 mb-8">
          <p className="text-base text-gray-700 leading-relaxed font-medium">
            {term.shortDefinition}
          </p>
        </div>

        {/* Long definition */}
        <div
          className="prose prose-gray max-w-none mb-10"
          dangerouslySetInnerHTML={{ __html: term.longDefinition }}
        />

        {/* Related terms */}
        {relatedTerms.length > 0 && (
          <div className="mb-10">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Verwante woorden</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {relatedTerms.map((rt: { slug: string; term: string; arabic: string | null; shortDefinition: string; category: string }) => (
                <Link
                  key={rt.slug}
                  href={`/woordenboek/${rt.slug}`}
                  className="group flex items-start gap-3 bg-white border border-gray-200 rounded-lg p-4 hover:border-gray-900 transition-colors"
                >
                  <div className="flex-grow min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900 group-hover:text-gray-700">{rt.term}</span>
                      {rt.arabic && <span className="text-gray-400 text-sm" dir="rtl">{rt.arabic}</span>}
                    </div>
                    <p className="text-xs text-gray-500 truncate mt-0.5">{rt.shortDefinition}</p>
                  </div>
                  <svg className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Directory links */}
        {categoryLinks.length > 0 && (
          <div className="mb-10">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Winkels en gidsen</h2>
            <div className="flex flex-wrap gap-2">
              {categoryLinks.map((link, i) => (
                <Link
                  key={i}
                  href={link.href}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-gray-900 text-white text-sm rounded-lg hover:bg-gray-700 transition-colors"
                >
                  {link.label}
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Blog links */}
        {blogLinks.length > 0 && (
          <div className="mb-10">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Gerelateerde artikelen</h2>
            <div className="space-y-2">
              {blogLinks.map((link, i) => (
                <Link
                  key={i}
                  href={link.href}
                  className="flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900 hover:underline"
                >
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Back link */}
        <div className="border-t border-gray-200 pt-6">
          <Link href="/woordenboek" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
            ← Terug naar het Modest Fashion Woordenboek
          </Link>
        </div>
      </div>
    </>
  )
}
