'use client'

import { useState } from 'react'
import { MetricCard } from './MetricCard'
import { BudgetModal, type BudgetTarget } from './BudgetModal'
import { METRICS } from '@/lib/mock-data'
import { mkSpark } from '@/lib/utils'
import { useCurrency } from '@/components/providers/CurrencyProvider'

export function MetricRow() {
  const [budgetTarget, setBudgetTarget] = useState<BudgetTarget | null>(null)
  const { fmt, fmtK } = useCurrency()

  const cards: Array<BudgetTarget & {
    value: string
    delta: number
    sparkSeed: number
    sparkBias: number
    sparkColor: string
  }> = [
    {
      label: 'Monthly income',
      value: fmt(METRICS.income, { maximumFractionDigits: 0 }),
      delta: METRICS.incomeDelta,
      current: fmt(METRICS.income, { maximumFractionDigits: 0 }),
      unit: 'usd',
      defaultTarget: 15000,
      sparkSeed: 1,
      sparkBias: 0.4,
      sparkColor: '#3fb27f',
    },
    {
      label: 'Monthly expenses',
      value: fmt(METRICS.expenses, { maximumFractionDigits: 0 }),
      delta: METRICS.expensesDelta,
      current: fmt(METRICS.expenses, { maximumFractionDigits: 0 }),
      unit: 'usd',
      defaultTarget: 6000,
      sparkSeed: 2,
      sparkBias: -0.2,
      sparkColor: '#e26464',
    },
    {
      label: 'Savings rate',
      value: METRICS.savingsRate.toFixed(1) + '%',
      delta: METRICS.savingsRateDelta,
      current: METRICS.savingsRate.toFixed(1) + '%',
      unit: 'pct',
      defaultTarget: 60,
      sparkSeed: 3,
      sparkBias: 0.3,
      sparkColor: '#3fb27f',
    },
    {
      label: 'Invested assets',
      value: fmtK(METRICS.invested),
      delta: METRICS.investedDelta,
      current: fmtK(METRICS.invested),
      unit: 'usd',
      defaultTarget: 400000,
      sparkSeed: 4,
      sparkBias: 0.5,
      sparkColor: '#ece9e1',
    },
  ]

  const subs = [
    'vs. last month · 3 sources',
    'vs. last month · 142 txns',
    'target 50% · on track',
    'across 4 accounts',
  ]

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c, i) => (
          <MetricCard
            key={c.label}
            label={c.label}
            value={c.value}
            delta={c.delta}
            sub={subs[i]}
            sparkData={mkSpark(c.sparkSeed, c.sparkBias)}
            sparkColor={c.sparkColor}
            onClick={() =>
              setBudgetTarget({
                label: c.label,
                current: c.current,
                unit: c.unit,
                defaultTarget: c.defaultTarget,
              })
            }
          />
        ))}
      </div>
      <BudgetModal target={budgetTarget} onClose={() => setBudgetTarget(null)} />
    </>
  )
}
