import type { Metadata, Viewport } from 'next'
import { Fraunces, Manrope } from 'next/font/google'

import './globals.css'

// latin-ext carries ě š č ř ž ů — without it Czech falls back mid-word.
const body = Manrope({ subsets: ['latin', 'latin-ext'], variable: '--font-body', display: 'swap' })
const heading = Fraunces({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-heading',
  display: 'swap',
  weight: ['500', '600'],
})

export const metadata: Metadata = {
  title: 'Weby pro realitní makléře',
  description:
    'Vyberte si šablonu, nastavte barvy a sekce a podívejte se, jak bude váš realitní web vypadat. Spuštění na vaší vlastní doméně.',
}

export const viewport: Viewport = { themeColor: '#f6f4ef' }

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="cs" className={`${body.variable} ${heading.variable}`}>
      <body>{children}</body>
    </html>
  )
}
