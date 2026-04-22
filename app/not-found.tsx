import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Pagina niet gevonden | ModestDirectory',
  description: 'Deze pagina bestaat niet. Bekijk onze winkels, blog of ga terug naar de homepage.',
  robots: { index: false, follow: true },
}

export default function NotFound() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-24 text-center">
      <p className="text-6xl font-bold text-accent mb-4">404</p>
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Pagina niet gevonden</h1>
      <p className="text-gray-600 mb-8">
        De pagina die je zoekt bestaat niet of is verplaatst.
      </p>
      <div className="flex flex-wrap justify-center gap-4">
        <Link href="/" className="btn-primary">
          Naar homepage
        </Link>
        <Link href="/shops" className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
          Alle winkels
        </Link>
        <Link href="/blog" className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
          Blog
        </Link>
      </div>
    </div>
  )
}
