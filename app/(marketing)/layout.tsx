import type React from "react"
import type { Metadata } from "next"
import { ThemeProvider } from "@/components/theme-provider"
import { MarketingNavigation } from "@/components/marketing-navigation"
import { Footer } from "@/components/footer"
import { ClientProviders } from "@/components/ui/client-providers"

export const metadata: Metadata = {
  title: "A-notes - Your Personal Learning Companion",
  description: "Organize your learning materials, take rich notes, and create visual diagrams with A-notes. The ultimate note-taking platform for students, professionals, and lifelong learners.",
  keywords: ["note taking", "learning", "education", "study", "notes", "diagrams", "visual learning"],
  authors: [{ name: "A-notes Team" }],
  openGraph: {
    title: "A-notes - Your Personal Learning Companion",
    description: "Organize your learning materials, take rich notes, and create visual diagrams with A-notes.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "A-notes - Your Personal Learning Companion",
    description: "Organize your learning materials, take rich notes, and create visual diagrams with A-notes.",
  },
}

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <div className="flex min-h-screen flex-col">
        <MarketingNavigation />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </div>
      <ClientProviders />
    </ThemeProvider>
  )
}
