"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, ChevronLeft, ChevronRight, X, Bell, Settings, User } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ThemeToggle } from "@/components/theme-toggle"
import { useSession } from "next-auth/react"

interface AppHeaderProps {
  totalItems?: number
  currentPage?: number
  totalPages?: number
  itemsPerPage?: number
  searchQuery?: string
  onSearchChange?: (query: string) => void
  onPageChange?: (page: number) => void
  startIndex?: number
  endIndex?: number
  title?: string
  description?: string
}

export function AppHeader({
  totalItems = 0,
  currentPage = 1,
  totalPages = 1,
  itemsPerPage = 10,
  searchQuery = "",
  onSearchChange,
  onPageChange,
  startIndex = 0,
  endIndex = 0,
  title = "Dashboard",
  description = "Manage your learning materials"
}: AppHeaderProps) {
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery)
  const { data: session } = useSession()

  // Debounce search input
  useEffect(() => {
    if (onSearchChange) {
      const timer = setTimeout(() => {
        onSearchChange(localSearchQuery)
      }, 300)

      return () => clearTimeout(timer)
    }
  }, [localSearchQuery, onSearchChange])

  const goToPrevious = () => {
    if (currentPage > 1 && onPageChange) {
      onPageChange(currentPage - 1)
    }
  }

  const goToNext = () => {
    if (currentPage < totalPages && onPageChange) {
      onPageChange(currentPage + 1)
    }
  }

  const clearSearch = () => {
    setLocalSearchQuery("")
  }

  return (
    <header className="flex h-16 items-center gap-4 border-b bg-background px-4">
      <div className="flex flex-1 items-center gap-4">
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-semibold">{title}</h1>
          {description && (
            <p className="text-sm text-muted-foreground hidden sm:block">{description}</p>
          )}
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        {/* Search Input - only show if onSearchChange is provided */}
        {onSearchChange && (
          <div className="relative">
            <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search notebooks, pages..."
              className="w-64 pl-8"
              value={localSearchQuery}
              onChange={(e) => setLocalSearchQuery(e.target.value)}
            />
            {localSearchQuery && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearSearch}
                className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
        )}
        
        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-4 w-4" />
          <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs">
            3
          </Badge>
        </Button>
        
        {/* Theme Toggle */}
        <ThemeToggle />
        
        {/* Settings */}
        <Button variant="ghost" size="icon">
          <Settings className="h-4 w-4" />
        </Button>
        
        {/* User Avatar */}
        <Avatar className="h-8 w-8">
          <AvatarImage src={session?.user?.image || ""} alt={session?.user?.name || ""} />
          <AvatarFallback>
            {session?.user?.name?.charAt(0) || "U"}
          </AvatarFallback>
        </Avatar>

        {/* Pagination Controls - only show if pagination props are provided */}
        {totalPages > 1 && onPageChange && (
          <div className="flex items-center gap-2">
            {/* Page Info */}
            <div className="hidden md:flex items-center text-sm text-muted-foreground">
              <span>
                {Math.min(startIndex + 1, totalItems)}-{Math.min(endIndex, totalItems)} of {totalItems}
              </span>
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={goToPrevious}
                disabled={currentPage === 1}
                className="h-9 w-9 p-0"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              {/* Page Numbers */}
              <div className="hidden sm:flex items-center gap-1">
                {totalPages <= 5 ? (
                  Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => onPageChange(page)}
                      className="h-9 w-9 p-0"
                    >
                      {page}
                    </Button>
                  ))
                ) : (
                  <>
                    {currentPage > 3 && (
                      <>
                        <Button variant="outline" size="sm" onClick={() => onPageChange(1)} className="h-9 w-9 p-0">
                          1
                        </Button>
                        {currentPage > 4 && <span className="px-2 text-muted-foreground">...</span>}
                      </>
                    )}

                    {Array.from({ length: 3 }, (_, i) => {
                      const page = Math.max(1, Math.min(totalPages - 2, currentPage - 1)) + i
                      if (page > totalPages) return null
                      return (
                        <Button
                          key={page}
                          variant={currentPage === page ? "default" : "outline"}
                          size="sm"
                          onClick={() => onPageChange(page)}
                          className="h-9 w-9 p-0"
                        >
                          {page}
                        </Button>
                      )
                    })}

                    {currentPage < totalPages - 2 && (
                      <>
                        {currentPage < totalPages - 3 && <span className="px-2 text-muted-foreground">...</span>}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onPageChange(totalPages)}
                          className="h-9 w-9 p-0"
                        >
                          {totalPages}
                        </Button>
                      </>
                    )}
                  </>
                )}
              </div>

              {/* Mobile page indicator */}
              <div className="sm:hidden flex items-center px-3 py-2 text-sm text-muted-foreground">
                {currentPage} / {totalPages}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={goToNext}
                disabled={currentPage === totalPages}
                className="h-9 w-9 p-0"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
