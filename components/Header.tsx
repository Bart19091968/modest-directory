'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [landOpen, setLandOpen] = useState(false)
  const [categoriesOpen, setCategoriesOpen] = useState(false)
  const landRef = useRef<HTMLDivElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setCategoriesOpen(false)
      }
      if (landRef.current && !landRef.current.contains(e.target as Node)) {
        setLandOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const closeDropdown = () => setCategoriesOpen(false)
  const closeLand = () => setLandOpen(false)

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-bold text-accent">Modest</span><span className="text-2xl font-light text-gray-600">Directory</span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/shops" className="text-gray-600 hover:text-accent transition-colors">
              Alle Winkels
            </Link>
            
            {/* Land dropdown */}
            <div
              className="relative"
              ref={landRef}
              onMouseLeave={closeLand}
            >
              <button
                onClick={() => setLandOpen(!landOpen)}
                onMouseEnter={() => setLandOpen(true)}
                aria-expanded={landOpen}
                aria-controls="land-menu"
                aria-label="Land navigatie"
                className="text-gray-600 hover:text-accent transition-colors flex items-center gap-1 py-2"
              >
                Land
                <svg className={`w-4 h-4 transition-transform ${landOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {landOpen && (
                <div id="land-menu" className="absolute top-full left-0 pt-1 z-50" role="navigation" aria-label="Land links">
                  <div className="w-44 bg-white rounded-lg shadow-lg border py-2">
                    <Link href="/modest-fashion/belgie" onClick={closeLand} className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-accent">
                      🇧🇪 België
                    </Link>
                    <Link href="/modest-fashion/nederland" onClick={closeLand} className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-accent">
                      🇳🇱 Nederland
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Categories dropdown — no gap between trigger and panel */}
            <div
              className="relative"
              ref={dropdownRef}
              onMouseLeave={closeDropdown}
            >
              <button
                onClick={() => setCategoriesOpen(!categoriesOpen)}
                onMouseEnter={() => setCategoriesOpen(true)}
                aria-expanded={categoriesOpen}
                aria-controls="categories-menu"
                aria-label="Categorie navigatie"
                className="text-gray-600 hover:text-accent transition-colors flex items-center gap-1 py-2"
              >
                Categorie
                <svg className={`w-4 h-4 transition-transform ${categoriesOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {categoriesOpen && (
                <div id="categories-menu" className="absolute top-full left-0 pt-1 z-50" role="navigation" aria-label="Categorie links">
                  <div className="w-[420px] bg-white rounded-lg shadow-lg border py-4 px-4">
                    <div className="grid grid-cols-2 gap-4">
                      {/* België */}
                      <div>
                        <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2 px-2">🇧🇪 België</h4>
                        <Link href="/hijab-shops/belgie" onClick={closeDropdown} className="block px-2 py-1.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-accent rounded">
                          🧕 Hijab Shops
                        </Link>
                        <Link href="/abaya-shops/belgie" onClick={closeDropdown} className="block px-2 py-1.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-accent rounded">
                          👗 Abaya Winkels
                        </Link>
                        <Link href="/islamitische-kleding/belgie" onClick={closeDropdown} className="block px-2 py-1.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-accent rounded">
                          🌙 Islamitische Kleding
                        </Link>
                      </div>
                      {/* Nederland */}
                      <div>
                        <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2 px-2">🇳🇱 Nederland</h4>
                        <Link href="/hijab-shops/nederland" onClick={closeDropdown} className="block px-2 py-1.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-accent rounded">
                          🧕 Hijab Shops
                        </Link>
                        <Link href="/abaya-shops/nederland" onClick={closeDropdown} className="block px-2 py-1.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-accent rounded">
                          👗 Abaya Winkels
                        </Link>
                        <Link href="/islamitische-kleding/nederland" onClick={closeDropdown} className="block px-2 py-1.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-accent rounded">
                          🌙 Islamitische Kleding
                        </Link>
                      </div>
                    </div>
                  </div>
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
            <div className="flex flex-col gap-1">
              <Link href="/shops" className="text-gray-600 hover:text-accent transition-colors py-2" onClick={() => setMobileMenuOpen(false)}>
                Alle Winkels
              </Link>

              <div className="py-2">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Land</p>
                <Link href="/modest-fashion/belgie" className="block text-gray-600 hover:text-accent transition-colors py-1 pl-4 text-sm" onClick={() => setMobileMenuOpen(false)}>
                  🇧🇪 België
                </Link>
                <Link href="/modest-fashion/nederland" className="block text-gray-600 hover:text-accent transition-colors py-1 pl-4 text-sm" onClick={() => setMobileMenuOpen(false)}>
                  🇳🇱 Nederland
                </Link>
              </div>

              <div className="py-2">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">🇧🇪 België</p>
                <Link href="/hijab-shops/belgie" className="block text-gray-600 hover:text-accent transition-colors py-1 pl-4 text-sm" onClick={() => setMobileMenuOpen(false)}>
                  Hijab Shops
                </Link>
                <Link href="/abaya-shops/belgie" className="block text-gray-600 hover:text-accent transition-colors py-1 pl-4 text-sm" onClick={() => setMobileMenuOpen(false)}>
                  Abaya Winkels
                </Link>
              </div>

              <div className="py-2">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">🇳🇱 Nederland</p>
                <Link href="/hijab-shops/nederland" className="block text-gray-600 hover:text-accent transition-colors py-1 pl-4 text-sm" onClick={() => setMobileMenuOpen(false)}>
                  Hijab Shops
                </Link>
                <Link href="/abaya-shops/nederland" className="block text-gray-600 hover:text-accent transition-colors py-1 pl-4 text-sm" onClick={() => setMobileMenuOpen(false)}>
                  Abaya Winkels
                </Link>
              </div>

              <Link href="/blog" className="text-gray-600 hover:text-accent transition-colors py-2" onClick={() => setMobileMenuOpen(false)}>
                Blog
              </Link>
              <Link href="/aanmelden" className="text-gray-600 hover:text-accent transition-colors py-2" onClick={() => setMobileMenuOpen(false)}>
                Winkel Aanmelden
              </Link>
              <Link href="/shops" className="btn-primary text-sm text-center mt-2" onClick={() => setMobileMenuOpen(false)}>
                Zoek een winkel
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}
