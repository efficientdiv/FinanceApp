import { describe, it, expect } from 'vitest'
import { FULL_SERIES, METRICS, SPENDING, TRANSACTIONS, INSIGHTS } from '@/lib/mock-data'
import { generateSeries } from '@/lib/utils'

describe('mock data consistency', () => {
  it('FULL_SERIES has 731 points', () => {
    expect(FULL_SERIES).toHaveLength(731)
  })

  it('METRICS.total matches last series value', () => {
    const lastVal = FULL_SERIES[FULL_SERIES.length - 1].value
    expect(METRICS.total).toBe(lastVal)
  })

  it('METRICS.income is positive', () => {
    expect(METRICS.income).toBeGreaterThan(0)
  })

  it('METRICS.savingsRate is between 0 and 100', () => {
    expect(METRICS.savingsRate).toBeGreaterThanOrEqual(0)
    expect(METRICS.savingsRate).toBeLessThanOrEqual(100)
  })

  it('SPENDING categories are unique', () => {
    const names = SPENDING.map((s) => s.name)
    const unique = new Set(names)
    expect(unique.size).toBe(names.length)
  })

  it('SPENDING values are all positive', () => {
    expect(SPENDING.every((s) => s.value > 0)).toBe(true)
  })

  it('TRANSACTIONS has 10 items', () => {
    expect(TRANSACTIONS).toHaveLength(10)
  })

  it('TRANSACTIONS amounts are non-zero', () => {
    expect(TRANSACTIONS.every((t) => t.amount !== 0)).toBe(true)
  })

  it('TRANSACTIONS dates are valid', () => {
    TRANSACTIONS.forEach((t) => {
      const d = new Date(t.date)
      expect(isNaN(d.getTime())).toBe(false)
    })
  })

  it('INSIGHTS has 3 entries', () => {
    expect(INSIGHTS).toHaveLength(3)
  })

  it('each insight has required fields', () => {
    INSIGHTS.forEach((i) => {
      expect(typeof i.title).toBe('string')
      expect(typeof i.body).toBe('string')
      expect(typeof i.cta).toBe('string')
      expect(['amber', 'bone']).toContain(i.tone)
    })
  })
})

describe('spending calculations', () => {
  it('total spending matches sum of categories', () => {
    const total = SPENDING.reduce((s, x) => s + x.value, 0)
    expect(total).toBe(SPENDING.map((s) => s.value).reduce((a, b) => a + b, 0))
  })

  it('housing is the largest category', () => {
    const housing = SPENDING.find((s) => s.name === 'Housing')!
    const otherMax = SPENDING.filter((s) => s.name !== 'Housing').reduce(
      (m, s) => Math.max(m, s.value),
      0
    )
    expect(housing.value).toBeGreaterThan(otherMax)
  })
})

describe('transaction categorization', () => {
  it('income transactions have positive amounts', () => {
    const income = TRANSACTIONS.filter((t) => t.cat === 'Income')
    expect(income.every((t) => t.amount > 0)).toBe(true)
  })

  it('expense transactions have negative amounts', () => {
    const expenses = TRANSACTIONS.filter((t) => t.cat !== 'Income')
    expect(expenses.every((t) => t.amount < 0)).toBe(true)
  })

  it('pending transactions are correctly flagged', () => {
    const pending = TRANSACTIONS.filter((t) => t.status === 'pending')
    expect(pending.length).toBeGreaterThan(0)
    expect(pending.every((t) => t.status === 'pending')).toBe(true)
  })
})

describe('portfolio series date grouping', () => {
  const series = generateSeries(new Date('2026-05-16'))

  it('all dates are unique', () => {
    const dates = series.map((p) => p.date)
    const unique = new Set(dates)
    expect(unique.size).toBe(dates.length)
  })

  it('YTD slice starts on Jan 1', () => {
    const jan1 = +new Date('2026-01-01')
    const ytd = series.filter((p) => p.ts >= jan1)
    const firstDate = ytd[0].date
    expect(firstDate.startsWith('2026-01')).toBe(true)
  })

  it('1M slice has ~30 points', () => {
    const slice = series.slice(-31)
    expect(slice.length).toBe(31)
  })
})
