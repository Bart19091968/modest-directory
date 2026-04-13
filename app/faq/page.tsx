import prisma from '@/lib/db'
import { Metadata } from 'next'
import FAQSection from '@/components/FAQSection'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Veelgestelde Vragen over Islamitische Kleding & Hijab Shops | ModestDirectory',
  description: 'Antwoorden op veelgestelde vragen over islamitische kleding, hijabs, abayas en modest fashion winkels in Nederland en België. Alles wat je moet weten over het vinden van de juiste winkel.',
  alternates: {
    canonical: '/faq',
  },
}

export const dynamic = 'force-dynamic'

async function getFAQs() {
  return prisma.fAQ.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: 'asc' },
  })
}

export default async function FAQPage() {
  const faqs = await getFAQs()

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Veelgestelde vragen
        </h1>
        <p className="text-gray-600">
          Antwoorden op de meest gestelde vragen over islamitische kleding en onze directory
        </p>
      </div>

      {faqs.length > 0 ? (
        <FAQSection faqs={faqs} />
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <p className="text-gray-500">Binnenkort FAQ's beschikbaar</p>
        </div>
      )}

      {/* Contact CTA */}
      <div className="mt-12 p-8 bg-accent/5 rounded-xl text-center">
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          Vraag niet beantwoord?
        </h3>
        <p className="text-gray-600 mb-4">
          Neem contact met ons op via email
        </p>
        <a 
          href="mailto:info@modestdirectory.com"
          className="text-accent hover:underline font-medium"
        >
          info@modestdirectory.com
        </a>
      </div>

      {/* Shop Registration CTA */}
      <div className="mt-8 p-8 bg-white border rounded-xl text-center">
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          Heb je een winkel?
        </h3>
        <p className="text-gray-600 mb-4">
          Meld je winkel gratis aan en bereik duizenden potentiële klanten
        </p>
        <Link href="/aanmelden" className="btn-primary">
          Winkel aanmelden
        </Link>
      </div>
    </div>
  )
}
