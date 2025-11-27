import type { Metadata } from 'next'
import './globals.css'
import { LanguageProvider } from './i18n'

export const metadata: Metadata = {
  title: 'Slow Spot - Meditation Made Simple',
  description: 'A unique meditation app with personalized experiences, multi-language support, and progressive learning. No login required.',
  keywords: ['meditation', 'mindfulness', 'zen', 'relaxation', 'wellbeing', 'mental health'],
  authors: [{ name: 'Slow Spot Team' }],
  openGraph: {
    title: 'Slow Spot - Meditation Made Simple',
    description: 'Progressive meditation learning with no login required',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  )
}
