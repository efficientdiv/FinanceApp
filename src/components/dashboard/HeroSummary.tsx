'use client'

import { useState, useMemo, useCallback } from 'react'
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts'
import { Card } from '@/components/ui/Card'
import { Icons } from '@/components/ui/Icons'
import { fmtDate } from '@/lib/utils'
import { PERIODS, sliceSeries, type SeriesPoint } from '@/lib/mock-data'
import { DepositModal } from './DepositModal'
import { useCurrency } from '@/components/providers/CurrencyProvider'

interface HeroSummaryProps {
  initialPeriod?: string
}

export function HeroSummary({ initialPeriod = '6M' }: HeroSummaryProps) {
  const [period, setPeriod] = useState(initialPeriod)
  const [hover, setHover] = useState<SeriesPoint | null>(null)
  const [depositOpen, setDepositOpen] = useState(false)
  const { fmt } = useCurrency()

  const data = useMemo(() => sliceSeries(period), [period])
  const first = data[0]?.value ?? 0
  const last = data[data.length - 1]?.value ?? 0
  const delta = last - first
  const pct = first ? (delta / first) * 100 : 0
  const positive = delta >= 0

  const displayValue = hover ? hover.value : last
  const displayDelta = hover ? hover.value - first : delta
  const displayPct = hover ? ((hover.value - first) / first) * 100 : pct

  const xTicks = useMemo(() => {
    if (!data.length) return []
    const n = data.length
    const idx = [0, Math.floor(n * 0.2), Math.floor(n * 0.4), Math.floor(n * 0.6), Math.floor(n * 0.8), n - 1]
    return idx.map((i) => data[i].date)
  }, [data])

  // Tooltip content as a stable callback so Recharts doesn't remount it
  const TooltipContent = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ({ active, payload, label }: any) => {
      if (!active || !payload?.length) return null
      return (
        <div
          className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg shadow-xl pointer-events-none"
          style={{
            background: 'var(--tooltip-bg, #16161a)',
            border: '1px solid rgba(236,233,225,0.13)',
          }}
        >
          <span className="text-[12.5px] font-semibold tnum text-bone">
            {fmt(payload[0].value)}
          </span>
          {label && (
            <span className="text-[10.5px] text-white/40">{fmtDate(label)}</span>
          )}
        </div>
      )
    },
    [fmt]
  )

  return (
    <Card className="overflow-hidden">
      <div className="p-7 pb-2">
        <div className="flex items-start justify-between flex-wrap gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-medium tracking-[0.18em] uppercase text-white/40">
                Total net worth
              </span>
              <span className="pulse-dot" />
              <span className="text-[10px] text-white/35">Live</span>
            </div>
            <div className="flex items-baseline gap-3 num-shrink">
              <span className="font-serif text-bone text-[62px] leading-none tnum">
                {fmt(displayValue, { maximumFractionDigits: 2 })}
              </span>
            </div>
            <div className="flex items-center gap-3 mt-3">
              <span className={`tnum text-sm font-medium ${positive ? 'text-gain' : 'text-loss'}`}>
                {positive ? Icons.arrowUpRight : Icons.arrowDownRight}
              </span>
              <span className={`tnum text-sm font-medium ${displayDelta >= 0 ? 'text-gain' : 'text-loss'}`}>
                {displayDelta >= 0 ? '+' : ''}{fmt(Math.abs(displayDelta))}
              </span>
              <span className={`tnum text-sm ${displayPct >= 0 ? 'text-gain' : 'text-loss'}`}>
                ({displayPct >= 0 ? '+' : ''}{displayPct.toFixed(2)}%)
              </span>
              <span className="text-xs text-white/40">
                {hover ? fmtDate(hover.date) : `past ${period}`}
              </span>
            </div>
          </div>

          {/* Period selector */}
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-white/[0.03] ring-1 ring-white/[0.06] rounded-lg p-0.5">
              {PERIODS.map((p) => (
                <button
                  key={p.key}
                  onClick={() => setPeriod(p.key)}
                  className={`px-3 h-7 rounded-md text-[12px] font-medium tnum transition ${
                    period === p.key ? 'seg-active' : 'text-white/45 hover:text-white/75'
                  }`}
                >
                  {p.key}
                </button>
              ))}
            </div>
            <button className="h-8 px-3 rounded-lg bg-white/[0.03] ring-1 ring-white/[0.06] text-white/55 hover:text-bone flex items-center gap-1.5 text-[12px] font-medium transition">
              {Icons.download} Export
            </button>
            <DepositButton onClick={() => setDepositOpen(true)} />
          </div>
        </div>
      </div>

      <DepositModal open={depositOpen} onClose={() => setDepositOpen(false)} />

      {/* Chart */}
      <div className="h-[260px] px-2 pb-2 -mt-2 select-none">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 24, right: 28, left: 24, bottom: 8 }}
            onMouseMove={(e: unknown) => {
              const ev = e as { activePayload?: { payload: SeriesPoint }[] }
              if (ev?.activePayload?.[0]) setHover(ev.activePayload[0].payload)
            }}
            onMouseLeave={() => setHover(null)}
          >
            <defs>
              <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={positive ? '#3fb27f' : '#e26464'} stopOpacity={0.22} />
                <stop offset="100%" stopColor={positive ? '#3fb27f' : '#e26464'} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="rgba(236,233,225,0.04)" strokeDasharray="0" vertical={false} />
            <XAxis
              dataKey="date"
              ticks={xTicks}
              tickLine={false}
              axisLine={false}
              tickFormatter={(d: string) =>
                new Date(d).toLocaleDateString('en-US', { month: 'short', year: '2-digit' })
              }
              tick={{ fill: '#6b6b76', fontSize: 11 }}
              dy={6}
              minTickGap={20}
            />
            <YAxis hide domain={['dataMin - 5000', 'dataMax + 5000']} />
            {/*
              position={{ y: 4 }} pins Y near the top of the chart area so
              the chip never overlaps the curve, and X auto-tracks the mouse.
              wrapperStyle outline:none removes the default focus ring.
            */}
            <Tooltip
              cursor={{ stroke: 'rgba(236,233,225,0.18)', strokeDasharray: '3 3' }}
              content={TooltipContent}
              position={{ y: 4 }}
              wrapperStyle={{ outline: 'none' }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke={positive ? '#3fb27f' : '#e26464'}
              strokeWidth={1.75}
              fill="url(#areaFill)"
              activeDot={{ r: 4, fill: positive ? '#3fb27f' : '#e26464', strokeWidth: 0 }}
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}

function DepositButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="h-8 px-3 rounded-lg bg-bone text-ink-950 hover:bg-white flex items-center gap-1.5 text-[12px] font-semibold transition active:scale-[0.97]"
    >
      {Icons.plus} Deposit
    </button>
  )
}
