'use client'

import { useState } from 'react'

interface FAQ {
  id: string
  question: string
  answer: string
}

export default function FAQSection({ faqs }: { faqs: FAQ[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  if (faqs.length === 0) return null

  return (
    <section className="py-8">
      
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Veelgestelde vragen</h2>
      
      <div className="space-y-3">
        {faqs.map((faq, index) => (
          <div key={faq.id} className="border rounded-lg overflow-hidden">
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              aria-expanded={openIndex === index}
              aria-controls={`faq-answer-${faq.id}`}
              className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50"
            >
              <span className="font-medium text-gray-900">{faq.question}</span>
              <span className="text-gray-500" aria-hidden="true">
                {openIndex === index ? '−' : '+'}
              </span>
            </button>

            {openIndex === index && (
              <div id={`faq-answer-${faq.id}`} className="px-6 py-4 bg-gray-50 border-t">
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
