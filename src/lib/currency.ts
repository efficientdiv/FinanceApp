export type CurrencyCode = 'EUR' | 'USD' | 'GBP' | 'CHF'

export interface CurrencyDef {
  code: CurrencyCode
  symbol: string
  locale: string
  label: string
  flag: string
}

export const CURRENCIES: Record<CurrencyCode, CurrencyDef> = {
  EUR: { code: 'EUR', symbol: '€',  locale: 'en-US', label: 'Euro',           flag: '🇪🇺' },
  USD: { code: 'USD', symbol: '$',  locale: 'en-US', label: 'US Dollar',      flag: '🇺🇸' },
  GBP: { code: 'GBP', symbol: '£',  locale: 'en-GB', label: 'British Pound', flag: '🇬🇧' },
  CHF: { code: 'CHF', symbol: 'Fr', locale: 'de-CH', label: 'Swiss Franc',   flag: '🇨🇭' },
}

// FX rates relative to USD (base). All mock data is in USD.
export const FX_RATES: Record<CurrencyCode, number> = {
  USD: 1.000,
  EUR: 0.924,
  GBP: 0.789,
  CHF: 0.902,
}

export const CURRENCY_ORDER: CurrencyCode[] = ['EUR', 'USD', 'GBP', 'CHF']
export const DEFAULT_CURRENCY: CurrencyCode = 'EUR'

export function makeFmt(code: CurrencyCode, rate = FX_RATES[code]) {
  const { locale, symbol } = CURRENCIES[code]

  function fmt(n: number, opts: Intl.NumberFormatOptions = {}): string {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: code,
      maximumFractionDigits: 2,
      ...opts,
    }).format(n * rate)
  }

  function fmtK(n: number): string {
    const v = n * rate
    const sign = v < 0 ? '-' : ''
    const abs = Math.abs(v)
    if (abs >= 1e6) return sign + symbol + (abs / 1e6).toFixed(2) + 'M'
    if (abs >= 1e3) return sign + symbol + (abs / 1e3).toFixed(1) + 'k'
    return fmt(n, { maximumFractionDigits: 0 })
  }

  return { fmt, fmtK }
}
