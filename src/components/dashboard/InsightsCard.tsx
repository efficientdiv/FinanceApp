'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card } from '@/components/ui/Card'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Icons } from '@/components/ui/Icons'
import { makeInsights, type Insight } from '@/lib/mock-data'
import { useCurrency } from '@/components/providers/CurrencyProvider'
import { cn } from '@/lib/utils'

const TONE_CLASSES: Record<Insight['tone'], string> = {
  amber: 'bg-amber-400/[0.07] text-amber-300/80 border-amber-400/20',
  bone: 'bg-white/[0.05] text-white/70 border-white/10',
}

interface InsightsCardProps {
  insights?: Insight[]
}

export function InsightsCard({ insights }: InsightsCardProps) {
  const { fmt, fmtK } = useCurrency()
  const defaultInsights = makeInsights(fmtK, fmt)
  const [dismissed, setDismissed] = useState<number[]>([])
  const resolvedInsights = insights ?? defaultInsights
  const visible = resolvedInsights.filter((_, i) => !dismissed.includes(i))

  return (
    <Card className="p-6">
      <SectionHeader
        eyebrow="For your review"
        title="Insights & opportunities"
        action={
          <button className="text-[11px] text-white/45 hover:text-bone flex items-center gap-1">
            See all 7 {Icons.arrowUpRight}
          </button>
        }
      />
      <div className="space-y-3">
        {visible.map((it, i) => (
          <div
            key={i}
            className="group flex items-start gap-4 p-4 rounded-xl bg-white/[0.02] ring-1 ring-white/[0.05] hover:ring-white/[0.1] transition"
          >
            <div
              className={cn(
                'text-[9.5px] tracking-[0.14em] uppercase px-2 py-1 rounded border shrink-0',
                TONE_CLASSES[it.tone]
              )}
            >
              {it.tag}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[13.5px] font-medium text-bone leading-snug">{it.title}</div>
              <div className="text-[12px] text-white/50 mt-1 leading-relaxed">{it.body}</div>
            </div>
            <div className="flex items-center gap-2 shrink-0 self-center">
              <button className="text-[11.5px] text-bone/80 hover:text-bone flex items-center gap-1 opacity-70 group-hover:opacity-100 transition">
                {it.cta} {Icons.arrowUpRight}
              </button>
              <button
                onClick={() => setDismissed((d) => [...d, resolvedInsights.indexOf(it)])}
                className="w-6 h-6 rounded flex items-center justify-center text-white/30 hover:text-white/70 opacity-0 group-hover:opacity-100 transition"
                aria-label="Dismiss insight"
              >
                {Icons.close}
              </button>
            </div>
          </div>
        ))}
        {visible.length === 0 && (
          <p className="text-center text-[13px] text-white/30 py-6">All insights reviewed.</p>
        )}
      </div>
    </Card>
  )
}
