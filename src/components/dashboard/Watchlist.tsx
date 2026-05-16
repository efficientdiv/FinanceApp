'use client'

import { ResponsiveContainer, LineChart, Line } from 'recharts'
import Link from 'next/link'
import { Card } from '@/components/ui/Card'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Delta } from '@/components/ui/Delta'
import { Icons } from '@/components/ui/Icons'
import { WATCHLIST, type WatchlistTicker } from '@/lib/mock-data'
import { mulberry32 } from '@/lib/utils'

function MiniSpark({ chg, seed }: { chg: number; seed: number }) {
  const r = mulberry32(seed)
  const data: { v: number }[] = []
  let v = 100
  for (let i = 0; i < 24; i++) {
    v += (r() - 0.45) * 4 + (chg > 0 ? 0.6 : -0.55)
    data.push({ v })
  }
  return (
    <div className="h-7 w-16">
      <ResponsiveContainer>
        <LineChart data={data}>
          <Line
            type="monotone"
            dataKey="v"
            stroke={chg >= 0 ? '#3fb27f' : '#e26464'}
            strokeWidth={1.4}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

interface WatchlistProps {
  tickers?: WatchlistTicker[]
  lastUpdated?: string
}

export function Watchlist({ tickers = WATCHLIST, lastUpdated = '15:48 EST · Live' }: WatchlistProps) {
  return (
    <Card className="p-6">
      <SectionHeader
        eyebrow="Markets"
        title="Watchlist"
        action={
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-white/40 tnum">{lastUpdated}</span>
            <button className="w-7 h-7 rounded-md bg-white/[0.04] ring-1 ring-white/[0.06] text-white/60 hover:text-bone flex items-center justify-center">
              {Icons.plus}
            </button>
          </div>
        }
      />

      <div className="divide-y divide-white/[0.04]">
        {tickers.map((w, i) => (
          <Link
            key={w.sym}
            href={`/markets/${w.sym}`}
            className="hover-row grid grid-cols-[1fr_auto_auto] items-center gap-4 py-3 px-2 -mx-2 rounded-md transition cursor-pointer"
          >
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[13px] font-semibold text-bone tracking-tight">{w.sym}</span>
                <span className="text-[10.5px] text-white/40 truncate">{w.name}</span>
              </div>
              <div className="text-[10.5px] text-white/40 mt-0.5 tnum">Vol {w.vol}</div>
            </div>
            <MiniSpark chg={w.chg} seed={i + 11} />
            <div className="text-right min-w-[78px]">
              <div className="text-[13px] font-medium text-bone tnum">{w.price.toFixed(2)}</div>
              <Delta value={w.chg} digits={2} arrow={false} size="xs" />
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-white/[0.06] grid grid-cols-3 gap-2 text-center">
        <div>
          <div className="text-[10px] tracking-[0.14em] uppercase text-white/35 mb-1">S&amp;P 500</div>
          <div className="text-[13px] tnum text-bone">5,847.62</div>
          <div className="text-[11px] tnum text-gain">+0.42%</div>
        </div>
        <div className="border-x border-white/[0.06]">
          <div className="text-[10px] tracking-[0.14em] uppercase text-white/35 mb-1">Nasdaq</div>
          <div className="text-[13px] tnum text-bone">19,284.10</div>
          <div className="text-[11px] tnum text-gain">+0.71%</div>
        </div>
        <div>
          <div className="text-[10px] tracking-[0.14em] uppercase text-white/35 mb-1">10Y Yield</div>
          <div className="text-[13px] tnum text-bone">4.18%</div>
          <div className="text-[11px] tnum text-loss">-0.03</div>
        </div>
      </div>
    </Card>
  )
}
