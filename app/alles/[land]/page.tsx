import prisma from '@/lib/db'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import ShopCard from '@/components/ShopCard'

export const dynamic = 'force-dynamic'

type Params = {
  land: string
}

async function getLocationData(landSlug: string) {
  // Check if it's a country
  const country = await prisma.country.findUnique({
    where: { slug: landSlug },
  })

  if (country) {
    const shops = await prisma.shop.findMany({
      where: {
        status: 'APPROVED',
        country: country.code,
      },
      orderBy: [
        { isFeatured: 'desc' },
        { subscriptionTier: 'asc' },
        { createdAt: 'desc' },
      ],
      select: {
        id: true,
        name: true,
        slug: true,
        shortDescription: true,
        city: true,
        country: true,
        isPhysicalStore: true,
        isWebshop: true,
        isFeatured: true,
        logoUrl: true,
        subscriptionTier: true,
        facebookUrl: true,
        instagramUrl: true,
        pinterestUrl: true,
        youtubeUrl: true,
        tiktokUrl: true,
        googlePlaceId: true,
        googleRating: true,
        googleReviewCount: true,
        reviews: { where: { isVerified: true }, select: { score: true } },
      },
    })

    const cities = await prisma.city.findMany({
      where: { countryId: country.id },
      orderBy: { name: 'asc' },
    })

    return { isCountry: true, location: country, shops, cities }
  }

  // Check if it's a city
  const city = await prisma.city.findUnique({
    where: { slug: landSlug },
    include: { country: true },
  })

  if (city) {
    const shops = await prisma.shop.findMany({
      where: {
        status: 'APPROVED',
        country: city.country.code,
        citySlug: landSlug,
      },
      orderBy: [
        { isFeatured: 'desc' },
        { subscriptionTier: 'asc' },
        { createdAt: 'desc' },
      ],
      select: {
        id: true,
        name: true,
        slug: true,
        shortDescription: true,
        city: true,
        country: true,
        isPhysicalStore: true,
        isWebshop: true,
        isFeatured: true,
        logoUrl: true,
        subscriptionTier: true,
        facebookUrl: true,
        instagramUrl: true,
        pinterestUrl: true,
        youtubeUrl: true,
        tiktokUrl: true,
        googlePlaceId: true,
        googleRating: true,
        googleReviewCount: true,
        reviews: { where: { isVerified: true }, select: { score: true } },
      },
    })

    return { isCountry: false, location: city, shops }
  }

  return null
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const data = await getLocationData(params.land)

  if (!data) {
    return { title: 'Niet gevonden' }
  }

  const title = `Alle Modest Fashion Winkels in ${data.location.name}`
  const description = `Vind alle hijab shops, abaya winkels en modest fashion aanbieders in ${data.location.name}.`

  return {
    title,
    description,
    alternates: {
      canonical: `/alles/${data.location.slug}`,
    },
    openGraph: {
      title,
      description,
      type: 'website',
    },
  }
}

export default async function LocationPage({ params }: { params: Params }) {
  const data = await getLocationData(params.land)

  if (!data) {
    notFound()
  }

  const { location, shops, isCountry } = data
  const countryCode = isCountry ? (location as any).code : (location as any).country.code
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <nav className="text-sm text-gray-600 mb-4">
            <Link href="/" className="hover:text-blue-600">Home</Link>
            <span className="mx-2">/</span>
            {!isCountry && (
              <>
                <Link href={`/alles/${(data as any).location.country.slug}`} className="hover:text-blue-600">
                  {(data as any).location.country.name}
                </Link>
                <span className="mx-2">/</span>
              </>
            )}
            <span>{location.name}</span>
          </nav>
          <h1 className="text-4xl font-bold text-gray-900">{location.name}</h1>
          <p className="text-lg text-gray-600 mt-2">{shops.length} winkels beschikbaar</p>
        </div>
      </div>

      {/* Location Description */}
      {isCountry && location.description && (
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="bg-white p-8 rounded-lg shadow mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Over Modest Fashion in {location.name}</h2>
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {location.description}
            </p>
          </div>
        </div>
      )}

      {/* Cities (only for countries) */}
      {isCountry && (data as any).cities && (data as any).cities.length > 0 && (
        <div className="max-w-6xl mx-auto px-4 py-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Steden in {location.name}</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {(data as any).cities.map((city: any) => (
              <Link
                key={city.id}
                href={`/alles/${city.slug}`}
                className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition text-center"
              >
                <p className="font-semibold text-gray-900">{city.name}</p>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Shops */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Alle Modest Fashion Winkels in {location.name}
        </h2>

        {shops.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow text-center text-gray-600">
            Geen winkels gevonden in {location.name}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {shops.map((shop) => (
              <ShopCard key={shop.id} shop={shop} />
            ))}
          </div>
        )}
      </div>

      {/* Blog Link */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="bg-blue-50 p-8 rounded-lg text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Blog - Modest Fashion Tips voor {location.name}
          </h2>
          <p className="text-gray-600 mb-6">
            Ontdek trends, styling tips en inspiratie
          </p>
          <Link href={`/blog/${location.slug}`} className="btn-primary">
            Lees ons blog
          </Link>
        </div>
      </div>
    </div>
  )
}
