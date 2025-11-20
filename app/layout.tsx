import type React from "react"
import { Inter } from "next/font/google"
import { ClientProviders } from "@/components/ui/client-providers"
import { ThemeProvider } from "@/components/theme-provider"
import { BRAND } from "@/lib/branding"

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
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  generator: "A-notes",
  title: `${BRAND.name} – Versatile Notes for Life`,
  description: BRAND.description,
  keywords: BRAND.meta.keywords,
  authors: [{ name: `${BRAND.name} Team` }],
  icons: {
    icon: [
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/favicon.ico",
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      {
        rel: "mask-icon",
        url: "/favicon.svg",
        color: BRAND.accent.primary,
      },
    ],
  },
  manifest: "/site.webmanifest",
  appleWebApp: {
    title: BRAND.name,
    statusBarStyle: "default",
    capable: true,
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: BRAND.name,
    title: `${BRAND.name} – Versatile Notes for Life`,
    description: BRAND.description,
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: `${BRAND.name} Logo`,
      },
    ],
  },
  twitter: {
    card: "summary",
    title: BRAND.name,
    description: BRAND.description,
    images: ["/logo.png"],
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
};
