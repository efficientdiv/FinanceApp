'use client'

import { Icons, type IconKey } from '@/components/ui/Icons'
import { useCurrency } from '@/components/providers/CurrencyProvider'
import type { Transaction } from '@/lib/mock-data'

interface TxRowProps {
  tx: Transaction
  onClick?: () => void
}

export function TxRow({ tx, onClick }: TxRowProps) {
  const isIncome = tx.amount > 0
  const iconKey = tx.icon as IconKey
  const { fmt } = useCurrency()
  return (
    <div
      onClick={onClick}
      className="group hover-row grid grid-cols-[auto_1fr_auto_auto] items-center gap-4 py-3.5 px-2 -mx-2 rounded-lg cursor-pointer"
    >
      <div className="w-9 h-9 rounded-lg bg-white/[0.04] ring-1 ring-white/[0.05] flex items-center justify-center text-white/70 group-hover:text-white/90 group-hover:ring-white/[0.1] transition">
        {Icons[iconKey] ?? Icons.briefcase}
      </div>
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-[13.5px] font-medium text-bone truncate">{tx.merchant}</span>
          {tx.status === 'pending' && (
            <span className="text-[9px] tracking-[0.12em] uppercase px-1.5 py-0.5 rounded bg-amber-400/10 text-amber-300/80 border border-amber-400/20">
              Pending
            </span>
          )}
        </div>
        <div className="text-[11.5px] text-white/40 mt-0.5 group-hover:text-white/55 transition">
          {tx.cat} · {tx.method}
        </div>
      </div>
      <div className="text-right">
        <div className={`text-[13.5px] font-medium tnum ${isIncome ? 'text-gain' : 'text-bone'}`}>
          {isIncome ? '+' : ''}
          {fmt(tx.amount)}
        </div>
        <div className="text-[11px] text-white/40 tnum mt-0.5">
          {new Date(tx.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        </div>
      </div>
      <div className="w-7 h-7 rounded flex items-center justify-center text-white/20 group-hover:text-white/60 transition">
        {Icons.arrowUpRight}
      </div>
    </div>
  )
}
