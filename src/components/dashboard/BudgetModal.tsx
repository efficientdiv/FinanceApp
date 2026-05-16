'use client'

import { useState, useEffect } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Icons } from '@/components/ui/Icons'
import { toast } from 'sonner'
import { useCurrency } from '@/components/providers/CurrencyProvider'

export interface BudgetTarget {
  label: string
  current: string
  unit: 'usd' | 'pct'
  defaultTarget: number
}

interface BudgetModalProps {
  target: BudgetTarget | null
  onClose: () => void
}

export function BudgetModal({ target, onClose }: BudgetModalProps) {
  const [value, setValue] = useState('')
  const [loading, setLoading] = useState(false)
  const { symbol } = useCurrency()

  useEffect(() => {
    if (target) setValue(String(target.defaultTarget))
  }, [target])

  const parsed = parseFloat(value.replace(/,/g, ''))
  const valid = !isNaN(parsed) && parsed > 0

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!valid || !target) return
    setLoading(true)
    await new Promise((r) => setTimeout(r, 600))
    setLoading(false)
    toast.success(`Target updated for ${target.label}.`)
    onClose()
  }

  return (
    <Modal open={!!target} onClose={onClose}>
      <div className="p-5 pb-6">
        <div className="flex items-start justify-between mb-5">
          <div>
            <h2 className="text-[15px] font-semibold text-bone">Set target</h2>
            <p className="text-[11.5px] text-white/40 mt-0.5">{target?.label}</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-white/45 hover:text-bone flex items-center justify-center transition shrink-0"
          >
            {Icons.close}
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-[10.5px] font-medium tracking-[0.12em] uppercase text-white/40 mb-1.5">
              Monthly target
            </label>
            <div className="relative">
              {target?.unit === 'usd' && (
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/35 text-[13px]">{symbol}</span>
              )}
              <input
                type="number"
                min="0"
                step={target?.unit === 'pct' ? '0.1' : '1'}
                max={target?.unit === 'pct' ? '100' : undefined}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className={`w-full h-10 ${target?.unit === 'usd' ? 'pl-7' : 'pl-3'} pr-10 rounded-lg bg-white/[0.04] ring-1 ring-white/[0.08] text-bone text-[13.5px] tnum focus:outline-none focus:ring-white/[0.2] transition`}
              />
              {target?.unit === 'pct' && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-white/35 text-[13px]">%</span>
              )}
            </div>
          </div>

          {/* Current vs target comparison */}
          {target && (
            <div className="flex items-center justify-between py-2.5 px-3 rounded-lg bg-white/[0.02] ring-1 ring-white/[0.05]">
              <span className="text-[11.5px] text-white/40">Current</span>
              <span className="text-[12px] font-medium text-bone tnum">{target.current}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={!valid || loading}
            className="w-full h-10 rounded-lg bg-bone text-ink-950 font-semibold text-[13px] hover:bg-white transition disabled:opacity-40 active:scale-[0.98]"
          >
            {loading ? 'Saving…' : 'Save target'}
          </button>
        </form>
      </div>
    </Modal>
  )
}
