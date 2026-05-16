import 'server-only'

export interface QuoteData {
  symbol: string
  price: number
  change: number
  changePct: number
  volume: string
}

/* ── Finnhub quote ───────────────────────────────────────────────────────── */
async function fetchFinnhubQuote(symbol: string): Promise<QuoteData | null> {
  const apiKey = process.env.FINNHUB_API_KEY
  if (!apiKey) return null

  try {
    const r = await fetch(
      `https://finnhub.io/api/v1/quote?symbol=${encodeURIComponent(symbol)}&token=${apiKey}`,
      { next: { revalidate: 60 } }
    )
    if (!r.ok) return null
    const d = await r.json()
    if (!d.c) return null
    return {
      symbol,
      price: d.c,
      change: d.d,
      changePct: d.dp,
      volume: '—',
    }
  } catch {
    return null
  }
}

/* ── Cached quote lookup (falls back to mock if no API key) ─────────────── */
const MOCK_QUOTES: Record<string, QuoteData> = {
  NVDA: { symbol: 'NVDA', price: 1284.62, change: 30.25, changePct: 2.41, volume: '48.2M' },
  AAPL: { symbol: 'AAPL', price: 214.08, change: 1.74, changePct: 0.82, volume: '52.1M' },
  MSFT: { symbol: 'MSFT', price: 482.55, change: 5.44, changePct: 1.14, volume: '21.8M' },
  GOOGL: { symbol: 'GOOGL', price: 198.2, change: -0.92, changePct: -0.46, volume: '18.7M' },
  'BRK.B': { symbol: 'BRK.B', price: 468.91, change: 1.45, changePct: 0.31, volume: '3.9M' },
  VTI: { symbol: 'VTI', price: 298.74, change: -0.54, changePct: -0.18, volume: '4.2M' },
}

export async function getQuote(symbol: string): Promise<QuoteData> {
  const live = await fetchFinnhubQuote(symbol)
  if (live) return live
  return MOCK_QUOTES[symbol] ?? { symbol, price: 0, change: 0, changePct: 0, volume: '—' }
}

export async function getQuotes(symbols: string[]): Promise<QuoteData[]> {
  return Promise.all(symbols.map(getQuote))
}
