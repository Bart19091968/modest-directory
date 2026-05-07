import type { Metadata } from 'next'
import prisma from '@/lib/db'
import DictionarySearch from '@/components/dictionary/DictionarySearch'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Modest Fashion Woordenboek | Hijab, Abaya, Khimar & Jilbab uitgelegd',
  description: 'Ontdek de betekenis van modest fashion-termen zoals hijab, abaya, khimar, jilbab, qamis, undercap en chiffon hijab. Een duidelijke gids van ModestDirectory.',
  alternates: {
    canonical: '/woordenboek',
  },
  openGraph: {
    title: 'Modest Fashion Woordenboek | ModestDirectory',
    description: 'Ontdek de betekenis van modest fashion-termen zoals hijab, abaya, khimar, jilbab en meer.',
  },
}

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://modestdirectory.com'

async function getPublishedTerms() {
  const terms = await prisma.dictionaryTerm.findMany({
    where: { isPublished: true },
    select: {
      id: true,
      term: true,
      slug: true,
      arabic: true,
      shortDefinition: true,
      category: true,
      aliases: true,
      transliterationVariants: true,
      isFeatured: true,
    },
    orderBy: { term: 'asc' },
  })
  return JSON.parse(JSON.stringify(terms))
}

export default async function WoordenboekPage() {
  const terms = await getPublishedTerms()

  const collectionPageJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Modest Fashion Woordenboek',
    description: 'Een woordenboek met uitleg over hijab, abaya, khimar, jilbab en andere modest fashion-termen.',
    url: `${BASE_URL}/woordenboek`,
  }

  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Populaire modest fashion termen',
    itemListElement: terms
      .filter((t: { isFeatured: boolean }) => t.isFeatured)
      .map((t: { slug: string; term: string }, i: number) => ({
        '@type': 'ListItem',
        position: i + 1,
        url: `${BASE_URL}/woordenboek/${t.slug}`,
        name: t.term,
      })),
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionPageJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }} />

      {/* Hero */}
      <div
        className="relative border-b"
        style={{ backgroundImage: 'url(/hero-banner-blog.jpg)', backgroundSize: 'cover', backgroundPosition: 'center 30%' }}
      >
        <div className="absolute inset-0 bg-black/55" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Modest Fashion Woordenboek
          </h1>
          <p className="text-lg text-white/80 max-w-2xl mx-auto mb-2">
            Van hijab en abaya tot khimar, jilbab en qamis: modest fashion heeft een eigen taal. In dit woordenboek vind je heldere uitleg bij kledingstukken, stoffen, stijlen en termen die vaak terugkomen in islamitische mode en bescheiden kleding.
          </p>
          <p className="text-sm text-white/60 max-w-xl mx-auto">
            Zoek een term, blader alfabetisch of ontdek verwante begrippen. Bij elke uitleg vind je ook links naar relevante winkels, categorieën en gidsen op ModestDirectory.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <DictionarySearch terms={terms} />
      </div>
    </>
  )
}
