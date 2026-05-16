import { notFound } from 'next/navigation'

import Link from 'next/link'
import { TopNav } from '@/components/nav/TopNav'
import { Card } from '@/components/ui/Card'
import { Icons } from '@/components/ui/Icons'
import { Delta } from '@/components/ui/Delta'
import { getQuote } from '@/lib/market-data'

interface Params {
  params: Promise<{ symbol: string }>
}

export default async function MarketDetailPage({ params }: Params) {
  const { symbol } = await params
  const quote = await getQuote(symbol.toUpperCase())

  if (!quote.price) notFound()

  return (
    <div className="min-h-screen bg-ink-950 grain">
      <TopNav />
      <main className="max-w-[1480px] mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 space-y-6">
        <div className="flex items-center gap-3">
          <Link href="/investments" className="text-white/40 hover:text-bone transition">
            {Icons.arrowLeft}
          </Link>
          <div>
            <h1 className="font-serif text-bone text-[36px] leading-none italic">
              {quote.symbol}
            </h1>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-5">
            <div className="text-[11px] font-medium tracking-[0.14em] uppercase text-white/45 mb-2">
              Price
            </div>
            <div className="font-serif text-bone text-[32px] tnum leading-none">
              {quote.price.toFixed(2)}
            </div>
          </Card>
          <Card className="p-5">
            <div className="text-[11px] font-medium tracking-[0.14em] uppercase text-white/45 mb-2">
              Change
            </div>
            <div className="flex items-baseline gap-2">
              <Delta value={quote.changePct} size="lg" />
              <span className={`text-[20px] tnum font-medium ${quote.change >= 0 ? 'text-gain' : 'text-loss'}`}>
                {quote.change >= 0 ? '+' : ''}{quote.change.toFixed(2)}
              </span>
            </div>
          </Card>
          <Card className="p-5">
            <div className="text-[11px] font-medium tracking-[0.14em] uppercase text-white/45 mb-2">
              Volume
            </div>
            <div className="text-bone text-[24px] font-semibold tnum">{quote.volume}</div>
          </Card>
        </div>

        <Card className="p-6">
          <p className="text-[13px] text-white/50 text-center py-8">
            Full chart available after connecting a market data API key (FINNHUB_API_KEY).
          </p>
        </Card>
      </main>
    </div>
  )
}
