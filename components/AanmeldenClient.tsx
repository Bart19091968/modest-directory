'use client'

import { useRef, useState } from 'react'
import Link from 'next/link'
import ShopRegistrationForm from '@/components/ShopRegistrationForm'


const PLANS = [
  {
    tier: 'BRONZE',
    label: 'Brons',
    price: 50,
    borderColor: 'border-amber-500',
    badge: null,
    features: [
      'Winkelnaam',
      'Logo',
      'Categorieën',
      'Email',
      'Korte beschrijving',
      'Lange beschrijving',
      'Adres',
      'Website URL',
      'Telefoonnummer',
    ],
  },
  {
    tier: 'SILVER',
    label: 'Zilver',
    price: 75,
    borderColor: 'border-gray-400',
    badge: 'Meest gekozen',
    features: [
      'Winkelnaam',
      'Logo',
      'Categorieën',
      'Email',
      'Korte beschrijving',
      'Adres',
      'Website URL',
      'Telefoonnummer',
      'Extra vermelding op homepage',
      'Lange beschrijving',
      'Tot 3 foto\'s',
    ],
  },
  {
    tier: 'GOLD',
    label: 'Goud',
    price: 100,
    borderColor: 'border-yellow-500',
    badge: null,
    features: [
      'Winkelnaam',
      'Logo',
      'Categorieën',
      'Email',
      'Korte beschrijving',
      'Adres',
      'Website URL',
      'Telefoonnummer',
      'Extra vermelding op homepage',
      'Lange beschrijving',
      'Tot 5 foto\'s',
      'Openingsuren',
      'Social media links',
      '"Trusted Partner" badge',
    ],
  },
]

export default function AanmeldenClient() {
  const [selectedTier, setSelectedTier] = useState<string | null>(null)
  const formRef = useRef<HTMLDivElement>(null)

  const handleSelectTier = (tier: string) => {
    setSelectedTier(tier)
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 100)
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Winkel Aanmelden
        </h1>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Kies je formule en bereik duizenden bezoekers per maand
        </p>
        <div className="mt-6">
          <Link
            href="/gratis-aanmelden"
            className="inline-block border-2 border-accent text-accent px-6 py-3 rounded-lg font-semibold hover:bg-accent hover:text-white transition-colors"
          >
            Liever gratis aanmelden?
          </Link>
        </div>
      </div>

      {/* Pricing cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {PLANS.map((plan) => (
          <div
            key={plan.tier}
            className={`bg-white rounded-xl shadow-sm border border-gray-200 border-t-4 ${plan.borderColor} overflow-hidden flex flex-col relative`}
          >
            {plan.badge && (
              <div className="absolute top-4 right-4">
                <span className="bg-accent text-white text-xs font-semibold px-3 py-1 rounded-full">
                  {plan.badge}
                </span>
              </div>
            )}

            <div className="p-6 flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-1">{plan.label}</h2>
              <p className="text-gray-500 text-sm mb-6">€{plan.price} voor 3 maanden</p>

              <p className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
                Inbegrepen:
              </p>
              <ul className="space-y-2 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm text-gray-600">
                    <span className="text-accent font-bold mt-0.5 flex-shrink-0">✓</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-6 pt-0">
              <button
                onClick={() => handleSelectTier(plan.tier)}
                className="btn-primary w-full"
              >
                Aanmelden voor €{plan.price}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Registration form */}
      {selectedTier && (
        <div ref={formRef} className="scroll-mt-8">
          <div className="bg-white rounded-xl shadow-sm border p-8">
            <ShopRegistrationForm tier={selectedTier} />
          </div>
        </div>
      )}

      {/* Contact info */}
      <div className="mt-12 text-center text-sm text-gray-500">
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
