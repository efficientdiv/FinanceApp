'use client'

import { useState } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Icons } from '@/components/ui/Icons'
import { toast } from 'sonner'
import { ACCOUNTS } from '@/lib/mock-data'
import { useCurrency } from '@/components/providers/CurrencyProvider'

interface TransferModalProps {
  open: boolean
  onClose: () => void
}

export function TransferModal({ open, onClose }: TransferModalProps) {
  const [fromId, setFromId] = useState(ACCOUNTS[0].id)
  const [toId, setToId] = useState(ACCOUNTS[1].id)
  const [amount, setAmount] = useState('')
  const [note, setNote] = useState('')
  const [loading, setLoading] = useState(false)

  const { fmt, symbol } = useCurrency()
  const parsed = parseFloat(amount.replace(/,/g, ''))
  const valid = !isNaN(parsed) && parsed > 0 && fromId !== toId

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!valid) return
    setLoading(true)
    await new Promise((r) => setTimeout(r, 800))
    setLoading(false)
    const from = ACCOUNTS.find((a) => a.id === fromId)
    const to = ACCOUNTS.find((a) => a.id === toId)
    toast.success(`Transferred ${fmt(parsed)} from ${from?.name} to ${to?.name}.`)
    setAmount('')
    setNote('')
    onClose()
  }

  const selectClass =
    'w-full h-10 px-3 rounded-lg bg-white/[0.04] ring-1 ring-white/[0.08] text-bone text-[13px] focus:outline-none focus:ring-white/[0.2] transition appearance-none'
  const labelClass =
    'block text-[10.5px] font-medium tracking-[0.12em] uppercase text-white/40 mb-1.5'

  return (
    <Modal open={open} onClose={onClose}>
      <div className="p-5 pb-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-[15px] font-semibold text-bone">Move money</h2>
            <p className="text-[11.5px] text-white/40 mt-0.5">Transfer between your accounts</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-white/45 hover:text-bone flex items-center justify-center transition"
          >
            {Icons.close}
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-[1fr_auto_1fr] items-end gap-2">
            <div>
              <label className={labelClass}>From</label>
              <select
                value={fromId}
                onChange={(e) => setFromId(e.target.value)}
                className={selectClass}
              >
                {ACCOUNTS.map((a) => (
                  <option key={a.id} value={a.id} style={{ background: '#0d0d10' }}>
                    {a.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="pb-[2px] text-white/30">{Icons.repeat}</div>
            <div>
              <label className={labelClass}>To</label>
              <select
                value={toId}
                onChange={(e) => setToId(e.target.value)}
                className={selectClass}
              >
                {ACCOUNTS.map((a) => (
                  <option key={a.id} value={a.id} style={{ background: '#0d0d10' }}>
                    {a.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {fromId === toId && (
            <p className="text-[11.5px] text-loss">From and To accounts must be different.</p>
          )}

          <div>
            <label className={labelClass}>Amount</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/35 text-[13px]">{symbol}</span>
              <input
                type="number"
                min="0.01"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full h-10 pl-7 pr-3 rounded-lg bg-white/[0.04] ring-1 ring-white/[0.08] text-bone text-[13.5px] tnum placeholder:text-white/20 focus:outline-none focus:ring-white/[0.2] transition"
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>Note <span className="normal-case text-white/25">(optional)</span></label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              maxLength={80}
              placeholder="e.g. Monthly savings"
              className="w-full h-10 px-3 rounded-lg bg-white/[0.04] ring-1 ring-white/[0.08] text-bone text-[13px] placeholder:text-white/20 focus:outline-none focus:ring-white/[0.2] transition"
            />
          </div>

          <button
            type="submit"
            disabled={!valid || loading}
            className="w-full h-10 rounded-lg bg-bone text-ink-950 font-semibold text-[13px] hover:bg-white transition disabled:opacity-40 mt-1 active:scale-[0.98]"
          >
            {loading ? 'Processing…' : `Transfer${valid ? ` ${fmt(parsed)}` : ''}`}
          </button>
        </form>
      </div>
    </Modal>
  )
}
