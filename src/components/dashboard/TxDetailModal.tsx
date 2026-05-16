'use client'

import { Modal } from '@/components/ui/Modal'
import { Icons, type IconKey } from '@/components/ui/Icons'
import { useCurrency } from '@/components/providers/CurrencyProvider'
import type { Transaction } from '@/lib/mock-data'

interface TxDetailModalProps {
  tx: Transaction | null
  onClose: () => void
}

function DetailRow({ label, value, valueClass = '' }: { label: string; value: string; valueClass?: string }) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-white/[0.05] last:border-0">
      <span className="text-[12px] text-white/40">{label}</span>
      <span className={`text-[12.5px] font-medium ${valueClass || 'text-bone'}`}>{value}</span>
    </div>
  )
}

export function TxDetailModal({ tx, onClose }: TxDetailModalProps) {
  const { fmt } = useCurrency()
  if (!tx) return null

  const isIncome = tx.amount > 0
  const iconKey = tx.icon as IconKey
  const dateStr = new Date(tx.date).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

  return (
    <Modal open={!!tx} onClose={onClose}>
      <div className="p-5 pb-6">
        {/* Header row */}
        <div className="flex items-start justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/[0.05] ring-1 ring-white/[0.08] flex items-center justify-center text-white/75 shrink-0">
              {Icons[iconKey] ?? Icons.briefcase}
            </div>
            <div>
              <div className="text-[14.5px] font-semibold text-bone leading-snug">{tx.merchant}</div>
              <div className="text-[11.5px] text-white/40 mt-0.5">{tx.cat}</div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-white/45 hover:text-bone flex items-center justify-center transition shrink-0"
            aria-label="Close"
          >
            {Icons.close}
          </button>
        </div>

        {/* Amount block */}
        <div className="text-center py-5 mb-5 bg-white/[0.02] rounded-xl ring-1 ring-white/[0.05]">
          <div className={`font-serif italic text-[38px] leading-none tnum ${isIncome ? 'text-gain' : 'text-bone'}`}>
            {isIncome ? '+' : ''}{fmt(tx.amount)}
          </div>
          <div className="text-[11.5px] text-white/40 mt-2">{dateStr}</div>
          {tx.status === 'pending' && (
            <span className="inline-block mt-2 text-[9.5px] tracking-[0.12em] uppercase px-2 py-0.5 rounded bg-amber-400/10 text-amber-300/80 border border-amber-400/20">
              Pending
            </span>
          )}
        </div>

        {/* Detail rows */}
        <div className="mb-5">
          <DetailRow label="Category" value={tx.cat} />
          <DetailRow label="Payment method" value={tx.method} />
          <DetailRow
            label="Status"
            value={tx.status === 'pending' ? 'Pending' : 'Completed'}
            valueClass={tx.status === 'pending' ? 'text-amber-300/80' : 'text-gain'}
          />
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button className="flex-1 h-9 rounded-lg bg-white/[0.04] ring-1 ring-white/[0.08] text-white/55 hover:text-bone text-[12px] font-medium transition active:scale-[0.97]">
            Add note
          </button>
          <button className="flex-1 h-9 rounded-lg bg-white/[0.04] ring-1 ring-white/[0.08] text-white/55 hover:text-bone text-[12px] font-medium transition active:scale-[0.97]">
            Flag transaction
          </button>
        </div>
      </div>
    </Modal>
  )
}
