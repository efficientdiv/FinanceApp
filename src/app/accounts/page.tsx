
import { TopNav } from '@/components/nav/TopNav'
import { Card } from '@/components/ui/Card'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Icons } from '@/components/ui/Icons'
import { requireUserId, getAccounts } from '@/lib/data'
import { centsToDollars } from '@/lib/utils'
import { Money } from '@/components/ui/Money'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export default async function AccountsPage() {
  let userId: string
  try {
    userId = await requireUserId()
  } catch {
    redirect('/login')
  }

  const accounts = await getAccounts(userId)

  const totalCents = accounts.reduce((s, a) => s + a.balanceCents, 0)

  return (
    <div className="min-h-screen bg-ink-950 grain">
      <TopNav />
      <main className="max-w-[1480px] mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 space-y-6">
        <div>
          <div className="text-[11px] font-medium tracking-[0.18em] uppercase text-white/40 mb-1.5">
            Accounts
          </div>
          <h1 className="font-serif text-bone text-[36px] leading-none italic">
            Your accounts.
          </h1>
          <p className="text-[13px] text-white/45 mt-2.5">
            Total across all accounts:{' '}
            <span className="text-bone font-medium"><Money value={centsToDollars(totalCents)} /></span>
          </p>
        </div>

        <Card className="overflow-hidden">
          <div className="p-6">
            <SectionHeader
              eyebrow="Linked institutions"
              title="All accounts"
              action={
                <button className="h-8 px-3 rounded-lg bg-white/[0.03] ring-1 ring-white/[0.06] text-white/55 hover:text-bone flex items-center gap-1.5 text-[12px] font-medium">
                  {Icons.plus} Add account
                </button>
              }
            />
            <div className="space-y-2">
              {accounts.map((account) => (
                <Link
                  key={account.id}
                  href={`/accounts/${account.id}`}
                  className="hover-row flex items-center justify-between p-4 rounded-xl transition"
                >
                  <div>
                    <div className="flex items-center gap-2.5">
                      <span className="text-[14px] font-medium text-bone">{account.name}</span>
                      {account.apy && (
                        <span className="text-[10px] tnum px-1.5 py-0.5 rounded bg-gain/10 text-gain border border-gain/20">
                          {account.apy} APY
                        </span>
                      )}
                    </div>
                    <div className="text-[11.5px] text-white/40 mt-0.5">
                      {account.institution} · ••{account.mask}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-serif text-bone text-[22px] tnum">
                      <Money value={centsToDollars(account.balanceCents)} />
                    </div>
                    <div className="text-[10.5px] text-white/40 uppercase tracking-[0.1em] mt-0.5">
                      {account.kind}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </Card>
      </main>
    </div>
  )
}
