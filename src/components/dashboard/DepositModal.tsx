'use client'

import { useState } from 'react'
import { Modal } from '@/components/ui/Modal'
import { Icons } from '@/components/ui/Icons'
import { toast } from 'sonner'
import { ACCOUNTS } from '@/lib/mock-data'
import { useCurrency } from '@/components/providers/CurrencyProvider'

interface DepositModalProps {
  open: boolean
  onClose: () => void
}

type Direction = 'deposit' | 'withdraw'

export function DepositModal({ open, onClose }: DepositModalProps) {
  const [direction, setDirection] = useState<Direction>('deposit')
  const [amount, setAmount] = useState('')
  const [accountId, setAccountId] = useState(ACCOUNTS[0].id)
  const [loading, setLoading] = useState(false)

  const { fmt, symbol } = useCurrency()
  const parsed = parseFloat(amount.replace(/,/g, ''))
  const valid = !isNaN(parsed) && parsed > 0

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!valid) return
    setLoading(true)
    await new Promise((r) => setTimeout(r, 700))
    setLoading(false)
    toast.success(
      `${direction === 'deposit' ? 'Deposited' : 'Withdrew'} ${fmt(parsed)} successfully.`
    )
    setAmount('')
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose}>
      <div className="p-5 pb-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-[15px] font-semibold text-bone">Quick deposit</h2>
            <p className="text-[11.5px] text-white/40 mt-0.5">Move funds into your accounts</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-white/45 hover:text-bone flex items-center justify-center transition"
          >
            {Icons.close}
          </button>
        </div>

        {/* Direction toggle */}
        <div className="flex bg-white/[0.03] ring-1 ring-white/[0.06] rounded-lg p-0.5 mb-4">
          {(['deposit', 'withdraw'] as Direction[]).map((d) => (
            <button
              key={d}
              onClick={() => setDirection(d)}
              className={`flex-1 h-8 rounded-md text-[12.5px] font-medium capitalize transition ${
                direction === d ? 'seg-active' : 'text-white/40 hover:text-white/65'
              }`}
            >
              {d}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Amount */}
          <div>
            <label className="block text-[10.5px] font-medium tracking-[0.12em] uppercase text-white/40 mb-1.5">
              Amount
            </label>
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

          {/* Account */}
          <div>
            <label className="block text-[10.5px] font-medium tracking-[0.12em] uppercase text-white/40 mb-1.5">
              {direction === 'deposit' ? 'To account' : 'From account'}
            </label>
            <select
              value={accountId}
              onChange={(e) => setAccountId(e.target.value)}
              className="w-full h-10 px-3 rounded-lg bg-white/[0.04] ring-1 ring-white/[0.08] text-bone text-[13px] focus:outline-none focus:ring-white/[0.2] transition appearance-none"
            >
              {ACCOUNTS.map((a) => (
                <option key={a.id} value={a.id} style={{ background: '#0d0d10' }}>
                  {a.name} — {fmt(a.bal, { maximumFractionDigits: 0 })}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={!valid || loading}
            className="w-full h-10 rounded-lg bg-bone text-ink-950 font-semibold text-[13px] hover:bg-white transition disabled:opacity-40 mt-1 active:scale-[0.98]"
          >
            {loading
              ? 'Processing…'
              : `${direction === 'deposit' ? 'Deposit' : 'Withdraw'}${valid ? ` ${fmt(parsed)}` : ''}`}
          </button>
        </form>
      </div>
    </Modal>
  )
}
