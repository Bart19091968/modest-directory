import { redirect } from 'next/navigation'
import Link from 'next/link'
import prisma from '@/lib/db'
import { getOwnerId } from '@/lib/ownerAuth'
import LogoutButton from './LogoutButton'

export const dynamic = 'force-dynamic'

const STATUS_LABELS: Record<string, string> = {
  PENDING: 'In behandeling',
  APPROVED: 'Goedgekeurd',
  REJECTED: 'Afgewezen',
}

const STATUS_COLORS: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  APPROVED: 'bg-green-100 text-green-800',
  REJECTED: 'bg-red-100 text-red-800',
}

export default async function MijnWinkelPage() {
  const ownerId = await getOwnerId()
  if (!ownerId) redirect('/mijn-winkel/login')

  const owner = await prisma.shopOwner.findUnique({
    where: { id: ownerId },
    include: {
      shops: {
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          slug: true,
          city: true,
          country: true,
          status: true,
          subscriptionTier: true,
          createdAt: true,
          logoUrl: true,
        },
      },
    },
  })

  if (!owner) redirect('/mijn-winkel/login')

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mijn winkels</h1>
          <p className="text-sm text-gray-500 mt-1">{owner.email}</p>
        </div>
        <LogoutButton />
      </div>

      {owner.shops.length === 0 ? (
        <div className="bg-white rounded-xl border p-8 text-center">
          <p className="text-gray-500 mb-4">Je hebt nog geen winkels gekoppeld aan dit account.</p>
          <Link href="/aanmelden" className="btn-primary inline-block">
            Winkel aanmelden
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {owner.shops.map(shop => (
            <div key={shop.id} className="bg-white rounded-xl border p-6 flex items-center gap-4">
              {shop.logoUrl ? (
                <img src={shop.logoUrl} alt={shop.name} className="w-14 h-14 rounded-lg object-cover border flex-shrink-0" />
              ) : (
                <div className="w-14 h-14 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0 text-2xl">
                  🏪
                </div>
              )}

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="font-semibold text-gray-900 truncate">{shop.name}</h2>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[shop.status]}`}>
                    {STATUS_LABELS[shop.status]}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-0.5">
                  {[shop.city, shop.country === 'BE' ? 'België' : 'Nederland'].filter(Boolean).join(', ')}
                  {shop.subscriptionTier && (
                    <span className="ml-2 text-xs text-gray-400">· {shop.subscriptionTier.charAt(0) + shop.subscriptionTier.slice(1).toLowerCase()}</span>
                  )}
                </p>
              </div>

              <div className="flex items-center gap-3 flex-shrink-0">
                {shop.status === 'APPROVED' && (
                  <Link
                    href={`/shops/${shop.slug}`}
                    target="_blank"
                    className="text-sm text-accent hover:underline"
                  >
                    Bekijken
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <p className="text-sm text-gray-400 text-center mt-8">
        Wijzigingen aan je winkelgegevens? Neem contact op via{' '}
        <a href="mailto:info@modestdirectory.com" className="underline hover:text-gray-600">
          info@modestdirectory.com
        </a>
      </p>
    </div>
  )
}
