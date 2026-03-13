'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold text-accent">Modest</span>
            <span className="text-2xl font-light text-gray-600">Directory</span>
          </Link>
          
          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/shops" className="text-gray-600 hover:text-accent transition-colors">
              Alle Winkels
            </Link>
            <Link href="/aanmelden" className="text-gray-600 hover:text-accent transition-colors">
              Winkel Aanmelden
            </Link>
            <Link href="/shops" className="btn-primary text-sm">
              Zoek een winkel
            </Link>
          </nav>
          
          {/* Mobile menu button */}
          <button 
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Menu"
          >
            {isMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <nav className="md:hidden py-4 border-t border-gray-100">
            <div className="flex flex-col gap-4">
              <Link 
                href="/shops" 
                className="text-gray-600 hover:text-accent transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Alle Winkels
              </Link>
              <Link 
                href="/aanmelden" 
                className="text-gray-600 hover:text-accent transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Winkel Aanmelden
              </Link>
              <Link 
                href="/shops" 
                className="btn-primary text-sm text-center"
                onClick={() => setIsMenuOpen(false)}
              >
                Zoek een winkel
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}