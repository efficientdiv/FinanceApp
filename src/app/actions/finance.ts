'use server'

import { revalidatePath } from 'next/cache'
import { getDemoUserId } from '@/lib/data'
import { prisma } from '@/lib/prisma'
import { dollarsToCents } from '@/lib/utils'
import bcrypt from 'bcryptjs'

/* ── Deposit ────────────────────────────────────────────────────────────── */
export async function depositAction(formData: FormData) {
  const userId = await getDemoUserId()
  const accountId = formData.get('accountId') as string
  const amount = parseFloat(formData.get('amount') as string)
  if (!accountId || isNaN(amount) || amount <= 0) throw new Error('Invalid input')

  await prisma.$transaction([
    prisma.account.update({
      where: { id: accountId, userId },
      data: { balanceCents: { increment: dollarsToCents(amount) } },
    }),
    prisma.transaction.create({
      data: {
        userId,
        accountId,
        merchant: 'Deposit',
        amountCents: dollarsToCents(amount),
        category: 'Income',
        iconKey: 'briefcase',
        date: new Date(),
        method: 'Transfer',
        status: 'POSTED',
      },
    }),
  ])

  revalidatePath('/')
  revalidatePath('/accounts')
}

/* ── Move money ─────────────────────────────────────────────────────────── */
export async function moveMoneyAction(formData: FormData) {
  const userId = await getDemoUserId()
  const fromId = formData.get('fromAccountId') as string
  const toId = formData.get('toAccountId') as string
  const amount = parseFloat(formData.get('amount') as string)
  if (!fromId || !toId || isNaN(amount) || amount <= 0) throw new Error('Invalid input')

  const cents = dollarsToCents(amount)
  const from = await prisma.account.findUnique({ where: { id: fromId, userId } })
  if (!from || from.balanceCents < cents) throw new Error('Insufficient funds')

  await prisma.$transaction([
    prisma.account.update({ where: { id: fromId }, data: { balanceCents: { decrement: cents } } }),
    prisma.account.update({ where: { id: toId }, data: { balanceCents: { increment: cents } } }),
    prisma.transaction.create({
      data: {
        userId,
        accountId: fromId,
        merchant: 'Transfer Out',
        amountCents: -cents,
        category: 'Transfer',
        iconKey: 'repeat',
        date: new Date(),
        method: 'Internal',
        status: 'POSTED',
      },
    }),
    prisma.transaction.create({
      data: {
        userId,
        accountId: toId,
        merchant: 'Transfer In',
        amountCents: cents,
        category: 'Transfer',
        iconKey: 'repeat',
        date: new Date(),
        method: 'Internal',
        status: 'POSTED',
      },
    }),
  ])

  revalidatePath('/')
  revalidatePath('/accounts')
}

/* ── Categorize transaction ─────────────────────────────────────────────── */
export async function categorizeTxAction(txId: string, category: string) {
  const userId = await getDemoUserId()
  await prisma.transaction.update({
    where: { id: txId, userId },
    data: { category },
  })
  revalidatePath('/')
  revalidatePath('/transactions')
}

/* ── Dismiss insight ────────────────────────────────────────────────────── */
export async function dismissInsightAction(insightId: string) {
  const userId = await getDemoUserId()
  await prisma.insight.update({
    where: { id: insightId, userId },
    data: { dismissedAt: new Date() },
  })
  revalidatePath('/')
}

/* ── Add watchlist symbol ───────────────────────────────────────────────── */
export async function addWatchlistAction(symbol: string) {
  const userId = await getDemoUserId()
  const count = await prisma.watchlistItem.count({ where: { userId } })
  await prisma.watchlistItem.upsert({
    where: { userId_symbol: { userId, symbol: symbol.toUpperCase() } },
    create: { userId, symbol: symbol.toUpperCase(), order: count },
    update: {},
  })
  revalidatePath('/')
}

/* ── Remove watchlist symbol ────────────────────────────────────────────── */
export async function removeWatchlistAction(symbol: string) {
  const userId = await getDemoUserId()
  await prisma.watchlistItem.deleteMany({
    where: { userId, symbol: symbol.toUpperCase() },
  })
  revalidatePath('/')
}

/* ── Update transaction notes ───────────────────────────────────────────── */
export async function updateTxNotesAction(txId: string, notes: string) {
  const userId = await getDemoUserId()
  await prisma.transaction.update({
    where: { id: txId, userId },
    data: { notes },
  })
  revalidatePath('/transactions')
}

/* ── Toggle recurring flag ──────────────────────────────────────────────── */
export async function toggleRecurringAction(txId: string, isRecurring: boolean) {
  const userId = await getDemoUserId()
  await prisma.transaction.update({
    where: { id: txId, userId },
    data: { isRecurring },
  })
  revalidatePath('/transactions')
}

/* ── Update budget ──────────────────────────────────────────────────────── */
export async function updateBudgetAction(categoryName: string, monthlyBudgetDollars: number) {
  const userId = await getDemoUserId()
  await prisma.category.updateMany({
    where: { userId, name: categoryName },
    data: { budgetMonthlyCents: dollarsToCents(monthlyBudgetDollars) },
  })
  revalidatePath('/budgets')
}

/* ── Update profile ─────────────────────────────────────────────────────── */
export async function updateProfileAction(formData: FormData) {
  const userId = await getDemoUserId()
  const name = (formData.get('name') as string)?.trim()
  const email = (formData.get('email') as string)?.trim().toLowerCase()

  if (!name || name.length < 1) throw new Error('Name is required')
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error('Valid email required')

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing && existing.id !== userId) throw new Error('Email already in use')

  await prisma.user.update({ where: { id: userId }, data: { name, email } })
  revalidatePath('/settings/profile')
}

/* ── Change password ────────────────────────────────────────────────────── */
export async function changePasswordAction(formData: FormData) {
  const userId = await getDemoUserId()
  const current = (formData.get('current') as string) ?? ''
  const next = (formData.get('new') as string) ?? ''
  const confirm = (formData.get('confirm') as string) ?? ''

  if (next.length < 8) throw new Error('Password must be at least 8 characters')
  if (next !== confirm) throw new Error('Passwords do not match')

  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user?.password) throw new Error('No password set on this account')

  const valid = await bcrypt.compare(current, user.password)
  if (!valid) throw new Error('Current password is incorrect')

  await prisma.user.update({
    where: { id: userId },
    data: { password: await bcrypt.hash(next, 12) },
  })
}
