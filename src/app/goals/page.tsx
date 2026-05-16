'use client'

import { useEffect, useState } from 'react'
import { TopNav } from '@/components/nav/TopNav'
import { Card } from '@/components/ui/Card'
import { Icons } from '@/components/ui/Icons'
import { useCurrency } from '@/components/providers/CurrencyProvider'

const GOALS = [
  { name: 'Emergency fund', target: 50000, current: 18420, color: '#3fb27f', icon: '🛡️', deadline: 'Dec 2026' },
  { name: 'Home down payment', target: 150000, current: 125983, color: '#ece9e1', icon: '🏡', deadline: 'Mar 2027' },
  { name: 'Early retirement', target: 2000000, current: 342890, color: '#a8a59c', icon: '🌴', deadline: '2045' },
]

export default function GoalsPage() {
  const [mounted, setMounted] = useState(false)
  const { fmtK } = useCurrency()
  useEffect(() => { setMounted(true) }, [])

  return (
    <div className="min-h-screen bg-ink-950 grain">
      <TopNav />
      <main className="max-w-[1480px] mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 space-y-6">
        <div className="flex items-end justify-between animate-enter">
          <div>
            <div className="text-[11px] font-medium tracking-[0.18em] uppercase text-white/40 mb-1.5">
              Goals
            </div>
            <h1 className="font-serif text-bone text-[36px] leading-none italic">Your goals.</h1>
          </div>
          <button className="h-9 px-3.5 rounded-lg bg-bone text-ink-950 hover:bg-white text-[12.5px] font-semibold flex items-center gap-2 transition">
            {Icons.plus} New goal
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {GOALS.map((g, i) => {
            const pct = Math.min((g.current / g.target) * 100, 100)
            const remaining = g.target - g.current
            return (
              <Card key={g.name} className={`p-6 card-hover animate-enter delay-${i + 1}`}>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <span className="text-[22px] leading-none">{g.icon}</span>
                    <div className="text-[13px] font-medium text-bone mt-2">{g.name}</div>
                    <div className="text-[11px] text-white/40 mt-0.5">Target {g.deadline}</div>
                  </div>
                  <button className="w-7 h-7 rounded-md flex items-center justify-center text-white/30 hover:text-bone hover:bg-white/[0.05] transition">
                    {Icons.edit}
                  </button>
                </div>

                <div className="flex items-baseline gap-1 mb-1">
                  <span className="font-serif text-bone text-[28px] tnum leading-none">{fmtK(g.current)}</span>
                  <span className="text-[13px] text-white/40">/ {fmtK(g.target)}</span>
                </div>

                <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden mt-4">
                  <div
                    className="h-full rounded-full bar-animate transition-[width] duration-1000 ease-out"
                    style={{ width: mounted ? `${pct}%` : '0%', background: g.color }}
                  />
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <span className="text-[11px] text-white/40 tnum">{pct.toFixed(1)}% funded</span>
                  <span className="text-[11px] text-white/35 tnum">{fmtK(remaining)} to go</span>
                </div>
              </Card>
            )
          })}
        </div>
      </main>
    </div>
  )
}
