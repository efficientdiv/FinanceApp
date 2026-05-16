'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Card } from '@/components/ui/Card'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Icons } from '@/components/ui/Icons'
import { TxRow } from './TxRow'
import { TxDetailModal } from './TxDetailModal'
import { TRANSACTIONS, TODAY } from '@/lib/mock-data'
import { dayLabel } from '@/lib/utils'
import { useCurrency } from '@/components/providers/CurrencyProvider'
import type { Transaction } from '@/lib/mock-data'

const TABS = ['All', 'Income', 'Spending', 'Pending'] as const
type Tab = (typeof TABS)[number]

interface TransactionsProps {
  categoryFilter?: string | null
  transactions?: Transaction[]
}

export function Transactions({ categoryFilter, transactions = TRANSACTIONS }: TransactionsProps) {
  const [filter, setFilter] = useState<Tab>('All')
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null)
  const { fmt } = useCurrency()

  const filtered = useMemo(() => {
    return transactions.filter((t) => {
      if (categoryFilter && t.cat !== categoryFilter) return false
      if (filter === 'Income') return t.amount > 0
      if (filter === 'Spending') return t.amount < 0
      if (filter === 'Pending') return t.status === 'pending'
      return true
    })
  }, [filter, categoryFilter, transactions])

  const groups = useMemo(() => {
    const m = new Map<string, Transaction[]>()
    filtered.forEach((t) => {
      if (!m.has(t.date)) m.set(t.date, [])
      m.get(t.date)!.push(t)
    })
    return Array.from(m.entries())
  }, [filtered])

  return (
    <Card className="p-6">
      <SectionHeader
        eyebrow="Activity"
        title="Recent transactions"
        action={
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-white/[0.03] ring-1 ring-white/[0.06] rounded-lg p-0.5">
              {TABS.map((t) => (
                <button
                  key={t}
                  onClick={() => setFilter(t)}
                  className={`px-2.5 h-7 rounded-md text-[11.5px] font-medium transition ${
                    filter === t ? 'seg-active' : 'text-white/45 hover:text-white/75'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
            <button className="h-8 px-2.5 rounded-lg bg-white/[0.03] ring-1 ring-white/[0.06] text-white/55 hover:text-bone flex items-center gap-1.5 text-[11.5px] font-medium">
              {Icons.filter}
            </button>
          </div>
        }
      />

      <div className="space-y-4">
        {groups.map(([day, items]) => (
          <div key={day}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-medium tracking-[0.14em] uppercase text-white/35">
                {dayLabel(day, TODAY)}
              </span>
              <span className="text-[10.5px] text-white/30 tnum">
                Net {fmt(items.reduce((s, x) => s + x.amount, 0))}
              </span>
            </div>
            <div className="divide-y divide-white/[0.04]">
              {items.map((t, idx) => (
                <TxRow key={`${day}-${t.id}-${idx}`} tx={t} onClick={() => setSelectedTx(t)} />
              ))}
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="text-center text-[13px] text-white/30 py-8">No transactions match.</p>
        )}
      </div>

      <div className="mt-5 pt-4 border-t border-white/[0.06] flex items-center justify-between">
        <span className="text-[11.5px] text-white/40 tnum">
          Showing {filtered.length} of 142 this month
        </span>
        <Link
          href="/transactions"
          className="text-[12px] text-bone hover:text-white flex items-center gap-1 font-medium"
        >
          View all activity {Icons.arrowUpRight}
        </Link>
      </div>

      <TxDetailModal tx={selectedTx} onClose={() => setSelectedTx(null)} />
    </Card>
  )
}
