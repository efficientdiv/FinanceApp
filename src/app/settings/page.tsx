
import Link from 'next/link'
import { TopNav } from '@/components/nav/TopNav'
import { Card } from '@/components/ui/Card'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Icons } from '@/components/ui/Icons'
import { getDemoUserId } from '@/lib/data'
import { prisma } from '@/lib/prisma'

export default async function SettingsPage() {
  const userId = await getDemoUserId()
  const user = await prisma.user.findUnique({ where: { id: userId } })

  const SETTINGS_SECTIONS = [
    { href: '/settings/profile', label: 'Profile & account', icon: Icons.user, desc: 'Name, email, password' },
    { href: '/accounts', label: 'Linked institutions', icon: Icons.wallet, desc: 'Manage connected banks & brokerages' },
    { href: '/budgets', label: 'Categories & budgets', icon: Icons.list, desc: 'Edit categories, set monthly limits' },
  ]

  return (
    <div className="min-h-screen bg-ink-950 grain">
      <TopNav />
      <main className="max-w-[800px] mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 space-y-6">
        <div>
          <div className="text-[11px] font-medium tracking-[0.18em] uppercase text-white/40 mb-1.5">
            Settings
          </div>
          <h1 className="font-serif text-bone text-[36px] leading-none italic">
            Preferences.
          </h1>
        </div>

        <Card className="overflow-hidden">
          <div className="p-6 border-b border-white/[0.06] flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#e9d7b8] to-[#a48962] text-ink-950 font-semibold text-[16px] flex items-center justify-center">
              {user?.name?.split(' ').map((n) => n[0]).join('').slice(0, 2)}
            </div>
            <div>
              <div className="text-[15px] font-semibold text-bone">{user?.name}</div>
              <div className="text-[12px] text-white/45">{user?.email}</div>
            </div>
          </div>
          <div className="divide-y divide-white/[0.06]">
            {SETTINGS_SECTIONS.map((s) => (
              <Link
                key={s.href}
                href={s.href}
                className="hover-row flex items-center gap-4 p-5 transition"
              >
                <span className="text-white/50">{s.icon}</span>
                <div className="flex-1">
                  <div className="text-[13.5px] font-medium text-bone">{s.label}</div>
                  <div className="text-[11.5px] text-white/40 mt-0.5">{s.desc}</div>
                </div>
                <span className="text-white/30">{Icons.arrowUpRight}</span>
              </Link>
            ))}
          </div>
        </Card>

      </main>
    </div>
  )
}
