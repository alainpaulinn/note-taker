import type React from "react"
import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { auth } from "@/auth"
import { ThemeProvider } from "@/components/theme-provider"
import { NotebookProvider } from "@/components/notebook-context"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader, HeaderProvider } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { ClientProviders } from "@/components/ui/client-providers"
import { BRAND } from "@/lib/branding"

export const metadata: Metadata = {
  title: `${BRAND.name} Workspace`,
  description: "Plan by date, capture brainstorming sketches, and keep every knowledge stream in sync.",
}

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  // Check if user exists
  if (!session?.user) {
    redirect('/signin')
  }

  return (
    <ClientProviders session={session}>
      <ThemeProvider 
        attribute="class" 
        defaultTheme="dark" 
        enableSystem 
        disableTransitionOnChange
      >
        <NotebookProvider>
          <HeaderProvider>
            <SidebarProvider>
              <AppSidebar variant="inset" />
              <SidebarInset className="flex flex-col min-w-0">
                <SiteHeader />
                <div className="flex flex-1 flex-col min-w-0 pt-16">
                  <div className="@container/main flex flex-1 flex-col gap-4 p-2">
                    {children}
                  </div>
                </div>
              </SidebarInset>
            </SidebarProvider>
          </HeaderProvider>
        </NotebookProvider>
      </ThemeProvider>
    </ClientProviders>
  )
}
