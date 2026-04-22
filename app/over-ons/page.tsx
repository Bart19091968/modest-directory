import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Over ModestDirectory | Islamitische Kledingwinkels NL & BE',
  description: 'Leer meer over ModestDirectory, de meest complete gids voor islamitische kledingwinkels, hijab shops en modest fashion in Nederland en België.',
  alternates: { canonical: '/over-ons' },
  openGraph: {
    title: 'Over ModestDirectory',
    description: 'De meest complete gids voor islamitische kledingwinkels, hijab shops en modest fashion in Nederland en België.',
    type: 'website',
    images: [{ url: '/icon-512.png', width: 512, height: 512, alt: 'Over ModestDirectory' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Over ModestDirectory',
    description: 'De meest complete gids voor islamitische kledingwinkels in NL & BE.',
    images: ['/icon-512.png'],
  },
}

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://modestdirectory.com'

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
    { '@type': 'ListItem', position: 2, name: 'Over ons', item: `${siteUrl}/over-ons` },
  ],
}

export default function OverOnsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      <nav className="text-sm text-gray-500 mb-8" aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-1">
          <li><Link href="/" className="hover:text-accent">Home</Link></li>
          <li><span className="mx-2">›</span></li>
          <li className="text-gray-900" aria-current="page">Over ons</li>
        </ol>
      </nav>

      <h1 className="text-3xl font-bold text-gray-900 mb-6">Over ModestDirectory</h1>

      <div className="space-y-8">

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Onze missie</h2>
          <p className="text-gray-700 leading-relaxed">
            ModestDirectory is opgericht met één doel: het gemakkelijk maken voor moslima's en iedereen die geïnteresseerd is in modest fashion om de juiste winkel te vinden. Of je nu op zoek bent naar een hijab, een abaya, een jilbab of andere islamitische kleding — wij brengen je in contact met de beste winkels in Nederland en België.
          </p>
          <p className="text-gray-700 leading-relaxed mt-3">
            Wij geloven dat elke vrouw het recht heeft om zich mooi en zelfverzekerd te kleden op een manier die past bij haar waarden. ModestDirectory helpt daarbij door een betrouwbare, overzichtelijke gids te bieden met echte reviews van echte klanten.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Wat bieden wij?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              {
                title: 'Uitgebreide directory',
                desc: 'Honderden islamitische kledingwinkels, hijab shops en modest fashion boutiques in Nederland en België, overzichtelijk gecategoriseerd.',
              },
              {
                title: 'Echte reviews',
                desc: 'Klantreviews worden geverifieerd via e-mail, zodat je kunt vertrouwen op eerlijke en betrouwbare beoordelingen.',
              },
              {
                title: 'Zoeken op locatie',
                desc: 'Vind winkels bij jou in de buurt via onze zoekmogelijkheid op stad, regio of land.',
              },
              {
                title: 'Blog & inspiratie',
                desc: 'Lees tips over modest fashion, hijab trends, styling en meer op ons blog.',
              },
            ].map(item => (
              <div key={item.title} className="bg-gray-50 rounded-xl p-5">
                <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Voor winkeliers</h2>
          <p className="text-gray-700 leading-relaxed">
            Ben je eigenaar van een islamitische kledingwinkel, hijab shop of modest fashion boutique? Meld je dan aan op ModestDirectory en vergroot je zichtbaarheid. Duizenden bezoekers per maand zoeken actief naar winkels zoals die van jou.
          </p>
          <p className="text-gray-700 leading-relaxed mt-3">
            Wij bieden zowel een gratis basisvermelding als betaalde abonnementen met meer mogelijkheden zoals een logo, extra foto's, lange beschrijving, openingsuren en social media links.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 mt-5">
            <Link href="/gratis-aanmelden" className="btn-primary text-center">
              Gratis aanmelden
            </Link>
            <Link href="/aanmelden" className="inline-block bg-white border border-accent text-accent px-6 py-3 rounded-lg font-semibold hover:bg-accent/5 transition-colors text-center">
              Bekijk betaalde pakketten
            </Link>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Onze waarden</h2>
          <ul className="space-y-3 text-gray-700">
            <li className="flex gap-3">
              <span className="text-accent font-bold flex-shrink-0">✓</span>
              <span><strong>Betrouwbaarheid:</strong> we verifiëren reviews en controleren winkelprofielen om de kwaliteit van onze directory hoog te houden.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-accent font-bold flex-shrink-0">✓</span>
              <span><strong>Inclusiviteit:</strong> we verwelkomen winkels voor alle vormen van modest fashion — van traditionele islamitische kleding tot hedendaagse modest wear.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-accent font-bold flex-shrink-0">✓</span>
              <span><strong>Transparantie:</strong> we zijn helder over hoe we werken, hoe we omgaan met gegevens en wat winkeliers van ons mogen verwachten.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-accent font-bold flex-shrink-0">✓</span>
              <span><strong>Gemeenschap:</strong> we verbinden consumenten en winkeliers en dragen bij aan een sterke modest fashion gemeenschap in de Benelux.</span>
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Contact</h2>
          <p className="text-gray-700 leading-relaxed">
            Heb je vragen, suggesties of wil je samenwerken? We horen graag van je.
          </p>
          <p className="mt-3">
            <a href="mailto:info@modestdirectory.com" className="text-accent hover:underline font-medium">
              info@modestdirectory.com
            </a>
          </p>
        </section>

      </div>
    </div>
  )
}
