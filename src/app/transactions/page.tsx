
import { redirect } from 'next/navigation'
import { TopNav } from '@/components/nav/TopNav'
import { Transactions } from '@/components/dashboard/Transactions'
import { requireUserId, getTransactions } from '@/lib/data'
import { centsToDollars } from '@/lib/utils'
import type { TxFilters } from '@/lib/data'

const VALID_TABS = ['All', 'Income', 'Spending', 'Pending'] as const
type TabType = (typeof VALID_TABS)[number]

export default async function TransactionsPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string; category?: string }>
}) {
  let userId: string
  try {
    userId = await requireUserId()
  } catch {
    redirect('/login')
  }

  const { tab: rawTab, category } = await searchParams
  const tab = (VALID_TABS.includes(rawTab as TabType) ? rawTab : 'All') as TxFilters['tab']
  const dbTxs = await getTransactions(userId, {
    tab,
    category,
    limit: 50,
  })

  const txs = dbTxs.map((t, i) => ({
    id: i + 1,
    merchant: t.merchant,
    cat: t.category,
    icon: t.iconKey,
    amount: centsToDollars(t.amountCents),
    date: t.date.toISOString().slice(0, 10),
    method: t.method,
    status: t.status === 'PENDING' ? ('pending' as const) : ('posted' as const),
  }))

  return (
    <div className="min-h-screen bg-ink-950 grain">
      <TopNav />
      <main className="max-w-[1480px] mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 space-y-6">
        <div>
          <div className="text-[11px] font-medium tracking-[0.18em] uppercase text-white/40 mb-1.5">
            Activity
          </div>
          <h1 className="font-serif text-bone text-[36px] leading-none italic">All transactions.</h1>
        </div>
        <Transactions transactions={txs} />
      </main>
    </div>
  )
}
