import 'server-only'
import { auth } from './auth'
import { prisma } from './prisma'
import { centsToDollars } from './utils'
import type { Account, Transaction, Insight, WatchlistItem } from '@/generated/prisma/client'

/* ── Auth helper ──────────────────────────────────────────────────────────── */
export async function getCurrentUser() {
  const session = await auth()
  return session?.user ?? null
}

export async function requireUserId(): Promise<string> {
  const user = await getCurrentUser()
  if (!user?.id) throw new Error('Not authenticated')
  return user.id
}

/* ── Portfolio snapshots for hero chart ──────────────────────────────────── */
export async function getPortfolioSeries(userId: string) {
  const snapshots = await prisma.portfolioSnapshot.findMany({
    where: { userId },
    orderBy: { date: 'asc' },
  })
  return snapshots.map((s) => ({
    ts: s.date.getTime(),
    date: s.date.toISOString().slice(0, 10),
    value: centsToDollars(s.totalValueCents),
  }))
}

/* ── Accounts ──────────────────────────────────────────────────────────────── */
export async function getAccounts(userId: string) {
  return prisma.account.findMany({
    where: { userId },
    orderBy: { createdAt: 'asc' },
  })
}

/* ── Transactions (paginated) ────────────────────────────────────────────── */
export interface TxFilters {
  tab?: 'All' | 'Income' | 'Spending' | 'Pending'
  category?: string
  cursor?: string
  limit?: number
}

export async function getTransactions(userId: string, filters: TxFilters = {}) {
  const { tab = 'All', category, cursor, limit = 10 } = filters
  return prisma.transaction.findMany({
    where: {
      userId,
      ...(tab === 'Income' ? { amountCents: { gt: 0 } } : {}),
      ...(tab === 'Spending' ? { amountCents: { lt: 0 } } : {}),
      ...(tab === 'Pending' ? { status: 'PENDING' } : {}),
      ...(category ? { category } : {}),
    },
    orderBy: { date: 'desc' },
    take: limit + 1,
    ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
  })
}

/* ── Monthly metrics ─────────────────────────────────────────────────────── */
export async function getMonthlyMetrics(userId: string) {
  const now = new Date()
  const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1)
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0)

  const [thisMonth, lastMonth] = await Promise.all([
    prisma.transaction.findMany({
      where: { userId, date: { gte: thisMonthStart }, status: 'POSTED' },
      select: { amountCents: true },
    }),
    prisma.transaction.findMany({
      where: { userId, date: { gte: lastMonthStart, lte: lastMonthEnd }, status: 'POSTED' },
      select: { amountCents: true },
    }),
  ])

  function sumCents(txs: { amountCents: number }[], positive: boolean) {
    return txs.filter((t) => positive ? t.amountCents > 0 : t.amountCents < 0)
      .reduce((s, t) => s + t.amountCents, 0)
  }

  const thisIncome = sumCents(thisMonth, true)
  const thisExpenses = Math.abs(sumCents(thisMonth, false))
  const lastIncome = sumCents(lastMonth, true)
  const lastExpenses = Math.abs(sumCents(lastMonth, false))

  const incomeDelta = lastIncome ? ((thisIncome - lastIncome) / lastIncome) * 100 : 0
  const expensesDelta = lastExpenses ? ((thisExpenses - lastExpenses) / lastExpenses) * 100 : 0
  const savingsRate = thisIncome > 0 ? ((thisIncome - thisExpenses) / thisIncome) * 100 : 0

  return {
    income: centsToDollars(thisIncome),
    incomeDelta,
    expenses: centsToDollars(thisExpenses),
    expensesDelta,
    savingsRate,
    txCount: thisMonth.length,
  }
}

/* ── Watchlist symbols ───────────────────────────────────────────────────── */
export async function getWatchlistSymbols(userId: string): Promise<string[]> {
  const items = await prisma.watchlistItem.findMany({
    where: { userId },
    orderBy: { order: 'asc' },
  })
  return items.map((i) => i.symbol)
}

/* ── Insights ────────────────────────────────────────────────────────────── */
export async function getInsights(userId: string) {
  return prisma.insight.findMany({
    where: { userId, dismissedAt: null },
    orderBy: { createdAt: 'desc' },
  })
}

/* ── Spending by category (current month) ───────────────────────────────── */
export async function getSpendingByCategory(userId: string) {
  const now = new Date()
  const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1)

  const txs = await prisma.transaction.findMany({
    where: {
      userId,
      date: { gte: thisMonthStart },
      amountCents: { lt: 0 },
      status: 'POSTED',
    },
    select: { category: true, amountCents: true },
  })

  const map = new Map<string, number>()
  for (const tx of txs) {
    map.set(tx.category, (map.get(tx.category) ?? 0) + Math.abs(tx.amountCents))
  }

  return Array.from(map.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([name, cents]) => ({ name, value: centsToDollars(cents) }))
}
