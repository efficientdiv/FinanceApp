'use client'

import { useState } from 'react'
import { Icons } from '@/components/ui/Icons'
import { TransferModal } from './TransferModal'

export function DashboardActions() {
  const [transferOpen, setTransferOpen] = useState(false)

  return (
    <>
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => setTransferOpen(true)}
          className="hidden sm:flex h-9 px-3.5 rounded-lg bg-white/[0.03] ring-1 ring-white/[0.06] text-white/65 hover:text-bone hover:bg-white/[0.05] text-[12.5px] font-medium items-center gap-2 transition active:scale-[0.97]"
        >
          Move money
        </button>
        <button className="hidden sm:flex h-9 px-3.5 rounded-lg bg-white/[0.03] ring-1 ring-white/[0.06] text-white/65 hover:text-bone hover:bg-white/[0.05] text-[12.5px] font-medium items-center gap-2 transition active:scale-[0.97]">
          Pay bill
        </button>
        <button
          onClick={() => setTransferOpen(true)}
          className="h-9 px-3.5 rounded-lg bg-bone text-ink-950 hover:bg-white text-[12.5px] font-semibold flex items-center gap-2 transition active:scale-[0.97]"
        >
          {Icons.plus} New transfer
        </button>
      </div>

      <TransferModal open={transferOpen} onClose={() => setTransferOpen(false)} />
    </>
  )
}
