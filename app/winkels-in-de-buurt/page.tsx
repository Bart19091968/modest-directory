import { Metadata } from 'next'
import Link from 'next/link'
import NearbyShopsSearch from '@/components/NearbyShopsSearch'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://modestdirectory.com'

export const metadata: Metadata = {
  title: "Winkels in mijn buurt | Islamitische kleding & hijab shops | ModestDirectory",
  description:
    "Vind islamitische kledingwinkels, hijab shops en modest fashion winkels bij jou in de buurt. Zoek op locatie of gebruik je GPS om winkels binnen jouw gewenste straal te ontdekken.",
  alternates: {
    canonical: '/winkels-in-de-buurt',
  },
  openGraph: {
    title: 'Winkels in mijn buurt | ModestDirectory',
    description:
      "Vind islamitische kledingwinkels en hijab shops bij jou in de buurt. Zoek op locatie of postcode.",
    type: 'website',
    images: [{ url: '/icon-512.png', width: 512, height: 512, alt: 'ModestDirectory' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Winkels in mijn buurt | ModestDirectory',
    description: "Vind islamitische kledingwinkels en hijab shops bij jou in de buurt.",
    images: ['/icon-512.png'],
  },
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
    { '@type': 'ListItem', position: 2, name: 'Winkels in mijn buurt', item: `${SITE_URL}/winkels-in-de-buurt` },
  ],
}

const internalLinks = [
  { href: '/modest-fashion/belgie', label: 'Modest fashion winkels in België' },
  { href: '/modest-fashion/nederland', label: 'Modest fashion winkels in Nederland' },
  { href: '/hijab-shops/belgie', label: 'Hijab shops in België' },
  { href: '/hijab-shops/nederland', label: 'Hijab shops in Nederland' },
  { href: '/abaya-shops/belgie', label: 'Abaya winkels in België' },
  { href: '/abaya-shops/nederland', label: 'Abaya winkels in Nederland' },
]

export default function WinkelsInDeBuurtPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Hero banner */}
      <div
        className="relative border-b"
        style={{ backgroundImage: 'url(/hero-banner.jpg)', backgroundSize: 'cover', backgroundPosition: 'center 30%' }}
      >
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative max-w-6xl mx-auto px-4 py-10">
          <nav className="text-sm text-white/70 mb-4" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-white">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-white">Winkels in mijn buurt</span>
          </nav>
          <h1 className="text-4xl font-bold text-white">Winkels in mijn buurt</h1>
          <p className="text-lg text-white/80 mt-2">
            Vind islamitische kledingwinkels en hijab shops bij jou in de buurt
          </p>
        </div>
      </div>

      {/* Intro */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-white p-8 rounded-lg shadow">
          <p className="text-gray-700 leading-relaxed mb-4">
            Welkom bij ModestDirectory. Op deze pagina vind je islamitische kledingwinkels, hijab shops
            en modest fashion winkels die bij jou in de buurt zijn — in België en Nederland. Gebruik je
            GPS-locatie voor directe resultaten, of voer een stad of postcode in om winkels binnen jouw
            gewenste straal te zoeken.
          </p>
          <p className="text-gray-700 leading-relaxed mb-4">
            Je kiest zelf de zoekradius: van 5 km voor winkels vlak bij huis, tot 100 km als je bereid
            bent verder te rijden. Resultaten worden op afstand gesorteerd, zodat je altijd de
            dichtstbijzijnde opties als eerste ziet.
          </p>
          <p className="text-xs text-gray-400">
            🔒 Je locatie wordt uitsluitend gebruikt om winkels in de buurt te zoeken en wordt nergens
            opgeslagen.
          </p>
        </div>
      </div>

      {/* Zoekcomponent */}
      <div className="max-w-6xl mx-auto px-4 pb-8">
        <NearbyShopsSearch />
      </div>

      {/* Woordenboek contextlink */}
      <div className="max-w-6xl mx-auto px-4 pb-4">
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 text-sm text-gray-600">
          Ontdek belangrijke termen in ons{' '}
          <Link href="/woordenboek" className="text-gray-900 font-medium hover:underline">
            Modest Fashion Woordenboek
          </Link>
          , van{' '}
          <Link href="/woordenboek/khimar" className="text-gray-900 hover:underline">khimar</Link>
          {' '}en{' '}
          <Link href="/woordenboek/jilbab" className="text-gray-900 hover:underline">jilbab</Link>
          {' '}tot{' '}
          <Link href="/woordenboek/qamis" className="text-gray-900 hover:underline">qamis</Link>
          {', '}
          <Link href="/woordenboek/undercap" className="text-gray-900 hover:underline">undercap</Link>
          {' '}en{' '}
          <Link href="/woordenboek/instant-hijab" className="text-gray-900 hover:underline">instant hijab</Link>.
        </div>
      </div>

      {/* SEO blok */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-white p-8 rounded-lg shadow">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Fysieke winkels voor islamitische kleding in Nederland en België
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            ModestDirectory helpt je de beste islamitische kledingwinkels en hijab shops te vinden, of
            je nu op zoek bent naar een abaya, jilbab, hijab, niqab of andere modest fashion. Naast
            webshops zijn er steeds meer fysieke winkels in steden zoals Amsterdam, Rotterdam, Den Haag,
            Utrecht, Antwerpen en Brussel.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Niet elke modest-fashionzoektocht begint in een grote winkelstraat. Soms gaat het om een
            lokale winkel op een kwartier rijden, of een gespecialiseerd adres dat je anders nooit zou
            vinden. De buurtzoeker maakt het makkelijker om zulke winkels te ontdekken — los van land
            of stad.
          </p>
        </div>
      </div>

      {/* Interne links */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Meer winkels ontdekken</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {internalLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition text-center"
            >
              <p className="font-semibold text-gray-900 text-sm">{link.label}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="bg-blue-50 p-8 rounded-lg text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Heb je een islamitische kledingwinkel?
          </h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Meld je winkel aan bij ModestDirectory en bereik duizenden potentiële klanten die zoeken
            naar islamitische kleding en hijab shops bij hen in de buurt.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/aanmelden" className="btn-primary">Winkel aanmelden</Link>
            <Link
              href="/shops"
              className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-white transition bg-white/50"
            >
              Alle winkels bekijken
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
