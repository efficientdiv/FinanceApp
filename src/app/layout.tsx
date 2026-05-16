import type { Metadata } from 'next'
import { Inter, Instrument_Serif, JetBrains_Mono } from 'next/font/google'
import { Toaster } from '@/components/providers/Toaster'
import { CommandPalette } from '@/components/providers/CommandPalette'
import { SessionProvider } from '@/components/providers/SessionProvider'
import { ThemeProvider } from '@/components/providers/ThemeProvider'
import { CurrencyProvider } from '@/components/providers/CurrencyProvider'
import { MobileNav } from '@/components/nav/MobileNav'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: ['400'],
  style: ['normal', 'italic'],
  variable: '--font-instrument-serif',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Vaultr — Portfolio',
  description: 'Personal finance dashboard',
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${instrumentSerif.variable} ${jetbrainsMono.variable} h-full`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{if(localStorage.getItem('vaultr-theme')==='light')document.documentElement.classList.add('light')}catch(e){}`,
          }}
        />
      </head>
      <body className="min-h-full bg-ink-950 antialiased pb-[72px] md:pb-0">
        <ThemeProvider>
          <CurrencyProvider>
          <SessionProvider>
            {children}
            <MobileNav />
            <Toaster />
            <CommandPalette />
          </SessionProvider>
          </CurrencyProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
