'use client'

import { useState } from 'react'
import { ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import Link from 'next/link'
import { Card } from '@/components/ui/Card'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Icons } from '@/components/ui/Icons'
import { SPENDING } from '@/lib/mock-data'
import { useCurrency } from '@/components/providers/CurrencyProvider'

interface SpendingDonutProps {
  onCategoryClick?: (category: string | null) => void
}

export function SpendingDonut({ onCategoryClick }: SpendingDonutProps) {
  const total = SPENDING.reduce((s, x) => s + x.value, 0)
  const [active, setActive] = useState(0)
  const { fmt } = useCurrency()
  const cur = SPENDING[active]
  const curPct = (cur.value / total) * 100

  const handleEnter = (idx: number) => {
    setActive(idx)
    onCategoryClick?.(SPENDING[idx].name)
  }

  return (
    <Card className="p-6">
      <SectionHeader
        eyebrow="This month"
        title="Spending by category"
        action={
          <Link
            href="/budgets"
            className="text-[11px] text-white/45 hover:text-bone flex items-center gap-1"
          >
            Details {Icons.arrowUpRight}
          </Link>
        }
      />

      <div className="relative h-[200px]">
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={SPENDING}
              dataKey="value"
              innerRadius={68}
              outerRadius={92}
              paddingAngle={2}
              stroke="none"
              startAngle={90}
              endAngle={-270}
              onMouseEnter={(_, idx) => handleEnter(idx)}
            >
              {SPENDING.map((s, i) => (
                <Cell key={s.name} fill={s.color} opacity={active === i ? 1 : 0.85} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <div className="text-[10px] tracking-[0.16em] uppercase text-white/40">{cur.name}</div>
          <div className="font-serif text-bone text-[28px] tnum leading-tight">
            {fmt(cur.value, { maximumFractionDigits: 0 })}
          </div>
          <div className="text-[11px] text-white/45 tnum">{curPct.toFixed(1)}% of spending</div>
        </div>
      </div>

      <div className="mt-5 space-y-1.5">
        {SPENDING.map((s, i) => {
          const pct = (s.value / total) * 100
          return (
            <button
              key={s.name}
              onMouseEnter={() => handleEnter(i)}
              onClick={() => onCategoryClick?.(s.name)}
              className={`w-full flex items-center justify-between py-1.5 px-2 -mx-2 rounded-md transition ${
                active === i ? 'bg-white/[0.04]' : 'hover:bg-white/[0.02]'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span
                  className="w-1.5 h-1.5 rounded-full shrink-0"
                  style={{ background: s.color }}
                />
                <span className="text-[12.5px] text-white/75 truncate">{s.name}</span>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className="text-[11px] text-white/40 tnum w-10 text-right">
                  {pct.toFixed(1)}%
                </span>
                <span className="text-[12.5px] text-bone tnum">
                  {fmt(s.value, { maximumFractionDigits: 0 })}
                </span>
              </div>
            </button>
          )
        })}
      </div>

      <div className="mt-4 pt-4 border-t border-white/[0.06] flex items-center justify-between">
        <span className="text-[12px] text-white/45">Total spending</span>
        <span className="font-serif text-bone text-[20px] tnum">
          {fmt(total, { maximumFractionDigits: 0 })}
        </span>
      </div>
    </Card>
  )
}
