'use client'

import { useState, useEffect } from 'react'
import { Command } from 'cmdk'
import { useRouter } from 'next/navigation'
import { Icons } from '@/components/ui/Icons'

const COMMANDS = [
  { label: 'Go to Overview', icon: 'dash', href: '/' },
  { label: 'Go to Accounts', icon: 'wallet', href: '/accounts' },
  { label: 'Go to Investments', icon: 'chart', href: '/investments' },
  { label: 'Go to Transactions', icon: 'list', href: '/transactions' },
  { label: 'Go to Goals', icon: 'goal', href: '/goals' },
  { label: 'Go to Budgets', icon: 'list', href: '/budgets' },
  { label: 'Settings', icon: 'settings', href: '/settings' },
] as const

export function CommandPalette() {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState('')
  const router = useRouter()

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((o) => !o)
      }
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh]"
      onClick={() => setOpen(false)}
    >
      <div className="absolute inset-0 bg-black/50" />
      <div
        className="relative w-full max-w-lg card rounded-2xl ring-soft shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <Command shouldFilter={true} value={value} onValueChange={setValue}>
          <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/[0.06]">
            <span className="text-white/40 shrink-0">{Icons.search}</span>
            <Command.Input
              autoFocus
              placeholder="Search transactions, go to page…"
              className="flex-1 bg-transparent text-bone text-[14px] placeholder:text-white/30 outline-none"
            />
            <kbd className="text-[10px] px-1.5 py-0.5 rounded border border-white/10 text-white/30">
              ESC
            </kbd>
          </div>
          <Command.List className="p-2 max-h-72 overflow-y-auto">
            <Command.Empty className="py-6 text-center text-[13px] text-white/40">
              No results found.
            </Command.Empty>

            <Command.Group heading={<span className="text-[10px] font-medium tracking-[0.12em] uppercase text-white/35 px-2">Navigation</span>}>
              {COMMANDS.map((cmd) => (
                <Command.Item
                  key={cmd.href}
                  value={cmd.label}
                  onSelect={() => {
                    router.push(cmd.href)
                    setOpen(false)
                  }}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer text-[13px] text-white/70 hover:text-bone data-[selected=true]:bg-white/[0.04] data-[selected=true]:text-bone transition"
                >
                  <span className="text-white/40">{Icons[cmd.icon]}</span>
                  {cmd.label}
                </Command.Item>
              ))}
            </Command.Group>
          </Command.List>
        </Command>
      </div>
    </div>
  )
}
