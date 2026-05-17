
import { TopNav } from '@/components/nav/TopNav'
import { Card } from '@/components/ui/Card'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Watchlist } from '@/components/dashboard/Watchlist'
import { getDemoUserId } from '@/lib/data'
import { prisma } from '@/lib/prisma'
import { centsToDollars } from '@/lib/utils'
import { Money } from '@/components/ui/Money'

export default async function InvestmentsPage() {
  const userId = await getDemoUserId()

  const [holdings] = await Promise.all([
    prisma.holding.findMany({ where: { userId } }),
    prisma.watchlistItem.findMany({ where: { userId }, orderBy: { order: 'asc' } }),
  ])

  const totalCostBasis = holdings.reduce((s, h) => s + h.costBasisCents, 0)

  return (
    <div className="min-h-screen bg-ink-950 grain">
      <TopNav />
      <main className="max-w-[1480px] mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 space-y-6">
        <div>
          <div className="text-[11px] font-medium tracking-[0.18em] uppercase text-white/40 mb-1.5">
            Investments
          </div>
          <h1 className="font-serif text-bone text-[36px] leading-none italic">Your portfolio.</h1>
          <p className="text-[13px] text-white/45 mt-2.5">
            Cost basis:{' '}
            <span className="text-bone font-medium"><Money value={centsToDollars(totalCostBasis)} /></span>
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="p-6">
              <SectionHeader eyebrow="Brokerage" title="Holdings" />
              <div className="divide-y divide-white/[0.04]">
                {holdings.map((h) => (
                  <div key={h.id} className="hover-row flex items-center justify-between py-3 px-2 -mx-2 rounded-lg">
                    <div>
                      <div className="text-[14px] font-semibold text-bone">{h.symbol}</div>
                      <div className="text-[11.5px] text-white/40 mt-0.5 tnum">
                        {h.shares} shares
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[13.5px] font-medium text-bone tnum">
                        <Money value={centsToDollars(h.costBasisCents)} />
                      </div>
                      <div className="text-[11px] text-white/40">cost basis</div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
          <Watchlist />
        </div>
      </main>
    </div>
  )
}
