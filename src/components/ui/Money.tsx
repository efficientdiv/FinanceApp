'use client'

import { useCurrency } from '@/components/providers/CurrencyProvider'

interface MoneyProps {
  value: number
  opts?: Intl.NumberFormatOptions
  compact?: boolean
}

export function Money({ value, opts, compact }: MoneyProps) {
  const { fmt, fmtK } = useCurrency()
  return <>{compact ? fmtK(value) : fmt(value, opts)}</>
}
