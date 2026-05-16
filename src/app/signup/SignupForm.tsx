'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export function SignupForm() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const fd = new FormData(e.currentTarget)
    const name = fd.get('name') as string
    const email = fd.get('email') as string
    const password = fd.get('password') as string

    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    })
    const data = await res.json()
    if (!res.ok) {
      setError(data.error ?? 'Something went wrong.')
      setLoading(false)
      return
    }
    await signIn('credentials', { email, password, callbackUrl: '/' })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {[
        { id: 'name', name: 'name', type: 'text', label: 'Full name', placeholder: 'Eleanor Vance', autoComplete: 'name' },
        { id: 'email', name: 'email', type: 'email', label: 'Email', placeholder: 'you@example.com', autoComplete: 'email' },
        { id: 'password', name: 'password', type: 'password', label: 'Password', placeholder: '8+ characters', autoComplete: 'new-password' },
      ].map(({ id, name, type, label, placeholder, autoComplete }) => (
        <div key={id}>
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
            minLength={type === 'password' ? 8 : undefined}
            className="w-full h-10 px-3 rounded-lg bg-white/[0.04] ring-1 ring-white/[0.08] text-bone text-[13.5px] placeholder:text-white/25 focus:outline-none focus:ring-white/[0.2] transition"
          />
        </div>
      ))}

      {error && <p className="text-[12px] text-loss">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full h-10 rounded-lg bg-bone text-ink-950 font-semibold text-[13.5px] hover:bg-white transition disabled:opacity-50"
      >
        {loading ? 'Creating account…' : 'Create account'}
      </button>
    </form>
  )
}
