'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Icons } from '@/components/ui/Icons'

const ITEMS = [
  { href: '/', label: 'Home', icon: 'dash' as const },
  { href: '/accounts', label: 'Accounts', icon: 'wallet' as const },
  { href: '/transactions', label: 'Activity', icon: 'list' as const },
  { href: '/investments', label: 'Invest', icon: 'chart' as const },
  { href: '/settings', label: 'More', icon: 'settings' as const },
]

export function MobileNav() {
  const pathname = usePathname()

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 border-t border-white/[0.06] bg-ink-950/95 backdrop-blur-xl">
      <div className="flex items-center justify-around px-1 pt-2 pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))]">
        {ITEMS.map((it) => {
          const active = it.href === '/' ? pathname === '/' : pathname.startsWith(it.href)
          return (
            <Link
              key={it.href}
              href={it.href}
              className={`flex flex-col items-center gap-1 min-w-[52px] py-1 rounded-xl transition-colors ${
                active ? 'text-bone' : 'text-white/35 hover:text-white/65'
              }`}
            >
              <span className={`[&>svg]:w-5 [&>svg]:h-5 ${active ? 'opacity-100' : 'opacity-70'}`}>
                {Icons[it.icon]}
              </span>
              <span className={`text-[9.5px] font-medium tracking-wide ${active ? 'text-bone' : ''}`}>
                {it.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
