"use client"

import { Button } from "@/components/ui/button"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

interface ThemeToggleProps {
  variant?: "default" | "ghost" | "outline"
  size?: "default" | "sm" | "lg" | "icon"
  className?: string
}

export function ThemeToggle({ 
  variant = "ghost", 
  size = "sm", 
  className = "" 
}: ThemeToggleProps) {
  const { theme, resolvedTheme, setTheme } = useTheme()
  const toggleTheme = () => {
    const rootTheme =
      typeof document !== "undefined" && document.documentElement.classList.contains("dark")
        ? "dark"
        : "light"
    const currentTheme =
      resolvedTheme ?? (theme === "dark" || theme === "light" ? theme : rootTheme)
    setTheme(currentTheme === "dark" ? "light" : "dark")
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={toggleTheme}
      className={`h-9 w-9 p-0 ${className}`}
    >
      <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
} 
