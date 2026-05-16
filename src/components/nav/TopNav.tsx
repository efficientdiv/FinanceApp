'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import { Icons } from '@/components/ui/Icons'
import { useTheme } from '@/components/providers/ThemeProvider'
import { useCurrency, CURRENCIES, CURRENCY_ORDER } from '@/components/providers/CurrencyProvider'

const NAV_ITEMS = [
  { key: 'overview', label: 'Overview', icon: 'dash' as const, href: '/' },
  { key: 'accounts', label: 'Accounts', icon: 'wallet' as const, href: '/accounts' },
  { key: 'investments', label: 'Investments', icon: 'chart' as const, href: '/investments' },
  { key: 'transactions', label: 'Transactions', icon: 'list' as const, href: '/transactions' },
  { key: 'goals', label: 'Goals', icon: 'goal' as const, href: '/goals' },
]

export function TopNav() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const { theme, toggle } = useTheme()
  const userName = session?.user?.name ?? 'User'
  const initials = userName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <header className="sticky top-0 z-20 border-b border-white/[0.06] bg-ink-950/80 backdrop-blur-xl">
      <div className="max-w-[1480px] mx-auto px-4 md:px-8 h-14 md:h-16 flex items-center gap-4 md:gap-10">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <VaultrLogo size={28} />
          <span className="font-semibold text-bone text-[17px] tracking-[-0.02em]">Vaultr</span>
        </Link>

        {/* Primary nav */}
        <nav className="hidden md:flex items-center gap-1 ml-2">
          {NAV_ITEMS.map((it) => {
            const active = it.href === '/' ? pathname === '/' : pathname.startsWith(it.href)
            return (
              <Link
                key={it.key}
                href={it.href}
                className={`nav-link flex items-center gap-2 px-3 h-9 rounded-lg text-[13px] font-medium ${
                  active ? 'text-bone bg-white/[0.04]' : 'text-white/55'
                }`}
              >
                <span className="opacity-80">{Icons[it.icon]}</span>
                {it.label}
              </Link>
            )
          })}
        </nav>

        <div className="flex-1" />

        {/* Search trigger */}
        <button
          className="hidden lg:flex items-center gap-2 px-3 h-9 rounded-lg bg-white/[0.03] ring-1 ring-white/[0.06] text-white/40 w-[260px] hover:ring-white/[0.12] transition overflow-hidden"
          onClick={() => document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }))}
          aria-label="Open command palette"
        >
          <span className="text-white/40 shrink-0">{Icons.search}</span>
          <span className="text-[13px] truncate min-w-0">Search transactions, tickers…</span>
          <span className="ml-auto shrink-0 text-[10px] tracking-wider px-1.5 py-0.5 rounded border border-white/10 text-white/40">
            ⌘ K
          </span>
        </button>

        {/* Right cluster */}
        <div className="flex items-center gap-1">
          <button className="hidden sm:flex w-9 h-9 rounded-lg items-center justify-center text-white/55 hover:text-bone hover:bg-white/[0.04] transition">
            {Icons.bell}
          </button>
          <button
            onClick={toggle}
            className="hidden sm:flex w-9 h-9 rounded-lg items-center justify-center text-white/55 hover:text-bone hover:bg-white/[0.04] transition"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? Icons.sun : Icons.moon}
          </button>
          <Link
            href="/settings"
            className="hidden sm:flex w-9 h-9 rounded-lg items-center justify-center text-white/55 hover:text-bone hover:bg-white/[0.04] transition"
          >
            {Icons.settings}
          </Link>
          <div className="hidden sm:block w-px h-6 bg-white/10 mx-1.5" />
          <div className="flex items-center gap-2 pr-1">
            <div className="hidden lg:block">
              <div className="text-[12px] font-medium text-bone leading-tight">{userName}</div>
            </div>
            <UserMenu initials={initials} userName={userName} userEmail={session?.user?.email ?? ''} />
          </div>
        </div>
      </div>
    </header>
  )
}

function UserMenu({ initials, userName, userEmail }: { initials: string; userName: string; userEmail: string }) {
  const { currency, setCurrency } = useCurrency()

  return (
    <div className="relative group">
      <button className="w-9 h-9 rounded-full bg-gradient-to-br from-[#e9d7b8] to-[#a48962] text-ink-950 font-semibold text-[12px] flex items-center justify-center ring-1 ring-white/10 hover:ring-white/20 transition">
        {initials}
      </button>
      <div className="absolute right-0 top-full mt-2 w-60 opacity-0 pointer-events-none group-focus-within:opacity-100 group-focus-within:pointer-events-auto transition-all translate-y-1 group-focus-within:translate-y-0 z-50 card rounded-xl ring-soft shadow-2xl py-1">
        <div className="px-3 py-2.5 border-b border-white/[0.06]">
          <div className="text-[12px] font-medium text-bone">{userName}</div>
          <div className="text-[11px] text-white/40 mt-0.5 truncate">{userEmail}</div>
        </div>
        <Link href="/settings/profile" className="flex items-center gap-2.5 px-3 py-2 text-[12.5px] text-white/70 hover:text-bone hover:bg-white/[0.03] transition">
          {Icons.user} Profile
        </Link>
        <Link href="/settings" className="flex items-center gap-2.5 px-3 py-2 text-[12.5px] text-white/70 hover:text-bone hover:bg-white/[0.03] transition">
          {Icons.settings} Settings
        </Link>

        {/* Currency picker */}
        <div className="border-t border-white/[0.06] mt-1 pt-1 px-3 py-2">
          <div className="text-[10px] font-medium tracking-[0.12em] uppercase text-white/35 mb-1.5">Currency</div>
          <div className="grid grid-cols-4 gap-1">
            {CURRENCY_ORDER.map((code) => {
              const c = CURRENCIES[code]
              return (
                <button
                  key={code}
                  onClick={() => setCurrency(code)}
                  className={`flex flex-col items-center gap-0.5 py-1.5 rounded-md text-[10px] font-medium transition ${
                    currency === code
                      ? 'bg-white/[0.08] text-bone'
                      : 'text-white/40 hover:text-white/70 hover:bg-white/[0.04]'
                  }`}
                >
                  <span className="text-[14px]">{c.flag}</span>
                  <span>{c.code}</span>
                </button>
              )
            })}
          </div>
        </div>

        <div className="border-t border-white/[0.06] pt-1">
          <button
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-[12.5px] text-white/70 hover:text-loss hover:bg-white/[0.03] transition"
          >
            {Icons.logOut} Sign out
          </button>
        </div>
      </div>
    </div>
  )
}

export function VaultrLogo({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-label="Vaultr">
      {/* Uses CSS vars so the logo automatically inverts in light mode */}
      <rect width="32" height="32" rx="7" fill="var(--color-bone)" />
      <path d="M9 9 L13 9 L16 23.5 Z" fill="var(--color-ink-950)" />
      <path d="M19 9 L21.5 9 L16 23.5 Z" fill="var(--color-ink-950)" />
    </svg>
  )
}
