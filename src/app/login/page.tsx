import Link from 'next/link'
import { LoginForm } from './LoginForm'
import { VaultrLogo } from '@/components/nav/TopNav'

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-ink-950 grain flex flex-col items-center justify-center px-4">
      {/* Brand */}
      <Link href="/" className="flex items-center gap-2.5 mb-10">
        <VaultrLogo size={32} />
        <span className="font-semibold text-bone text-[20px] tracking-[-0.02em]">Vaultr</span>
      </Link>

      <div className="w-full max-w-sm">
        <div className="card rounded-2xl ring-soft p-8">
          <h1 className="font-serif text-bone text-[28px] italic mb-1">Welcome back.</h1>
          <p className="text-[13px] text-white/45 mb-7">Sign in to your portfolio.</p>
          <LoginForm />
          <p className="mt-6 text-center text-[12px] text-white/40">
            No account?{' '}
            <Link href="/signup" className="text-bone hover:text-white transition">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
