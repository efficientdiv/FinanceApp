
import { redirect } from 'next/navigation'
import { TopNav } from '@/components/nav/TopNav'
import { Card } from '@/components/ui/Card'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { requireUserId, getSpendingByCategory } from '@/lib/data'
import { prisma } from '@/lib/prisma'
import { centsToDollars } from '@/lib/utils'
import { Money } from '@/components/ui/Money'

const SPENDING_COLORS: Record<string, string> = {
  Housing: '#ece9e1',
  'Food & Dining': '#a8a59c',
  Transportation: '#7a786f',
  Shopping: '#3fb27f',
  Entertainment: '#5a584f',
  Utilities: '#403e36',
  Healthcare: '#2b2925',
}

export default async function BudgetsPage() {
  let userId: string
  try {
    userId = await requireUserId()
  } catch {
    redirect('/login')
  }

  const [spending, categories] = await Promise.all([
    getSpendingByCategory(userId),
    prisma.category.findMany({ where: { userId } }),
  ])

  const categoryMap = new Map(categories.map((c) => [c.name, c]))

  return (
    <div className="min-h-screen bg-ink-950 grain">
      <TopNav />
      <main className="max-w-[1480px] mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 space-y-6">
        <div>
          <div className="text-[11px] font-medium tracking-[0.18em] uppercase text-white/40 mb-1.5">
            Budgets
          </div>
          <h1 className="font-serif text-bone text-[36px] leading-none italic">
            Spending vs. budget.
          </h1>
        </div>

        <Card className="p-6">
          <SectionHeader eyebrow="This month" title="Category breakdown" />
          <div className="space-y-4">
            {spending.map((s) => {
              const cat = categoryMap.get(s.name)
              const budget = cat?.budgetMonthlyCents ? centsToDollars(cat.budgetMonthlyCents) : null
              const pct = budget ? Math.min((s.value / budget) * 100, 100) : null
              const color = SPENDING_COLORS[s.name] ?? '#6b6b76'
              return (
                <div key={s.name}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full" style={{ background: color }} />
                      <span className="text-[13px] text-bone">{s.name}</span>
                    </div>
                    <div className="flex items-center gap-3 text-[12px]">
                      <span className="text-bone tnum"><Money value={s.value} opts={{ maximumFractionDigits: 0 }} /></span>
                      {budget && (
                        <span className="text-white/40 tnum">
                          / <Money value={budget} opts={{ maximumFractionDigits: 0 }} />
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                    {pct !== null ? (
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${pct}%`,
                          background: pct >= 90 ? '#e26464' : color,
                        }}
                      />
                    ) : (
                      <div className="h-full rounded-full bg-white/[0.15]" style={{ width: '100%' }} />
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </Card>
      </main>
    </div>
  )
}
