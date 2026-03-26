import { Metadata } from 'next'
import ShopRegistrationForm from '@/components/ShopRegistrationForm'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Winkel Aanmelden | ModestDirectory',
  description: 'Meld je islamitische kledingwinkel aan bij ModestDirectory voor €100 per 3 maanden en bereik duizenden potentiële klanten in Nederland en België.',
}

export default function AanmeldenPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Winkel aanmelden
        </h1>
        <p className="text-gray-600">
          Bereik duizenden potentiële klanten met je vermelding op ModestDirectory
        </p>
      </div>

      {/* Benefits */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-accent/5 rounded-lg p-4 text-center">
          <span className="text-2xl mb-2 block">💰</span>
          <h3 className="font-semibold text-gray-900">€100 / 3 maanden</h3>
          <p className="text-sm text-gray-600">Betaalbare vermelding</p>
        </div>
        <div className="bg-accent/5 rounded-lg p-4 text-center">
          <span className="text-2xl mb-2 block">👥</span>
          <h3 className="font-semibold text-gray-900">Bereik</h3>
          <p className="text-sm text-gray-600">Duizenden bezoekers per maand</p>
        </div>
        <div className="bg-accent/5 rounded-lg p-4 text-center">
          <span className="text-2xl mb-2 block">📸</span>
          <h3 className="font-semibold text-gray-900">Logo & Foto's</h3>
          <p className="text-sm text-gray-600">Toon je winkel visueel</p>
        </div>
      </div>

      {/* What's included */}
      <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
        <h2 className="font-semibold text-gray-900 mb-4">Wat zit er inbegrepen?</h2>
        <ul className="space-y-2 text-gray-600">
          <li className="flex items-center gap-2">
            <span className="text-green-500">✓</span>
            Vermelding op alle relevante pagina's
          </li>
          <li className="flex items-center gap-2">
            <span className="text-green-500">✓</span>
            Eigen winkelpagina met logo en foto's
          </li>
          <li className="flex items-center gap-2">
            <span className="text-green-500">✓</span>
            Reviews van klanten verzamelen
          </li>
          <li className="flex items-center gap-2">
            <span className="text-green-500">✓</span>
            Link naar je website
          </li>
          <li className="flex items-center gap-2">
            <span className="text-green-500">✓</span>
            Zichtbaar in zoekresultaten
          </li>
          <li className="flex items-center gap-2">
            <span className="text-green-500">✓</span>
            Factuur beschikbaar indien gewenst
          </li>
        </ul>
      </div>

      {/* Form */}
      <div className="bg-white rounded-xl shadow-sm border p-8">
        <ShopRegistrationForm />
      </div>

      {/* Info */}
      <div className="mt-8 text-center text-sm text-gray-500">
        <p>
          Na aanmelding en betaling wordt je winkel beoordeeld. 
          Je ontvangt een bevestigingsmail zodra je winkel online staat.
        </p>
        <p className="mt-2">
          Vragen? Mail naar{' '}
          <a href="mailto:info@modestdirectory.be" className="text-accent hover:underline">
            info@modestdirectory.be
          </a>
        </p>
      </div>
    </div>
  )
}
