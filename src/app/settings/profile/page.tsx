'use client'

import { useTransition } from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { toast } from 'sonner'
import { TopNav } from '@/components/nav/TopNav'
import { Card } from '@/components/ui/Card'
import { Icons } from '@/components/ui/Icons'
import { updateProfileAction, changePasswordAction } from '@/app/actions/finance'

function Field({
  id, label, type = 'text', placeholder, defaultValue, autoComplete,
}: {
  id: string; label: string; type?: string; placeholder: string; defaultValue?: string; autoComplete?: string
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-[11px] font-medium tracking-[0.12em] uppercase text-white/45 mb-2">
        {label}
      </label>
      <input
        id={id} name={id} type={type}
        defaultValue={defaultValue} placeholder={placeholder} autoComplete={autoComplete}
        className="w-full h-10 px-3 rounded-lg bg-white/[0.04] ring-1 ring-white/[0.08] text-bone text-[13.5px] placeholder:text-white/25 focus:outline-none focus:ring-white/[0.2] transition"
      />
    </div>
  )
}

export default function ProfilePage() {
  const { data: session, update } = useSession()
  const [profilePending, startProfile] = useTransition()
  const [passwordPending, startPassword] = useTransition()

  function handleProfile(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    startProfile(async () => {
      try {
        await updateProfileAction(fd)
        await update() // refresh session with new name/email
        toast.success('Profile saved')
      } catch (err) {
        toast.error(err instanceof Error ? err.message : 'Failed to save')
      }
    })
  }

  function handlePassword(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const fd = new FormData(form)
    startPassword(async () => {
      try {
        await changePasswordAction(fd)
        toast.success('Password updated')
        form.reset()
      } catch (err) {
        toast.error(err instanceof Error ? err.message : 'Failed to update password')
      }
    })
  }

  return (
    <div className="min-h-screen bg-ink-950 grain">
      <TopNav />
      <main className="max-w-[600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 space-y-6 animate-enter">
        <div className="flex items-center gap-3">
          <Link href="/settings" className="text-white/40 hover:text-bone transition">
            {Icons.arrowLeft}
          </Link>
          <h1 className="font-serif text-bone text-[32px] leading-none italic">Profile.</h1>
        </div>

        {/* Avatar */}
        <Card className="p-6 flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#e9d7b8] to-[#a48962] text-ink-950 font-semibold text-[20px] flex items-center justify-center ring-2 ring-white/10">
            {(session?.user?.name ?? 'U').split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="text-[14px] font-medium text-bone">{session?.user?.name ?? '—'}</div>
            <div className="text-[12px] text-white/45 mt-0.5">{session?.user?.email ?? '—'}</div>
          </div>
        </Card>

        {/* Profile form */}
        <Card className="p-6">
          <h3 className="text-[14px] font-semibold text-bone mb-5">Personal information</h3>
          <form className="space-y-5" onSubmit={handleProfile}>
            <Field id="name" label="Full name" placeholder="Your name"
              defaultValue={session?.user?.name ?? ''} autoComplete="name" />
            <Field id="email" label="Email" type="email" placeholder="you@example.com"
              defaultValue={session?.user?.email ?? ''} autoComplete="email" />
            <div className="pt-1">
              <button type="submit" disabled={profilePending}
                className="h-10 px-5 rounded-lg bg-bone text-ink-950 font-semibold text-[13.5px] hover:bg-white transition disabled:opacity-50">
                {profilePending ? 'Saving…' : 'Save changes'}
              </button>
            </div>
          </form>
        </Card>

        {/* Password form */}
        <Card className="p-6">
          <h3 className="text-[14px] font-semibold text-bone mb-5">Change password</h3>
          <form className="space-y-4" onSubmit={handlePassword}>
            <Field id="current" label="Current password" type="password"
              placeholder="••••••••" autoComplete="current-password" />
            <Field id="new" label="New password" type="password"
              placeholder="8+ characters" autoComplete="new-password" />
            <Field id="confirm" label="Confirm new password" type="password"
              placeholder="••••••••" autoComplete="new-password" />
            <button type="submit" disabled={passwordPending}
              className="h-10 px-5 rounded-lg bg-white/[0.06] ring-1 ring-white/[0.1] text-bone font-semibold text-[13.5px] hover:bg-white/[0.1] transition disabled:opacity-50">
              {passwordPending ? 'Updating…' : 'Update password'}
            </button>
          </form>
        </Card>
      </main>
    </div>
  )
}
