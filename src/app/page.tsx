import Link from 'next/link'
import { TopNav } from '@/components/nav/TopNav'
import { HeroSummary } from '@/components/dashboard/HeroSummary'
import { MetricRow } from '@/components/dashboard/MetricRow'
import { AccountsStrip } from '@/components/dashboard/AccountsStrip'
import { Transactions } from '@/components/dashboard/Transactions'
import { SpendingDonut } from '@/components/dashboard/SpendingDonut'
import { Watchlist } from '@/components/dashboard/Watchlist'
import { InsightsCard } from '@/components/dashboard/InsightsCard'
import { DashboardActions } from '@/components/dashboard/DashboardActions'
import { METRICS } from '@/lib/mock-data'
import { fmtPct } from '@/lib/utils'

function getGreeting(hour: number) {
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

export default async function DashboardPage() {
  const firstName = 'Eleanor'
  const now = new Date()
  const greeting = getGreeting(now.getHours())
  const dateStr = now.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

  return (
    <div className="min-h-screen bg-ink-950 grain">
      <TopNav />

      <main className="max-w-[1480px] mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 space-y-6">
        {/* Page header */}
        <div className="flex items-end justify-between flex-wrap gap-4 animate-enter">
          <div>
            <div className="text-[11px] font-medium tracking-[0.18em] uppercase text-white/40 mb-1.5">
              {dateStr}
            </div>
            <h1 className="font-serif text-bone text-[28px] sm:text-[36px] leading-none italic">
              {greeting}, {firstName}.
            </h1>
            <p className="text-[13px] text-white/45 mt-2.5">
              Your portfolio is up{' '}
              <span className="text-gain">{fmtPct(METRICS.monthPct)}</span> this month. Three
              holdings hit new highs today.
            </p>
          </div>
          <DashboardActions />
        </div>

        {/* Hero chart */}
        <div className="animate-enter delay-1">
          <HeroSummary />
        </div>

        {/* Metric row */}
        <div className="animate-enter delay-2">
          <MetricRow />
        </div>

        {/* Accounts strip */}
        <div className="animate-enter delay-3">
          <AccountsStrip />
        </div>

        {/* Mid grid: transactions + donut */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-enter delay-4">
          <div className="lg:col-span-2">
            <Transactions />
          </div>
          <div>
            <SpendingDonut />
          </div>
        </div>

        {/* Bottom: insights + watchlist */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-enter delay-5">
          <div className="lg:col-span-2">
            <InsightsCard />
          </div>
          <div>
            <Watchlist />
          </div>
        </div>

        {/* Footer */}
        <footer className="pt-8 pb-12 flex items-center justify-between text-[11px] text-white/30 border-t border-white/[0.05] mt-6 animate-enter delay-6">
          <div className="flex items-center gap-4">
            <span>© 2026 Vaultr, Inc.</span>
            <a href="#" className="hover:text-white/60 transition">Disclosures</a>
            <a href="#" className="hover:text-white/60 transition">Privacy</a>
            <a href="#" className="hover:text-white/60 transition">Help</a>
          </div>
          <div className="flex items-center gap-2">
            <span className="pulse-dot" />
            <span>All accounts synced · 2 min ago</span>
          </div>
        </footer>
      </main>
    </div>
  )
}
