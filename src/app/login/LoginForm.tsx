'use client'

import { useState, useActionState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'

type FormState = { error?: string } | null

function AuthInput({
  id,
  name,
  type,
  label,
  placeholder,
  autoComplete,
}: {
  id: string
  name: string
  type: string
  label: string
  placeholder: string
  autoComplete?: string
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-[11px] font-medium tracking-[0.12em] uppercase text-white/45 mb-2">
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        autoComplete={autoComplete}
        placeholder={placeholder}
        required
        className="w-full h-10 px-3 rounded-lg bg-white/[0.04] ring-1 ring-white/[0.08] text-bone text-[13.5px] placeholder:text-white/25 focus:outline-none focus:ring-white/[0.2] transition"
      />
    </div>
  )
}

export function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') ?? '/'
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const fd = new FormData(e.currentTarget)
    const result = await signIn('credentials', {
      email: fd.get('email') as string,
      password: fd.get('password') as string,
      redirect: false,
    })
    setLoading(false)
    if (result?.error) {
      setError('Invalid email or password.')
    } else {
      router.push(callbackUrl)
      router.refresh()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <AuthInput id="email" name="email" type="email" label="Email" placeholder="you@example.com" autoComplete="email" />
      <AuthInput id="password" name="password" type="password" label="Password" placeholder="••••••••" autoComplete="current-password" />

      {error && (
        <p className="text-[12px] text-loss">{error}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full h-10 rounded-lg bg-bone text-ink-950 font-semibold text-[13.5px] hover:bg-white transition disabled:opacity-50"
      >
        {loading ? 'Signing in…' : 'Sign in'}
      </button>

      <div className="relative flex items-center gap-3 text-white/20 text-[11px] my-2">
        <div className="flex-1 h-px bg-white/[0.06]" />
        <span>or continue with</span>
        <div className="flex-1 h-px bg-white/[0.06]" />
      </div>

      <button
        type="button"
        onClick={() => signIn('github', { callbackUrl })}
        className="w-full h-10 rounded-lg bg-white/[0.04] ring-1 ring-white/[0.08] text-white/70 hover:text-bone text-[13px] font-medium transition flex items-center justify-center gap-2"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
        </svg>
        GitHub
      </button>

      <div className="flex justify-center mt-2">
        <button
          type="button"
          onClick={() => {
            const email = document.getElementById('email') as HTMLInputElement | null
            const password = document.getElementById('password') as HTMLInputElement | null
            if (email) email.value = 'eleanor@luxfinance.demo'
            if (password) password.value = 'demo1234!'
          }}
          className="text-[11px] text-white/30 hover:text-white/60 border border-white/[0.08] hover:border-white/[0.16] px-3 py-1 rounded-md transition"
        >
          Use demo credentials
        </button>
      </div>
    </form>
  )
}
