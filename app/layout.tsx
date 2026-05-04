import './globals.css'
import type { Metadata } from 'next'
import Link from 'next/link'
import { generateDirectoryJsonLd } from '@/lib/seo'
import Header from '@/components/Header'

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://modestdirectory.com'),
  title: {
    default: 'ModestDirectory - Islamitische Kledingwinkels Nederland & België',
    template: '%s | ModestDirectory',
  },
  description: 'Vind de beste hijab shops, abaya winkels en modest fashion in Nederland en België. Lees reviews van echte klanten, vergelijk scores en ontdek islamitische kledingwinkels bij jou in de buurt.',
  keywords: [
    'hijab', 'hijab shop', 'hijab kopen', 'hoofddoek', 'hoofddoek kopen',
    'abaya', 'abaya kopen', 'abaya winkel', 'jilbab', 'niqab', 'khimar',
    'modest fashion', 'modest kleding', 'islamitische kleding', 'islamitische mode',
    'moslim kleding', 'moslim mode', 'halal fashion', 'gebedskleding',
    'thobe', 'kaftan', 'djellaba', 'islamitisch', 'moslim',
    'België', 'Nederland', 'webshop', 'kledingwinkel', 'directory',
    'online kopen', 'islamitische webshop', 'modest wear', 'hijab accessoires',
  ],
  authors: [{ name: 'ModestDirectory' }],
  creator: 'ModestDirectory',
  publisher: 'ModestDirectory',
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '48x48' },
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  openGraph: {
    type: 'website',
    locale: 'nl_BE',
    alternateLocale: ['nl_NL'],
    url: '/',
    siteName: 'ModestDirectory',
    title: 'ModestDirectory - Islamitische Kledingwinkels Nederland & België',
    description: 'Vind de beste hijab shops, abaya winkels en modest fashion in Nederland en België. Lees echte klantreviews en vergelijk scores.',
    images: [
      {
        url: '/icon-512.png',
        width: 512,
        height: 512,
        alt: 'ModestDirectory - Islamitische Kledingwinkels Nederland & België',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ModestDirectory - Islamitische Kledingwinkels Nederland & België',
    description: 'Vind de beste hijab shops en modest fashion in NL & BE. Reviews, scores en meer.',
    images: ['/icon-512.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
  alternates: {
    languages: {
      'nl-BE': process.env.NEXT_PUBLIC_SITE_URL || 'https://modestdirectory.com',
      'nl-NL': process.env.NEXT_PUBLIC_SITE_URL || 'https://modestdirectory.com',
      'x-default': process.env.NEXT_PUBLIC_SITE_URL || 'https://modestdirectory.com',
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const jsonLd = generateDirectoryJsonLd()

  return (
    <html lang="nl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        <link rel="dns-prefetch" href="https://pagead2.googlesyndication.com" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {process.env.NEXT_PUBLIC_ADSENSE_ID && (
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_ID}`}
            crossOrigin="anonymous"
          />
        )}
        {process.env.NEXT_PUBLIC_GA_ID && (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
                `,
              }}
            />
          </>
        )}
      </head>
      <body className="min-h-screen flex flex-col">
        <Header />

        {/* Main content */}
        <main className="flex-grow">
          {children}
        </main>

        {/* CTA - Heb je een winkel? */}
        <section className="py-16 bg-accent">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Heb je een winkel?</h2>
            <p className="text-gray-300 mb-8 max-w-xl mx-auto">
              Vind je je winkel niet terug? Meld hem dan gratis aan of kies voor één van onze betalende opties.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/gratis-aanmelden" className="inline-block bg-white text-accent px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                Gratis aanmelden
              </Link>
              <Link href="/aanmelden" className="inline-block bg-transparent text-white border-2 border-white px-8 py-4 rounded-lg font-semibold hover:bg-white/10 transition-colors">
                Kies een pakket
              </Link>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div>
                <h3 className="text-xl font-bold mb-4">ModestDirectory</h3>
                <p className="text-gray-400 mb-4">
                  De meest complete gids voor islamitische kledingwinkels in Nederland en België.
                  Vind hijab shops, abaya winkels en modest fashion bij jou in de buurt.
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-4">Navigatie</h4>
                <ul className="space-y-2 text-gray-400">
                  <li><Link href="/shops" className="hover:text-white transition-colors">Alle winkels</Link></li>
                  <li><Link href="/islamitische-kleding/belgie" className="hover:text-white transition-colors">Winkels in België</Link></li>
                  <li><Link href="/islamitische-kleding/nederland" className="hover:text-white transition-colors">Winkels in Nederland</Link></li>
                  <li><Link href="/aanmelden" className="hover:text-white transition-colors">Winkel aanmelden</Link></li>
                  <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
                  <li><Link href="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-4">Categorieën</h4>
                <ul className="space-y-2 text-gray-400">
                  <li><Link href="/hijab-shops/nederland" className="hover:text-white transition-colors">Hijab Shops Nederland</Link></li>
                  <li><Link href="/hijab-shops/belgie" className="hover:text-white transition-colors">Hijab Shops België</Link></li>
                  <li><Link href="/abaya-shops/nederland" className="hover:text-white transition-colors">Abaya Winkels Nederland</Link></li>
                  <li><Link href="/abaya-shops/belgie" className="hover:text-white transition-colors">Abaya Winkels België</Link></li>
                  <li><Link href="/islamitische-kleding/nederland" className="hover:text-white transition-colors">Islamitische Kleding NL</Link></li>
                  <li><Link href="/islamitische-kleding/belgie" className="hover:text-white transition-colors">Islamitische Kleding BE</Link></li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-4">Over ons</h4>
                <ul className="space-y-2 text-gray-400">
                  <li><Link href="/over-ons" className="hover:text-white transition-colors">Over ModestDirectory</Link></li>
                  <li><Link href="/privacybeleid" className="hover:text-white transition-colors">Privacybeleid</Link></li>
                  <li><Link href="/gebruiksvoorwaarden" className="hover:text-white transition-colors">Gebruiksvoorwaarden</Link></li>
                  <li>
                    <a href="mailto:info@modestdirectory.com" className="hover:text-white transition-colors">
                      info@modestdirectory.com
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500 text-sm">
              © {new Date().getFullYear()} ModestDirectory. Alle rechten voorbehouden.
              {' · '}
              <Link href="/privacybeleid" className="hover:text-gray-300 transition-colors">Privacybeleid</Link>
              {' · '}
              <Link href="/gebruiksvoorwaarden" className="hover:text-gray-300 transition-colors">Gebruiksvoorwaarden</Link>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}
