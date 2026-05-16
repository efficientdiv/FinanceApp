import 'dotenv/config'
import { PrismaClient } from '../src/generated/prisma/client'
import bcrypt from 'bcryptjs'
import { generateSeries, dollarsToCents } from '../src/lib/utils'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Clean existing demo data
  await prisma.portfolioSnapshot.deleteMany({})
  await prisma.insight.deleteMany({})
  await prisma.watchlistItem.deleteMany({})
  await prisma.holding.deleteMany({})
  await prisma.transaction.deleteMany({})
  await prisma.account.deleteMany({})
  await prisma.category.deleteMany({})
  await prisma.session.deleteMany({})
  await prisma.authAccount.deleteMany({})
  await prisma.user.deleteMany({})

  // ── User ──────────────────────────────────────────────────────────────
  const passwordHash = await bcrypt.hash('demo1234!', 12)
  const user = await prisma.user.create({
    data: {
      email: 'eleanor@luxfinance.demo',
      name: 'Eleanor Vance',
      password: passwordHash,
    },
  })
  console.log(`✓ Created user: ${user.email}`)

  // ── Categories ────────────────────────────────────────────────────────
  const categories = [
    { name: 'Housing', color: '#ece9e1', iconKey: 'home' },
    { name: 'Food & Dining', color: '#a8a59c', iconKey: 'cart' },
    { name: 'Transportation', color: '#7a786f', iconKey: 'car' },
    { name: 'Shopping', color: '#3fb27f', iconKey: 'shirt' },
    { name: 'Entertainment', color: '#5a584f', iconKey: 'film' },
    { name: 'Utilities', color: '#403e36', iconKey: 'zap' },
    { name: 'Healthcare', color: '#2b2925', iconKey: 'heart' },
    { name: 'Income', color: '#3fb27f', iconKey: 'briefcase' },
  ]
  await prisma.category.createMany({
    data: categories.map((c) => ({ ...c, userId: user.id })),
  })
  console.log(`✓ Created ${categories.length} categories`)

  // ── Accounts ──────────────────────────────────────────────────────────
  const [checking, savings, brokerage, retirement] = await Promise.all([
    prisma.account.create({
      data: {
        userId: user.id,
        name: 'Premier Checking',
        institution: 'Chase',
        mask: '8821',
        kind: 'CHECKING',
        balanceCents: dollarsToCents(18420.55),
      },
    }),
    prisma.account.create({
      data: {
        userId: user.id,
        name: 'High-Yield Savings',
        institution: 'Marcus',
        mask: '0143',
        kind: 'SAVINGS',
        balanceCents: dollarsToCents(125983.1),
        apy: '4.40%',
      },
    }),
    prisma.account.create({
      data: {
        userId: user.id,
        name: 'Brokerage',
        institution: 'Fidelity',
        mask: '5402',
        kind: 'BROKERAGE',
        balanceCents: dollarsToCents(287140.22),
      },
    }),
    prisma.account.create({
      data: {
        userId: user.id,
        name: 'Retirement · 401(k)',
        institution: 'Vanguard',
        mask: '9988',
        kind: 'RETIREMENT',
        balanceCents: dollarsToCents(55750.19),
      },
    }),
  ])
  console.log('✓ Created 4 accounts')

  // ── Transactions ──────────────────────────────────────────────────────
  const txData = [
    { merchant: 'Whole Foods Market', category: 'Food & Dining', iconKey: 'cart', amountCents: dollarsToCents(-148.32), date: '2026-05-15', method: 'AmEx · 1004', status: 'POSTED' as const, accountId: checking.id },
    { merchant: 'Stripe Payroll', category: 'Income', iconKey: 'briefcase', amountCents: dollarsToCents(7290.0), date: '2026-05-15', method: 'Direct deposit', status: 'POSTED' as const, accountId: checking.id },
    { merchant: 'Apple', category: 'Shopping', iconKey: 'shirt', amountCents: dollarsToCents(-429.0), date: '2026-05-14', method: 'AmEx · 1004', status: 'POSTED' as const, accountId: checking.id },
    { merchant: 'Uber', category: 'Transportation', iconKey: 'car', amountCents: dollarsToCents(-22.4), date: '2026-05-14', method: 'Chase · 8821', status: 'POSTED' as const, accountId: checking.id },
    { merchant: 'Blue Bottle Coffee', category: 'Food & Dining', iconKey: 'coffee', amountCents: dollarsToCents(-8.75), date: '2026-05-13', method: 'AmEx · 1004', status: 'POSTED' as const, accountId: checking.id },
    { merchant: 'Greenpoint Realty', category: 'Housing', iconKey: 'home', amountCents: dollarsToCents(-2400.0), date: '2026-05-12', method: 'ACH · Checking', status: 'POSTED' as const, accountId: checking.id },
    { merchant: 'Netflix', category: 'Entertainment', iconKey: 'film', amountCents: dollarsToCents(-22.99), date: '2026-05-12', method: 'AmEx · 1004', status: 'POSTED' as const, accountId: checking.id },
    { merchant: 'Con Edison', category: 'Utilities', iconKey: 'zap', amountCents: dollarsToCents(-94.18), date: '2026-05-11', method: 'ACH · Checking', status: 'POSTED' as const, accountId: checking.id },
    { merchant: 'One Medical', category: 'Healthcare', iconKey: 'heart', amountCents: dollarsToCents(-149.0), date: '2026-05-10', method: 'AmEx · 1004', status: 'PENDING' as const, accountId: checking.id },
    { merchant: 'Amazon', category: 'Shopping', iconKey: 'cart', amountCents: dollarsToCents(-67.4), date: '2026-05-10', method: 'Chase · 8821', status: 'POSTED' as const, accountId: checking.id },
  ]

  await prisma.transaction.createMany({
    data: txData.map((t) => ({
      userId: user.id,
      accountId: t.accountId,
      merchant: t.merchant,
      category: t.category,
      iconKey: t.iconKey,
      amountCents: t.amountCents,
      date: new Date(t.date),
      method: t.method,
      status: t.status,
    })),
  })
  console.log(`✓ Created ${txData.length} transactions`)

  // ── Holdings ──────────────────────────────────────────────────────────
  const holdings = [
    { symbol: 'NVDA', shares: 15, costBasisCents: dollarsToCents(8200) },
    { symbol: 'AAPL', shares: 120, costBasisCents: dollarsToCents(18000) },
    { symbol: 'MSFT', shares: 45, costBasisCents: dollarsToCents(16000) },
    { symbol: 'GOOGL', shares: 60, costBasisCents: dollarsToCents(10500) },
    { symbol: 'VXUS', shares: 200, costBasisCents: dollarsToCents(11000) },
    { symbol: 'VTI', shares: 180, costBasisCents: dollarsToCents(42000) },
    { symbol: 'BND', shares: 300, costBasisCents: dollarsToCents(22000) },
  ]
  await prisma.holding.createMany({
    data: holdings.map((h) => ({ ...h, userId: user.id, accountId: brokerage.id })),
  })
  console.log(`✓ Created ${holdings.length} holdings`)

  // ── Watchlist ─────────────────────────────────────────────────────────
  const watchlistSymbols = ['NVDA', 'AAPL', 'MSFT', 'GOOGL', 'BRK.B', 'VTI']
  await prisma.watchlistItem.createMany({
    data: watchlistSymbols.map((symbol, order) => ({ userId: user.id, symbol, order })),
  })
  console.log(`✓ Created ${watchlistSymbols.length} watchlist items`)

  // ── Portfolio snapshots (730 days matching generateSeries) ────────────
  const series = generateSeries(new Date('2026-05-16T00:00:00'))
  await prisma.portfolioSnapshot.createMany({
    data: series.map((p) => ({
      userId: user.id,
      date: new Date(p.date),
      totalValueCents: dollarsToCents(p.value),
    })),
  })
  console.log(`✓ Created ${series.length} portfolio snapshots`)

  // ── Insights ──────────────────────────────────────────────────────────
  await prisma.insight.createMany({
    data: [
      {
        userId: user.id,
        kind: 'CASH_DRAG',
        tag: 'Cash drag',
        title: 'You hold $34.2k more cash than your target.',
        body: 'Moving the excess into your Marcus HYSA would earn an estimated $1,505/yr at 4.40% APY.',
        ctaLabel: 'Move to savings',
        tone: 'amber',
      },
      {
        userId: user.id,
        kind: 'TAX_LOSS_HARVEST',
        tag: 'Tax-loss harvest',
        title: 'TLH opportunity in VXUS — unrealized loss of $1,284.',
        body: 'Estimated tax savings of ~$385 if harvested before quarter-end. Replacement: IXUS.',
        ctaLabel: 'Review opportunity',
        tone: 'bone',
      },
      {
        userId: user.id,
        kind: 'SUBSCRIPTIONS',
        tag: 'Recurring',
        title: '11 active subscriptions totaling $187.42/mo.',
        body: "Two haven't been used in 60+ days: Adobe CC ($59.99) and Headspace ($12.99).",
        ctaLabel: 'Review subscriptions',
        tone: 'bone',
      },
    ],
  })
  console.log('✓ Created 3 insights')

  console.log('\n✅ Seed complete!')
  console.log('   Login: eleanor@luxfinance.demo / demo1234!')
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
