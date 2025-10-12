"use client"

import * as React from "react"
import { Moon, Search, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { SearchCommand } from "@/components/search-command"
import { NotificationsSheet } from "@/components/notifications-sheet"

interface HeaderContextValue {
  title?: string
  description?: string
  actions?: React.ReactNode
  setHeader: (header: { title?: string; description?: string; actions?: React.ReactNode }) => void
}

const HeaderContext = React.createContext<HeaderContextValue | undefined>(undefined)

export function HeaderProvider({ children }: { children: React.ReactNode }) {
  const [title, setTitle] = React.useState<string>()
  const [description, setDescription] = React.useState<string>()
  const [actions, setActions] = React.useState<React.ReactNode>()

  const setHeader = React.useCallback((header: { title?: string; description?: string; actions?: React.ReactNode }) => {
    setTitle(header.title)
    setDescription(header.description)
    setActions(header.actions)
  }, [])

  const value = React.useMemo(() => ({
    title,
    description,
    actions,
    setHeader
  }), [title, description, actions, setHeader])

  return (
    <HeaderContext.Provider value={value}>
      {children}
    </HeaderContext.Provider>
  )
}

export function useHeader() {
  const context = React.useContext(HeaderContext)
  if (!context) {
    throw new Error('useHeader must be used within a HeaderProvider')
  }
  return context
}

// Helper hook for easily setting page header (client-side only)
export function usePageHeader(title?: string, description?: string, actions?: React.ReactNode) {
  const { setHeader } = useHeader()
  
  React.useEffect(() => {
    setHeader({ title, description, actions })
    
    return () => {
      setHeader({})
    }
  }, [title, description, actions, setHeader])
}

// Server-compatible component for setting page header
export function PageHeader({ 
  title, 
  description, 
  actions 
}: { 
  title?: string
  description?: string
  actions?: React.ReactNode
}) {
  const { setHeader } = useHeader()
  
  React.useEffect(() => {
    setHeader({ title, description, actions })
    
    return () => {
      setHeader({})
    }
  }, [title, description, actions, setHeader])
  
  return null
}

interface SiteHeaderProps {
  title?: string
  description?: string
  actions?: React.ReactNode
}

export function SiteHeader({ title: propTitle, description: propDescription, actions: propActions }: SiteHeaderProps) {
  const { setTheme, theme } = useTheme()
  const [searchOpen, setSearchOpen] = React.useState(false)
  
  // Try to get header data from context first, fallback to props
  let title = propTitle
  let description = propDescription
  let actions = propActions
  
  try {
    const headerContext = useHeader()
    title = headerContext.title || propTitle
    description = headerContext.description || propDescription
    actions = headerContext.actions || propActions
  } catch {
    // HeaderProvider not available, use props
  }

  return (
    <>
      <header className="absolute w-[calc(100%-1rem)] top-2 z-50 mx-2 rounded-lg border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
        <div className="flex h-14 items-center gap-4 px-4">
          <SidebarTrigger className="-ml-1" />

          {/* Page Title Section */}
          {title && (
            <div className="flex flex-col justify-center min-w-0 flex-shrink-0">
              <h1 className="text-sm font-semibold truncate">{title}</h1>
              {description && (
                <p className="text-xs text-muted-foreground truncate">{description}</p>
              )}
            </div>
          )}

          {/* Centered Search */}
          <div className="flex-1 flex justify-center px-4">
            <div className="max-w-md w-full">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search notebooks, pages... (⌘K)"
                  className="w-full pl-8 pr-4 cursor-pointer"
                  onClick={() => setSearchOpen(true)}
                  readOnly
                />
              </div>
            </div>
          </div>

          {/* Page Actions */}
          {actions && (
            <div className="flex items-center gap-2 flex-shrink-0">
              {actions}
            </div>
          )}

          {/* Right side actions */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Theme toggle */}
            <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>

            {/* Notifications */}
            <NotificationsSheet />
          </div>
        </div>
      </header>
      <SearchCommand />
    </>
  )
}