import './globals.css'
import type { Metadata } from 'next'
import Link from 'next/link'
import { generateDirectoryJsonLd } from '@/lib/seo'
import Header from '@/components/Header'

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://modestdirectory.be'),
  title: {
    default: 'ModestDirectory - Islamitische Kledingwinkels Nederland & België',
    template: '%s | ModestDirectory',
  },
  description: 'Vind de beste hijab shops, abaya winkels en modest fashion in Nederland en België. Lees reviews, vergelijk scores en ontdek nieuwe winkels.',
  keywords: ['hijab', 'modest fashion', 'islamitische kleding', 'abaya', 'hoofddoek', 'België', 'Nederland', 'webshop', 'kledingwinkel'],
  authors: [{ name: 'ModestDirectory' }],
  creator: 'ModestDirectory',
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
    url: '/',
    siteName: 'ModestDirectory',
    title: 'ModestDirectory - Islamitische Kledingwinkels Nederland & België',
    description: 'Vind de beste hijab shops, abaya winkels en modest fashion in Nederland en België.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ModestDirectory - Islamitische Kledingwinkels',
    description: 'Vind de beste hijab shops en modest fashion in NL & BE.',
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
      </head>
      <body className="min-h-screen flex flex-col">
        <Header />

        {/* Main content */}
        <main className="flex-grow">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-gray-900 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="col-span-1 md:col-span-2">
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
                  <li><Link href="/shops?country=BE" className="hover:text-white transition-colors">Winkels in België</Link></li>
                  <li><Link href="/shops?country=NL" className="hover:text-white transition-colors">Winkels in Nederland</Link></li>
                  <li><Link href="/aanmelden" className="hover:text-white transition-colors">Winkel aanmelden</Link></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-4">Contact</h4>
                <ul className="space-y-2 text-gray-400">
                  <li>info@modestdirectory.be</li>
                </ul>
              </div>
            </div>
            
            <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500 text-sm">
              © {new Date().getFullYear()} ModestDirectory. Alle rechten voorbehouden.
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}
