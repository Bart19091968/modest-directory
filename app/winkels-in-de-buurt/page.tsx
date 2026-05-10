import { Metadata } from 'next'
import NearbyShopsSearch from '@/components/NearbyShopsSearch'

export const metadata: Metadata = {
  title: 'Winkels in mijn buurt | Islamitische kleding & hijab shops | ModestDirectory',
  description:
    'Vind islamitische kledingwinkels, hijab shops en modest fashion winkels bij jou in de buurt. Zoek op locatie of gebruik je GPS om winkels binnen jouw gewenste straal te ontdekken.',
  alternates: {
    canonical: '/winkels-in-de-buurt',
  },
  openGraph: {
    title: 'Winkels in mijn buurt | ModestDirectory',
    description:
      'Vind islamitische kledingwinkels en hijab shops bij jou in de buurt. Zoek op locatie of postcode.',
    type: 'website',
    images: [{ url: '/icon-512.png', width: 512, height: 512, alt: 'ModestDirectory' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Winkels in mijn buurt | ModestDirectory',
    description: 'Vind islamitische kledingwinkels en hijab shops bij jou in de buurt.',
    images: ['/icon-512.png'],
  },
}

export default function WinkelsInDeBuurtPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-3">Winkels in mijn buurt</h1>
      <p className="text-gray-600 mb-2">
        Ontdek islamitische kledingwinkels, hijab shops en modest fashion winkels die bij jou in de
        buurt zijn. Gebruik je GPS-locatie of voer een stad of postcode in om winkels binnen jouw
        gewenste straal te zoeken.
      </p>
      <p className="text-xs text-gray-400 mb-8">
        🔒 Je locatie wordt alleen gebruikt om winkels in de buurt te zoeken en wordt niet opgeslagen.
      </p>

      <NearbyShopsSearch />

      <section className="mt-12 prose prose-sm max-w-none text-gray-600">
        <h2 className="text-xl font-semibold text-gray-900 mb-3">
          Fysieke winkels voor islamitische kleding in Nederland en België
        </h2>
        <p>
          ModestDirectory helpt je de beste islamitische kledingwinkels en hijab shops te vinden, of
          je nu op zoek bent naar een abaya, jilbab, hijab, niqab of andere modest fashion. Naast
          webshops zijn er steeds meer fysieke winkels in steden zoals Amsterdam, Rotterdam, Den Haag,
          Utrecht, Antwerpen en Brussel.
        </p>
        <p>
          Gebruik de zoekfunctie hierboven om winkels bij jou in de buurt te ontdekken. Je kunt kiezen
          voor een straal van 5, 10, 25, 50 of 100 km. Winkels worden gesorteerd op afstand, zodat je
          altijd de dichtstbijzijnde opties als eerste ziet.
        </p>
      </section>
    </main>
  )
}
