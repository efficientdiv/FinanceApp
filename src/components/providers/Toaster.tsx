'use client'

import { Toaster as Sonner } from 'sonner'

export function Toaster() {
  return (
    <Sonner
      position="bottom-right"
      toastOptions={{
        style: {
          background: '#15151a',
          border: '1px solid rgba(236,233,225,0.08)',
          color: '#ece9e1',
          fontSize: '13px',
          fontFamily: 'var(--font-inter)',
          borderRadius: '12px',
        },
        classNames: {
          error: 'text-[#e26464]',
          success: 'text-[#3fb27f]',
        },
      }}
    />
  )
}
