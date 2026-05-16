'use client'

import Link from 'next/link'
import { Card } from '@/components/ui/Card'
import { ACCOUNTS } from '@/lib/mock-data'
import { Icons } from '@/components/ui/Icons'
import { useCurrency } from '@/components/providers/CurrencyProvider'

export function AccountsStrip() {
  const { fmt } = useCurrency()
  return (
    <Card className="p-2.5">
      <div className="grid grid-cols-2 lg:grid-cols-4">
        {ACCOUNTS.map((a, i) => (
          <Link
            key={a.id}
            href={`/accounts/${a.id}`}
            className={[
              'p-4 hover:bg-white/[0.015] transition rounded-lg',
              i < 3 ? 'lg:border-r' : '',
              i % 2 === 0 ? 'border-r lg:border-r' : '',
              i < 2 ? 'border-b lg:border-b-0' : '',
              'border-white/[0.05]',
            ].join(' ')}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10.5px] font-medium tracking-[0.14em] uppercase text-white/45">
                {a.bank}
              </span>
              {a.apy && (
                <span className="text-[10px] tnum px-1.5 py-0.5 rounded bg-gain/10 text-gain border border-gain/20">
                  {a.apy} APY
                </span>
              )}
            </div>
            <div className="text-[12.5px] text-white/70">{a.name}</div>
            <div className="flex items-baseline gap-1.5 mt-1.5">
              <span className="font-serif text-bone text-[22px] tnum leading-none">
                {fmt(a.bal, { maximumFractionDigits: 0 })}
              </span>
              <span className="text-[10.5px] text-white/35 tnum">{a.num}</span>
            </div>
          </Link>
        ))}
        {/* Add account CTA */}
        <button className="hidden lg:flex items-center gap-2 p-4 text-white/30 hover:text-white/60 transition text-[12px]">
          {Icons.plus} Add account
        </button>
      </div>
    </Card>
  )
}
