import { Metadata } from 'next'
import ShopRegistrationForm from '@/components/ShopRegistrationForm'

export const metadata: Metadata = {
  title: 'Winkel Aanmelden',
  description: 'Meld je islamitische kledingwinkel gratis aan bij ModestDirectory en bereik duizenden potentiële klanten in Nederland en België.',
}

export default function AanmeldenPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Winkel aanmelden
        </h1>
        <p className="text-gray-600">
          Heb je een islamitische kledingwinkel? Meld je gratis aan en bereik 
          duizenden potentiële klanten in Nederland en België.
        </p>
      </div>

      <div className="bg-white rounded-2xl p-8 border border-gray-100">
        <ShopRegistrationForm />
      </div>

      <div className="mt-8 bg-primary-50 rounded-xl p-6">
        <h3 className="font-semibold text-gray-900 mb-3">Wat gebeurt er na aanmelding?</h3>
        <ol className="list-decimal list-inside space-y-2 text-gray-600">
          <li>Wij bekijken je aanmelding (meestal binnen 24 uur)</li>
          <li>Je ontvangt een bevestiging per email</li>
          <li>Je winkel wordt zichtbaar in de directory</li>
          <li>Klanten kunnen reviews achterlaten</li>
        </ol>
      </div>
    </div>
  )
}
