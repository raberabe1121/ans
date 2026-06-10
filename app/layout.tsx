import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'ANS.dev — Agent Name Server',
  description: 'Discover products automatically registered from #ANS build-in-public posts.',
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  )
}
