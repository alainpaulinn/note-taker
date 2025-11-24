import type React from "react"
import { redirect } from "next/navigation"
import { auth } from "@/auth"
import { ThemeProvider } from "@/components/theme-provider"
import { ClientProviders } from "@/components/ui/client-providers"
import { NotebookProvider } from "@/components/notebook-context"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader, HeaderProvider } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { GlobalQuickNoteDock } from "@/components/global-quick-note-dock"

export default async function HomeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  if (!session?.user) {
    redirect("/signin")
  }

  return (
    <ClientProviders session={session}>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
        <NotebookProvider>
          <HeaderProvider>
            <SidebarProvider>
              <AppSidebar variant="inset" />
              <SidebarInset className="flex min-w-0 flex-col">
                <SiteHeader />
                <div className="flex min-h-0 min-w-0 flex-col gap-4 h-[calc(100vh-1rem)]">
                  <div className="flex flex-1 min-h-0 flex-col gap-4 p-2">
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
