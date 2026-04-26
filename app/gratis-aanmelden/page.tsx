import { Metadata } from 'next'
import prisma from '@/lib/db'
import GratisAanmeldenClient from '@/components/GratisAanmeldenClient'

export const metadata: Metadata = {
  title: 'Gratis Winkel Aanmelden | ModestDirectory',
  description: 'Meld je islamitische kledingwinkel gratis aan bij ModestDirectory en bereik duizenden potentiële klanten in Nederland en België.',
  alternates: { canonical: '/gratis-aanmelden' },
}

async function getCategories() {
  try {
    const dbCategories = await prisma.category.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
      select: { id: true, name: true },
    })
    
    if (dbCategories.length > 0) {
      return dbCategories
    }
  } catch (e) {
    console.error('Error fetching categories from database:', e)
  }

  // Fallback: hardcoded categories
  return [
    { id: 'hijab-shops', name: 'Hijab Shops' },
    { id: 'abaya-shops', name: 'Abaya Winkels' },
    { id: 'islamitische-kleding', name: 'Islamitische Kleding' },
  ]
}

export default async function GratisAanmeldenPage() {
  const categories = await getCategories()

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Gratis aanmelden
        </h1>
        <p className="text-gray-600 text-lg max-w-xl mx-auto">
          Meld je winkel gratis aan en word zichtbaar voor duizenden bezoekers.
          Wil je meer mogelijkheden?{' '}
          <a href="/aanmelden" className="text-accent hover:underline font-medium">Kies een betalend pakket</a>.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border p-8">
        <GratisAanmeldenClient categories={categories} />
      </div>

      <div className="mt-8 text-center text-sm text-gray-500">
        <p>
          Vragen? Mail naar{' '}
          <a href="mailto:info@modestdirectory.com" className="text-accent hover:underline">
            info@modestdirectory.com
          </a>
        </p>
      </div>
    </div>
  )
}
