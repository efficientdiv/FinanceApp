import Link from 'next/link'
import { SignupForm } from './SignupForm'
import { VaultrLogo } from '@/components/nav/TopNav'

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-ink-950 grain flex flex-col items-center justify-center px-4">
      <Link href="/" className="flex items-center gap-2.5 mb-10">
        <VaultrLogo size={32} />
        <span className="font-semibold text-bone text-[20px] tracking-[-0.02em]">Vaultr</span>
      </Link>

      <div className="w-full max-w-sm">
        <div className="card rounded-2xl ring-soft p-8">
          <h1 className="font-serif text-bone text-[28px] italic mb-1">Create an account.</h1>
          <p className="text-[13px] text-white/45 mb-7">Start tracking your wealth today.</p>
          <SignupForm />
          <p className="mt-6 text-center text-[12px] text-white/40">
            Already have an account?{' '}
            <Link href="/login" className="text-bone hover:text-white transition">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
