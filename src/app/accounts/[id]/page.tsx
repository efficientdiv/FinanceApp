import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { TopNav } from '@/components/nav/TopNav'
import { Card } from '@/components/ui/Card'
import { Icons } from '@/components/ui/Icons'
import { requireUserId } from '@/lib/data'
import { prisma } from '@/lib/prisma'
import { centsToDollars, fmtDate } from '@/lib/utils'
import { Money } from '@/components/ui/Money'

// Don't prerender any account detail pages — they require auth

interface Params {
  params: Promise<{ id: string }>
}

export default async function AccountDetailPage({ params }: Params) {
  const { id } = await params

  let userId: string
  try {
    userId = await requireUserId()
  } catch {
    redirect('/login')
  }

  const [account, transactions] = await Promise.all([
    prisma.account.findUnique({ where: { id, userId } }),
    prisma.transaction.findMany({
      where: { accountId: id, userId },
      orderBy: { date: 'desc' },
      take: 20,
    }),
  ])

  if (!account) notFound()

  return (
    <div className="min-h-screen bg-ink-950 grain">
      <TopNav />
      <main className="max-w-[1480px] mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 space-y-6">
        <div className="flex items-center gap-3">
          <Link href="/accounts" className="text-white/40 hover:text-bone transition">
            {Icons.arrowLeft}
          </Link>
          <div>
            <div className="text-[11px] font-medium tracking-[0.18em] uppercase text-white/40">
              {account.institution}
            </div>
            <h1 className="font-serif text-bone text-[32px] leading-none italic">
              {account.name}
            </h1>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-5">
            <div className="text-[11px] font-medium tracking-[0.14em] uppercase text-white/45 mb-2">
              Balance
            </div>
            <div className="font-serif text-bone text-[32px] tnum leading-none">
              <Money value={centsToDollars(account.balanceCents)} />
            </div>
          </Card>
          <Card className="p-5">
            <div className="text-[11px] font-medium tracking-[0.14em] uppercase text-white/45 mb-2">
              Account number
            </div>
            <div className="text-bone text-[20px] font-mono tnum">••••{account.mask}</div>
          </Card>
          <Card className="p-5">
            <div className="text-[11px] font-medium tracking-[0.14em] uppercase text-white/45 mb-2">
              Type
            </div>
            <div className="text-bone text-[20px] font-semibold">{account.kind}</div>
            {account.apy && (
              <div className="mt-1 text-[12px] text-gain">{account.apy} APY</div>
            )}
          </Card>
        </div>

        <Card className="p-6">
          <h3 className="text-[15px] font-semibold text-bone mb-4">Recent transactions</h3>
          {transactions.length === 0 ? (
            <p className="text-[13px] text-white/40 text-center py-6">No transactions yet.</p>
          ) : (
            <div className="divide-y divide-white/[0.04]">
              {transactions.map((tx) => (
                <div
                  key={tx.id}
                  className="hover-row flex items-center justify-between py-3 px-2 -mx-2 rounded-lg"
                >
                  <div>
                    <div className="text-[13.5px] font-medium text-bone">{tx.merchant}</div>
                    <div className="text-[11.5px] text-white/40 mt-0.5">
                      {tx.category} · {fmtDate(tx.date.toISOString(), { month: 'short', day: 'numeric' })}
                    </div>
                  </div>
                  <div className={`text-[13.5px] font-medium tnum ${tx.amountCents > 0 ? 'text-gain' : 'text-bone'}`}>
                    {tx.amountCents > 0 ? '+' : ''}
                    <Money value={centsToDollars(tx.amountCents)} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </main>
    </div>
  )
}
