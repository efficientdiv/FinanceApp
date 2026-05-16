'use client'

import { createContext, useContext, useEffect, useState, useMemo } from 'react'
import { CURRENCIES, CURRENCY_ORDER, DEFAULT_CURRENCY, makeFmt, type CurrencyCode } from '@/lib/currency'

interface CurrencyContextValue {
  currency: CurrencyCode
  setCurrency: (c: CurrencyCode) => void
  fmt: (n: number, opts?: Intl.NumberFormatOptions) => string
  fmtK: (n: number) => string
  symbol: string
}

const CurrencyContext = createContext<CurrencyContextValue>({
  currency: DEFAULT_CURRENCY,
  setCurrency: () => {},
  ...makeFmt(DEFAULT_CURRENCY),
  symbol: CURRENCIES[DEFAULT_CURRENCY].symbol,
})

export function useCurrency() {
  return useContext(CurrencyContext)
}

export { CURRENCIES, CURRENCY_ORDER }

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<CurrencyCode>(DEFAULT_CURRENCY)

  useEffect(() => {
    try {
      const saved = localStorage.getItem('vaultr-currency') as CurrencyCode | null
      if (saved && CURRENCIES[saved]) setCurrencyState(saved)
    } catch {}
  }, [])

  function setCurrency(c: CurrencyCode) {
    setCurrencyState(c)
    try { localStorage.setItem('vaultr-currency', c) } catch {}
  }

  const value = useMemo(() => ({
    currency,
    setCurrency,
    ...makeFmt(currency),
    symbol: CURRENCIES[currency].symbol,
  }), [currency]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  )
}
