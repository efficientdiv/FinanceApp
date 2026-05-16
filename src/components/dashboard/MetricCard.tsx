'use client'

import { ResponsiveContainer, LineChart, Line } from 'recharts'
import { Card } from '@/components/ui/Card'
import { Delta } from '@/components/ui/Delta'
import { Icons } from '@/components/ui/Icons'

interface MetricSparkProps {
  data: { v: number }[]
  color: string
}

function MetricSpark({ data, color }: MetricSparkProps) {
  return (
    <div className="h-10 w-24">
      <ResponsiveContainer>
        <LineChart data={data}>
          <Line
            type="monotone"
            dataKey="v"
            stroke={color}
            strokeWidth={1.5}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

interface MetricCardProps {
  label: string
  value: string
  delta: number
  sub: string
  sparkData: { v: number }[]
  sparkColor: string
  prefix?: string
  onClick?: () => void
}

export function MetricCard({
  label,
  value,
  delta,
  sub,
  sparkData,
  sparkColor,
  prefix = '',
  onClick,
}: MetricCardProps) {
  return (
    <Card
      className={`p-5 hover:ring-white/[0.1] card-hover transition ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-3">
        <span className="text-[11px] font-medium tracking-[0.14em] uppercase text-white/45">
          {label}
        </span>
        <div className="flex items-center gap-2">
          <Delta value={delta} digits={1} />
          {onClick && (
            <span className="text-white/20 hover:text-white/50 transition">{Icons.edit}</span>
          )}
        </div>
      </div>
      <div className="flex items-end justify-between gap-3">
        <div>
          <div className="text-[26px] font-semibold text-bone tnum num-shrink leading-none">
            {prefix}
            {value}
          </div>
          <div className="text-[11px] text-white/40 mt-2">{sub}</div>
        </div>
        <MetricSpark data={sparkData} color={sparkColor} />
      </div>
    </Card>
  )
}
