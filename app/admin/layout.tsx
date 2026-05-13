import { redirect } from 'next/navigation'
import Link from 'next/link'
import { isAdmin } from '@/lib/auth'
import SettingsDropdown from './SettingsDropdown'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const admin = await isAdmin()
  
  if (!admin) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Admin header */}
      <header className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-8">
              <Link href="/admin" className="font-bold text-lg">
                Admin Panel
              </Link>
              <nav className="hidden md:flex gap-6">
                <Link href="/admin" className="text-gray-300 hover:text-white transition-colors">
                  Dashboard
                </Link>
                <Link href="/admin/shops" className="text-gray-300 hover:text-white transition-colors">
                  Winkels
                </Link>
                <Link href="/admin/reviews" className="text-gray-300 hover:text-white transition-colors">
                  Reviews
                </Link>
                <Link href="/admin/blog" className="text-gray-300 hover:text-white transition-colors">
                  Blog
                </Link>
                <Link href="/admin/dictionary" className="text-gray-300 hover:text-white transition-colors">
                  Woordenboek
                </Link>
                <Link href="/admin/sponsors" className="text-gray-300 hover:text-white transition-colors">
                  Sponsors
                </Link>
                <Link href="/admin/ads" className="text-gray-300 hover:text-white transition-colors">
                  Advertenties
                </Link>
                <Link href="/admin/owners" className="text-gray-300 hover:text-white transition-colors">
                  Accounts
                </Link>
                <SettingsDropdown />
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/" className="text-gray-400 hover:text-white text-sm">
                ← Site
              </Link>
              <form action="/api/admin/logout" method="POST">
                <button className="text-gray-400 hover:text-white text-sm">
                  Uitloggen
                </button>
              </form>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile navigation */}
      <nav className="md:hidden bg-gray-800 px-4 py-2 flex gap-4 overflow-x-auto text-sm">
        <Link href="/admin" className="text-gray-300 hover:text-white whitespace-nowrap">Dashboard</Link>
        <Link href="/admin/shops" className="text-gray-300 hover:text-white whitespace-nowrap">Winkels</Link>
        <Link href="/admin/reviews" className="text-gray-300 hover:text-white whitespace-nowrap">Reviews</Link>
        <Link href="/admin/blog" className="text-gray-300 hover:text-white whitespace-nowrap">Blog</Link>
        <Link href="/admin/dictionary" className="text-gray-300 hover:text-white whitespace-nowrap">Woordenboek</Link>
        <Link href="/admin/sponsors" className="text-gray-300 hover:text-white whitespace-nowrap">Sponsors</Link>
        <Link href="/admin/ads" className="text-gray-300 hover:text-white whitespace-nowrap">Advertenties</Link>
        <Link href="/admin/owners" className="text-gray-300 hover:text-white whitespace-nowrap">Accounts</Link>
        <Link href="/admin/settings" className="text-gray-300 hover:text-white whitespace-nowrap">Huisstijl</Link>
        <Link href="/admin/password" className="text-gray-300 hover:text-white whitespace-nowrap">Wachtwoord</Link>
        <Link href="/admin/login-gegevens" className="text-gray-300 hover:text-white whitespace-nowrap">Inloggegevens</Link>
      </nav>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  )
}
