'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [categoriesOpen, setCategoriesOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Sluit dropdown bij klik erbuiten
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setCategoriesOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const closeDropdown = () => setCategoriesOpen(false)

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
            <div
              className="relative"
              ref={dropdownRef}
              onMouseLeave={closeDropdown}
            >
              <button 
                onClick={() => setCategoriesOpen(!categoriesOpen)}
                onMouseEnter={() => setCategoriesOpen(true)}
                className="text-gray-600 hover:text-accent transition-colors flex items-center gap-1"
              >
                Categorieën
                <svg className={`w-4 h-4 transition-transform ${categoriesOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {categoriesOpen && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border py-2 z-50">
                  <Link href="/hijab-shops/nederland" onClick={closeDropdown} className="block px-4 py-2 text-gray-600 hover:bg-gray-50 hover:text-accent">
                    Hijab Shops
                  </Link>
                  <Link href="/abaya-shops/nederland" onClick={closeDropdown} className="block px-4 py-2 text-gray-600 hover:bg-gray-50 hover:text-accent">
                    Abaya Winkels
                  </Link>
                  <Link href="/modest-fashion/nederland" onClick={closeDropdown} className="block px-4 py-2 text-gray-600 hover:bg-gray-50 hover:text-accent">
                    Modest Fashion
                  </Link>
                  <Link href="/islamitische-kleding/nederland" onClick={closeDropdown} className="block px-4 py-2 text-gray-600 hover:bg-gray-50 hover:text-accent">
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
            aria-label="Menu"
          >
            {mobileMenuOpen ? (
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
        {mobileMenuOpen && (
          <nav className="md:hidden py-4 border-t border-gray-100">
            <div className="flex flex-col gap-4">
              <Link href="/shops" className="text-gray-600 hover:text-accent transition-colors py-2" onClick={() => setMobileMenuOpen(false)}>
                Alle Winkels
              </Link>
              <Link href="/hijab-shops/nederland" className="text-gray-600 hover:text-accent transition-colors py-2" onClick={() => setMobileMenuOpen(false)}>
                Hijab Shops
              </Link>
              <Link href="/abaya-shops/nederland" className="text-gray-600 hover:text-accent transition-colors py-2" onClick={() => setMobileMenuOpen(false)}>
                Abaya Winkels
              </Link>
              <Link href="/blog" className="text-gray-600 hover:text-accent transition-colors py-2" onClick={() => setMobileMenuOpen(false)}>
                Blog
              </Link>
              <Link href="/aanmelden" className="text-gray-600 hover:text-accent transition-colors py-2" onClick={() => setMobileMenuOpen(false)}>
                Winkel Aanmelden
              </Link>
              <Link href="/shops" className="btn-primary text-sm text-center" onClick={() => setMobileMenuOpen(false)}>
                Zoek een winkel
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}
