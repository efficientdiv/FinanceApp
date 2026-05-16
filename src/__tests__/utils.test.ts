import { describe, it, expect } from 'vitest'
import {
  fmtUSD,
  fmtUSDK,
  fmtPct,
  centsToDollars,
  dollarsToCents,
  fmtCents,
  generateSeries,
  mkSpark,
  dayLabel,
  cn,
  mulberry32,
} from '@/lib/utils'

describe('fmtUSD', () => {
  it('formats whole dollars', () => {
    expect(fmtUSD(1000)).toBe('$1,000.00')
  })
  it('formats negative dollars', () => {
    expect(fmtUSD(-148.32)).toBe('-$148.32')
  })
  it('respects maximumFractionDigits override', () => {
    expect(fmtUSD(1234.56, { maximumFractionDigits: 0 })).toBe('$1,235')
  })
  it('formats millions', () => {
    expect(fmtUSD(1_000_000)).toBe('$1,000,000.00')
  })
})

describe('fmtUSDK', () => {
  it('formats thousands with k suffix', () => {
    expect(fmtUSDK(1500)).toBe('$1.5k')
  })
  it('formats millions with M suffix', () => {
    expect(fmtUSDK(1_200_000)).toBe('$1.20M')
  })
  it('formats sub-thousand normally', () => {
    expect(fmtUSDK(999)).toBe('$999')
  })
  it('handles negative thousands', () => {
    expect(fmtUSDK(-5000)).toBe('-$5.0k')
  })
})

describe('fmtPct', () => {
  it('formats positive percent with + sign', () => {
    expect(fmtPct(4.2)).toBe('+4.20%')
  })
  it('formats negative percent without + sign', () => {
    expect(fmtPct(-2.8)).toBe('-2.80%')
  })
  it('respects digit override', () => {
    expect(fmtPct(1.5, 1)).toBe('+1.5%')
  })
})

describe('cent conversion', () => {
  it('converts dollars to cents correctly', () => {
    expect(dollarsToCents(14.99)).toBe(1499)
  })
  it('converts cents to dollars', () => {
    expect(centsToDollars(1499)).toBe(14.99)
  })
  it('round-trips correctly', () => {
    const dollars = 487294.33
    expect(centsToDollars(dollarsToCents(dollars))).toBeCloseTo(dollars, 1)
  })
  it('formats cents as USD string', () => {
    expect(fmtCents(1000)).toBe('$10.00')
  })
})

describe('generateSeries', () => {
  const today = new Date('2026-05-16T00:00:00')
  const series = generateSeries(today)

  it('returns 731 points (730 days + today)', () => {
    expect(series).toHaveLength(731)
  })
  it('ends near the target value of 487294', () => {
    const last = series[series.length - 1].value
    expect(Math.abs(last - 487294)).toBeLessThan(10)
  })
  it('starts near 348000', () => {
    const first = series[0].value
    expect(Math.abs(first - 348000)).toBeLessThan(50000)
  })
  it('has sequential dates', () => {
    for (let i = 1; i < series.length; i++) {
      expect(series[i].ts).toBeGreaterThan(series[i - 1].ts)
    }
  })
  it('is deterministic', () => {
    const s2 = generateSeries(today)
    expect(series.map((p) => p.value)).toEqual(s2.map((p) => p.value))
  })
})

describe('mkSpark', () => {
  it('returns 22 data points', () => {
    expect(mkSpark(1, 0.4)).toHaveLength(22)
  })
  it('is deterministic', () => {
    expect(mkSpark(42, 0.5)).toEqual(mkSpark(42, 0.5))
  })
  it('upward trend has higher end than downward', () => {
    const up = mkSpark(99, 2)
    const down = mkSpark(99, -2)
    const upEnd = up[up.length - 1].v
    const downEnd = down[down.length - 1].v
    expect(upEnd).toBeGreaterThan(downEnd)
  })
})

describe('dayLabel', () => {
  const today = new Date('2026-05-16T00:00:00')
  it('returns "Today" for same day', () => {
    expect(dayLabel('2026-05-16', today)).toBe('Today')
  })
  it('returns "Yesterday" for one day ago', () => {
    expect(dayLabel('2026-05-15', today)).toBe('Yesterday')
  })
  it('returns formatted date for older dates', () => {
    const label = dayLabel('2026-05-10', today)
    expect(label).toMatch(/Sunday/)
  })
})

describe('cn', () => {
  it('joins classes', () => {
    expect(cn('a', 'b', 'c')).toBe('a b c')
  })
  it('filters falsy values', () => {
    expect(cn('a', false, undefined, null, 'b')).toBe('a b')
  })
  it('handles empty', () => {
    expect(cn()).toBe('')
  })
})

describe('mulberry32 PRNG', () => {
  it('returns values in [0, 1)', () => {
    const rand = mulberry32(42)
    for (let i = 0; i < 100; i++) {
      const v = rand()
      expect(v).toBeGreaterThanOrEqual(0)
      expect(v).toBeLessThan(1)
    }
  })
  it('is deterministic', () => {
    const r1 = mulberry32(7)
    const r2 = mulberry32(7)
    for (let i = 0; i < 20; i++) {
      expect(r1()).toBe(r2())
    }
  })
})
