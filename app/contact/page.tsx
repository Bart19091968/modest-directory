import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Contact | ModestDirectory',
  description: 'Neem contact op met ModestDirectory. Vragen over uw winkelvermelding, samenwerking of algemene vragen? We helpen u graag.',
  alternates: { canonical: '/contact' },
  robots: { index: true, follow: true },
}

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://modestdirectory.com'

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
    { '@type': 'ListItem', position: 2, name: 'Contact', item: `${siteUrl}/contact` },
  ],
}

export default function ContactPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      <nav className="text-sm text-gray-500 mb-8" aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-1">
          <li><Link href="/" className="hover:text-accent">Home</Link></li>
          <li><span className="mx-2">›</span></li>
          <li className="text-gray-900" aria-current="page">Contact</li>
        </ol>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">Contact</h1>
      <p className="text-gray-600 mb-10">
        Heb je een vraag, opmerking of wil je samenwerken? Neem gerust contact met ons op — we reageren zo snel mogelijk.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">

        <div className="bg-gray-50 rounded-xl p-6">
          <h2 className="font-semibold text-gray-900 mb-3">E-mail</h2>
          <p className="text-gray-600 text-sm mb-3">Voor alle vragen en opmerkingen kun je ons bereiken via e-mail. We streven ernaar binnen 2 werkdagen te reageren.</p>
          <a href="mailto:info@modestdirectory.com" className="text-accent hover:underline font-medium">
            info@modestdirectory.com
          </a>
        </div>

        <div className="bg-gray-50 rounded-xl p-6">
          <h2 className="font-semibold text-gray-900 mb-3">Winkel aanmelden</h2>
          <p className="text-gray-600 text-sm mb-3">Wil je jouw winkel toevoegen aan ModestDirectory? Meld je direct aan via ons formulier.</p>
          <Link href="/gratis-aanmelden" className="text-accent hover:underline font-medium">
            Gratis aanmelden →
          </Link>
        </div>

      </div>

      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-gray-900">Veelgestelde vragen</h2>

        <div className="border-b pb-4">
          <h3 className="font-medium text-gray-900 mb-2">Hoe meld ik mijn winkel aan?</h3>
          <p className="text-gray-600 text-sm">
            Via onze <Link href="/gratis-aanmelden" className="text-accent hover:underline">gratis aanmeldpagina</Link> kun je binnen enkele minuten je winkel toevoegen. Na verificatie staat je winkel online.
          </p>
        </div>

        <div className="border-b pb-4">
          <h3 className="font-medium text-gray-900 mb-2">Hoe kan ik een review plaatsen?</h3>
          <p className="text-gray-600 text-sm">
            Ga naar de winkelpagina en klik op "Review schrijven". Je e-mailadres wordt gebruikt voor verificatie maar wordt niet publiek getoond.
          </p>
        </div>

        <div className="border-b pb-4">
          <h3 className="font-medium text-gray-900 mb-2">Mijn winkelgegevens kloppen niet, wat moet ik doen?</h3>
          <p className="text-gray-600 text-sm">
            Stuur een e-mail naar <a href="mailto:info@modestdirectory.com" className="text-accent hover:underline">info@modestdirectory.com</a> met de juiste gegevens en we passen het zo snel mogelijk aan.
          </p>
        </div>

        <div className="border-b pb-4">
          <h3 className="font-medium text-gray-900 mb-2">Zijn er betaalde pakketten beschikbaar?</h3>
          <p className="text-gray-600 text-sm">
            Ja, naast de gratis basisvermelding bieden we betaalde pakketten aan met extra functies zoals een logo, foto's, uitgebreide beschrijving en meer zichtbaarheid. Bekijk de <Link href="/aanmelden" className="text-accent hover:underline">pakketten en prijzen</Link>.
          </p>
        </div>

        <div className="pb-4">
          <h3 className="font-medium text-gray-900 mb-2">Hoe kan ik adverteren op ModestDirectory?</h3>
          <p className="text-gray-600 text-sm">
            Voor samenwerking en advertentiemogelijkheden kun je contact opnemen via <a href="mailto:info@modestdirectory.com" className="text-accent hover:underline">info@modestdirectory.com</a>.
          </p>
        </div>
      </div>

    </div>
  )
}
