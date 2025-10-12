import type React from "react"
import { Inter } from "next/font/google"
import { ClientProviders } from "@/components/ui/client-providers"
import { ThemeProvider } from "@/components/theme-provider"

import './globals.css'

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
        <ClientProviders />
      </body>
    </html>
  )
}

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  generator: 'v0.dev',
  title: 'NoteMaster - Your Personal Learning Companion',
  description: 'Organize your learning materials, take rich notes, and create visual diagrams with NoteMaster. The ultimate note-taking platform for students, professionals, and lifelong learners.',
  keywords: ['note taking', 'learning', 'education', 'study', 'notes', 'diagrams', 'visual learning'],
  authors: [{ name: 'NoteMaster Team' }],
  icons: {
    icon: [
      { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/favicon.ico',
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      {
        rel: 'mask-icon',
        url: '/favicon.svg',
        color: '#3b82f6',
      },
    ],
  },
  manifest: '/site.webmanifest',
  appleWebApp: {
    title: 'NoteMaster',
    statusBarStyle: 'default',
    capable: true,
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: 'website',
    siteName: 'NoteMaster',
    title: 'NoteMaster - Your Personal Learning Companion',
    description: 'Organize your learning materials, take rich notes, and create visual diagrams with NoteMaster.',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'NoteMaster Logo',
      },
    ],
  },
  twitter: {
    card: 'summary',
    title: 'NoteMaster',
    description: 'Organize your learning materials, take rich notes, and create visual diagrams with NoteMaster.',
    images: ['/logo.png'],
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0f172a' },
  ],
};
