import { generateSeries, type SeriesPoint } from './utils'
import { makeFmt } from './currency'
export type { SeriesPoint } from './utils'

export const TODAY = new Date('2026-05-16T00:00:00')

export const FULL_SERIES: SeriesPoint[] = generateSeries(TODAY)

export interface Period {
  key: string
  days: number | null
}

export const PERIODS: Period[] = [
  { key: '1M', days: 30 },
  { key: '3M', days: 90 },
  { key: '6M', days: 180 },
  { key: 'YTD', days: null },
  { key: '1Y', days: 365 },
  { key: 'ALL', days: 9999 },
]

export function sliceSeries(periodKey: string): SeriesPoint[] {
  if (periodKey === 'YTD') {
    const jan1 = +new Date('2026-01-01')
    return FULL_SERIES.filter((p) => p.ts >= jan1)
  }
  const p = PERIODS.find((x) => x.key === periodKey)
  if (!p || (p.days !== null && p.days >= 9999)) return FULL_SERIES
  if (p.days === null) return FULL_SERIES
  return FULL_SERIES.slice(-p.days - 1)
}

/* ── Metrics (derived from series) ───────────────────────────────────────── */
const last = FULL_SERIES[FULL_SERIES.length - 1].value
const monthAgo = FULL_SERIES[FULL_SERIES.length - 31].value
const monthDelta = last - monthAgo
const monthPct = (monthDelta / monthAgo) * 100

export const METRICS = {
  total: last,
  monthDelta,
  monthPct,
  income: 14580.0,
  incomeDelta: 4.2,
  expenses: 6247.83,
  expensesDelta: -2.8,
  savingsRate: 57.2,
  savingsRateDelta: 3.1,
  invested: 342890.41,
  investedDelta: 6.8,
}

/* ── Spending categories ─────────────────────────────────────────────────── */
export interface SpendingCategory {
  name: string
  value: number
  color: string
}

export const SPENDING: SpendingCategory[] = [
  { name: 'Housing', value: 2400, color: '#ece9e1' },
  { name: 'Food & Dining', value: 982, color: '#a8a59c' },
  { name: 'Transportation', value: 614, color: '#7a786f' },
  { name: 'Shopping', value: 547, color: '#3fb27f' },
  { name: 'Entertainment', value: 318, color: '#5a584f' },
  { name: 'Utilities', value: 246, color: '#403e36' },
  { name: 'Healthcare', value: 188, color: '#2b2925' },
]

/* ── Transactions ────────────────────────────────────────────────────────── */
export interface Transaction {
  id: number
  merchant: string
  cat: string
  icon: string
  amount: number
  date: string
  method: string
  status: 'posted' | 'pending'
}

export const TRANSACTIONS: Transaction[] = [
  { id: 1, merchant: 'Whole Foods Market', cat: 'Food & Dining', icon: 'cart', amount: -148.32, date: '2026-05-15', method: 'AmEx · 1004', status: 'posted' },
  { id: 2, merchant: 'Stripe Payroll', cat: 'Income', icon: 'briefcase', amount: 7290.0, date: '2026-05-15', method: 'Direct deposit', status: 'posted' },
  { id: 3, merchant: 'Apple', cat: 'Shopping', icon: 'shirt', amount: -429.0, date: '2026-05-14', method: 'AmEx · 1004', status: 'posted' },
  { id: 4, merchant: 'Uber', cat: 'Transportation', icon: 'car', amount: -22.4, date: '2026-05-14', method: 'Chase · 8821', status: 'posted' },
  { id: 5, merchant: 'Blue Bottle Coffee', cat: 'Food & Dining', icon: 'coffee', amount: -8.75, date: '2026-05-13', method: 'AmEx · 1004', status: 'posted' },
  { id: 6, merchant: 'Greenpoint Realty', cat: 'Housing', icon: 'home', amount: -2400.0, date: '2026-05-12', method: 'ACH · Checking', status: 'posted' },
  { id: 7, merchant: 'Netflix', cat: 'Entertainment', icon: 'film', amount: -22.99, date: '2026-05-12', method: 'AmEx · 1004', status: 'posted' },
  { id: 8, merchant: 'Con Edison', cat: 'Utilities', icon: 'zap', amount: -94.18, date: '2026-05-11', method: 'ACH · Checking', status: 'posted' },
  { id: 9, merchant: 'One Medical', cat: 'Healthcare', icon: 'heart', amount: -149.0, date: '2026-05-10', method: 'AmEx · 1004', status: 'pending' },
  { id: 10, merchant: 'Amazon', cat: 'Shopping', icon: 'cart', amount: -67.4, date: '2026-05-10', method: 'Chase · 8821', status: 'posted' },
]

/* ── Watchlist ────────────────────────────────────────────────────────────── */
export interface WatchlistTicker {
  sym: string
  name: string
  price: number
  chg: number
  vol: string
}

export const WATCHLIST: WatchlistTicker[] = [
  { sym: 'NVDA', name: 'NVIDIA Corp.', price: 1284.62, chg: 2.41, vol: '48.2M' },
  { sym: 'AAPL', name: 'Apple Inc.', price: 214.08, chg: 0.82, vol: '52.1M' },
  { sym: 'MSFT', name: 'Microsoft', price: 482.55, chg: 1.14, vol: '21.8M' },
  { sym: 'GOOGL', name: 'Alphabet Class A', price: 198.2, chg: -0.46, vol: '18.7M' },
  { sym: 'BRK.B', name: 'Berkshire Hathaway', price: 468.91, chg: 0.31, vol: '3.9M' },
  { sym: 'VTI', name: 'Vanguard Total Mkt', price: 298.74, chg: -0.18, vol: '4.2M' },
]

/* ── Accounts ─────────────────────────────────────────────────────────────── */
export interface Account {
  id: string
  name: string
  bank: string
  num: string
  bal: number
  kind: 'cash' | 'invest'
  apy?: string
}

export const ACCOUNTS: Account[] = [
  { id: 'checking', name: 'Premier Checking', bank: 'Chase', num: '••8821', bal: 18420.55, kind: 'cash' },
  { id: 'savings', name: 'High-Yield Savings', bank: 'Marcus', num: '••0143', bal: 125983.1, kind: 'cash', apy: '4.40%' },
  { id: 'brokerage', name: 'Brokerage', bank: 'Fidelity', num: '••5402', bal: 287140.22, kind: 'invest' },
  { id: 'retirement', name: 'Retirement · 401(k)', bank: 'Vanguard', num: '••9988', bal: 55750.19, kind: 'invest' },
]

/* ── Insights ─────────────────────────────────────────────────────────────── */
export interface Insight {
  tag: string
  title: string
  body: string
  cta: string
  tone: 'amber' | 'bone'
}

type FmtFn = (n: number, opts?: Intl.NumberFormatOptions) => string
type FmtKFn = (n: number) => string

export function makeInsights(fmtK: FmtKFn, fmt: FmtFn): Insight[] {
  return [
    {
      tag: 'Cash drag',
      title: `You hold ${fmtK(34200)} more cash than your target.`,
      body: `Moving the excess into your HYSA would earn an estimated ${fmt(1505)}/yr at 4.40% APY.`,
      cta: 'Move to savings',
      tone: 'amber',
    },
    {
      tag: 'Tax-loss harvest',
      title: `TLH opportunity in VXUS — unrealized loss of ${fmt(1284)}.`,
      body: `Estimated tax savings of ~${fmt(385)} if harvested before quarter-end. Replacement: IXUS.`,
      cta: 'Review opportunity',
      tone: 'bone',
    },
    {
      tag: 'Recurring',
      title: `11 active subscriptions totaling ${fmt(187.42)}/mo.`,
      body: `Two haven't been used in 60+ days: Adobe CC (${fmt(59.99)}) and Headspace (${fmt(12.99)}).`,
      cta: 'Review subscriptions',
      tone: 'bone',
    },
  ]
}

// Static USD version for tests
const { fmt: _fmt, fmtK: _fmtK } = makeFmt('USD')
export const INSIGHTS: Insight[] = makeInsights(_fmtK, _fmt)
