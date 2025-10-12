import type React from "react"
import type { Metadata } from "next"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthNavigation } from "@/components/auth-navigation"
import { ClientProviders } from "@/components/ui/client-providers"

export const metadata: Metadata = {
  title: "Sign In - NoteMaster",
  description: "Sign in to your NoteMaster account to access your learning materials.",
}

export default function AuthLayout({
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
      <div className="min-h-screen bg-background">
        <AuthNavigation />
        <main className="pt-20">
          {children}
        </main>
      </div>
      <ClientProviders />
    </ThemeProvider>
  )
}