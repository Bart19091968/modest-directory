'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [categoriesOpen, setCategoriesOpen] = useState(false)

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold text-accent">Modest</span>
            <span className="text-2xl font-light text-gray-600">Directory</span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/shops" className="text-gray-600 hover:text-accent transition-colors">
              Alle Winkels
            </Link>
            
            {/* Categories dropdown */}
            <div className="relative">
              <button 
                onClick={() => setCategoriesOpen(!categoriesOpen)}
                className="text-gray-600 hover:text-accent transition-colors flex items-center gap-1"
              >
                Categorieën
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {categoriesOpen && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border py-2 z-50">
                  <Link href="/hijab-shops/nederland" className="block px-4 py-2 text-gray-600 hover:bg-gray-50 hover:text-accent">
                    Hijab Shops
                  </Link>
                  <Link href="/abaya-shops/nederland" className="block px-4 py-2 text-gray-600 hover:bg-gray-50 hover:text-accent">
                    Abaya Winkels
                  </Link>
                  <Link href="/modest-fashion/nederland" className="block px-4 py-2 text-gray-600 hover:bg-gray-50 hover:text-accent">
                    Modest Fashion
                  </Link>
                  <Link href="/islamitische-kleding/nederland" className="block px-4 py-2 text-gray-600 hover:bg-gray-50 hover:text-accent">
                    Islamitische Kleding
                  </Link>
                </div>
              )}
            </div>
            
            <Link href="/blog" className="text-gray-600 hover:text-accent transition-colors">
              Blog
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
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
        
        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t py-4 space-y-3">
            <Link href="/shops" className="block text-gray-600 hover:text-accent">
              Alle Winkels
            </Link>
            <Link href="/hijab-shops/nederland" className="block text-gray-600 hover:text-accent">
              Hijab Shops
            </Link>
            <Link href="/abaya-shops/nederland" className="block text-gray-600 hover:text-accent">
              Abaya Winkels
            </Link>
            <Link href="/blog" className="block text-gray-600 hover:text-accent">
              Blog
            </Link>
            <Link href="/aanmelden" className="block text-gray-600 hover:text-accent">
              Winkel Aanmelden
            </Link>
          </div>
        )}
      </div>
    </header>
  )
}
