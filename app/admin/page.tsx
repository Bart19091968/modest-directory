import prisma from '@/lib/db'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

async function getStats() {
  const now = new Date()
  const thirtyDaysAgo = new Date(now)
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
  const sevenDaysAgo = new Date(now)
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

  const [
    shopCount,
    pendingShops,
    reviewCount,
    pendingReviews,
    blogCount,
    totalHumanViews,
    totalBotViews,
    uniqueHumanVisitors,
    dailyViews,
  ] = await Promise.all([
    prisma.shop.count({ where: { status: 'APPROVED' } }),
    prisma.shop.count({ where: { status: 'PENDING' } }),
    prisma.review.count({ where: { isVerified: true } }),
    prisma.review.count({ where: { isVerified: false } }),
    prisma.blogPost.count({ where: { isPublished: true } }),
    // Human page views (last 30 days)
    prisma.pageView.count({
      where: { isBot: false, createdAt: { gte: thirtyDaysAgo } },
    }),
    // Bot visits (last 30 days)
    prisma.pageView.count({
      where: { isBot: true, createdAt: { gte: thirtyDaysAgo } },
    }),
    // Unique human visitors (distinct visitorId, last 30 days)
    prisma.pageView.groupBy({
      by: ['visitorId'],
      where: { isBot: false, createdAt: { gte: thirtyDaysAgo } },
    }).then(r => r.length),
    // Last 7 days: human + bot per day
    prisma.pageView.findMany({
      where: { createdAt: { gte: sevenDaysAgo } },
      select: { createdAt: true, isBot: true },
      orderBy: { createdAt: 'asc' },
    }),
  ])

  // Aggregate daily data
  const dayMap: Record<string, { human: number; bot: number }> = {}
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now)
    d.setDate(d.getDate() - i)
    const key = d.toISOString().slice(0, 10)
    dayMap[key] = { human: 0, bot: 0 }
  }
  for (const view of dailyViews) {
    const key = view.createdAt.toISOString().slice(0, 10)
    if (dayMap[key]) {
      if (view.isBot) dayMap[key].bot++
      else dayMap[key].human++
    }
  }
  const chartData = Object.entries(dayMap).map(([date, counts]) => ({
    date,
    label: new Date(date).toLocaleDateString('nl-NL', { weekday: 'short', day: 'numeric', month: 'short' }),
    ...counts,
  }))

  // Top bot names (last 30 days)
  const topBots = await prisma.pageView.groupBy({
    by: ['botName'],
    where: { isBot: true, botName: { not: null }, createdAt: { gte: thirtyDaysAgo } },
    _count: { botName: true },
    orderBy: { _count: { botName: 'desc' } },
    take: 5,
  })

  return {
    shopCount, pendingShops, reviewCount, pendingReviews, blogCount,
    totalHumanViews, totalBotViews, uniqueHumanVisitors,
    chartData, topBots,
  }
}

function BarChart({ data }: { data: { label: string; human: number; bot: number }[] }) {
  const maxVal = Math.max(...data.map(d => d.human + d.bot), 1)

  return (
    <div className="mt-4">
      <div className="flex items-end gap-2 h-40">
        {data.map(d => {
          const totalHeight = ((d.human + d.bot) / maxVal) * 100
          const humanPct = d.human + d.bot > 0 ? (d.human / (d.human + d.bot)) * totalHeight : 0
          const botPct = totalHeight - humanPct
          return (
            <div key={d.label} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full flex flex-col justify-end" style={{ height: '120px' }}>
                <div
                  title={`Crawlers: ${d.bot}`}
                  className="w-full bg-orange-300 rounded-t-sm"
                  style={{ height: `${botPct}%` }}
                />
                <div
                  title={`Bezoekers: ${d.human}`}
                  className="w-full bg-accent rounded-t-sm"
                  style={{ height: `${humanPct}%` }}
                />
              </div>
              <span className="text-[10px] text-gray-400 text-center leading-tight">{d.label}</span>
            </div>
          )
        })}
      </div>
      <div className="flex items-center gap-4 mt-3">
        <span className="flex items-center gap-1.5 text-xs text-gray-500">
          <span className="w-3 h-3 rounded-sm bg-accent inline-block" /> Bezoekers
        </span>
        <span className="flex items-center gap-1.5 text-xs text-gray-500">
          <span className="w-3 h-3 rounded-sm bg-orange-300 inline-block" /> Crawlers
        </span>
      </div>
    </div>
  )
}

export default async function AdminDashboard() {
  const stats = await getStats()

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Dashboard</h1>

      {/* Site statistieken */}
      <h2 className="text-lg font-semibold text-gray-700 mb-4">Websitebezoeken (laatste 30 dagen)</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-accent">
          <p className="text-gray-500 text-sm mb-1">Paginaweergaven</p>
          <p className="text-3xl font-bold text-gray-900">{stats.totalHumanViews.toLocaleString('nl-NL')}</p>
          <p className="text-xs text-gray-400 mt-1">Menselijke bezoekers</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-blue-400">
          <p className="text-gray-500 text-sm mb-1">Unieke bezoekers</p>
          <p className="text-3xl font-bold text-gray-900">{stats.uniqueHumanVisitors.toLocaleString('nl-NL')}</p>
          <p className="text-xs text-gray-400 mt-1">Op basis van dagelijks gehashte IP</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-orange-400">
          <p className="text-gray-500 text-sm mb-1">Crawlerbezoeken</p>
          <p className="text-3xl font-bold text-gray-900">{stats.totalBotViews.toLocaleString('nl-NL')}</p>
          <p className="text-xs text-gray-400 mt-1">Zoekmachines & bots</p>
        </div>
      </div>

      {/* Grafiek + top bots */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-base font-semibold text-gray-900">Bezoeken laatste 7 dagen</h2>
          <BarChart data={stats.chartData} />
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-base font-semibold text-gray-900 mb-4">Top crawlers (30 dagen)</h2>
          {stats.topBots.length === 0 ? (
            <p className="text-sm text-gray-400">Nog geen data</p>
          ) : (
            <ul className="space-y-2">
              {stats.topBots.map(bot => (
                <li key={bot.botName} className="flex items-center justify-between text-sm">
                  <span className="text-gray-700">{bot.botName}</span>
                  <span className="font-medium text-gray-900">{bot._count.botName.toLocaleString('nl-NL')}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Winkel/content statistieken */}
      <h2 className="text-lg font-semibold text-gray-700 mb-4">Content</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <p className="text-gray-500 text-sm">Goedgekeurde winkels</p>
          <p className="text-3xl font-bold text-gray-900">{stats.shopCount}</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <p className="text-gray-500 text-sm">Wachtende winkels</p>
          <p className="text-3xl font-bold text-yellow-600">{stats.pendingShops}</p>
          {stats.pendingShops > 0 && (
            <Link href="/admin/shops?status=PENDING" className="text-sm text-accent hover:underline">
              Bekijken →
            </Link>
          )}
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <p className="text-gray-500 text-sm">Geverifieerde reviews</p>
          <p className="text-3xl font-bold text-gray-900">{stats.reviewCount}</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <p className="text-gray-500 text-sm">Blog artikelen</p>
          <p className="text-3xl font-bold text-gray-900">{stats.blogCount}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Snelle acties</h2>
          <div className="space-y-3">
            <Link href="/admin/shops?status=PENDING" className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
              📋 Winkels beoordelen
            </Link>
            <Link href="/admin/blog/new" className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
              ✏️ Nieuw blog artikel
            </Link>
            <Link href="/admin/shops/import" className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
              📁 Winkels importeren (CSV)
            </Link>
            <Link href="/admin/ads" className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
              💰 Advertenties beheren
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">SEO Pagina&apos;s</h2>
          <p className="text-sm text-gray-600 mb-4">
            Je site genereert automatisch SEO pagina&apos;s voor:
          </p>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>✓ Hijab shops per stad en land</li>
            <li>✓ Abaya winkels per stad en land</li>
            <li>✓ Modest fashion per stad en land</li>
            <li>✓ Islamitische kleding per stad en land</li>
            <li>✓ Blog artikelen met schema markup</li>
            <li>✓ FAQ pagina met structured data</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
