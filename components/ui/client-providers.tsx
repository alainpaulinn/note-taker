"use client"

import { SessionProvider } from "next-auth/react"
import { Toaster } from "@/components/ui/toaster"

interface ClientProvidersProps {
  children?: React.ReactNode
  session?: any
}

export function ClientProviders({ children, session }: ClientProvidersProps) {
  const content = (
    <>
      {children}
      <Toaster />
    </>
  )

  if (typeof session === "undefined") {
    return content
  }

  return (
    <SessionProvider session={session}>
      {content}
    </SessionProvider>
  )
} 
