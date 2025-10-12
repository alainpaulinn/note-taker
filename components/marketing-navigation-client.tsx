"use client"

import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { useState } from "react"

interface MarketingNavigationClientProps {
  session: any
}

export function MarketingNavigationClient({ session }: MarketingNavigationClientProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <>
      {/* Desktop Actions */}
      <div className="hidden lg:flex items-center space-x-4">
        <ThemeToggle />
        {session?.user ? (
          <Button asChild>
            <Link href="/app">Go to App</Link>
          </Button>
        ) : (
          <>
            <Button variant="ghost" asChild>
              <Link href="/signin">Sign in</Link>
            </Button>
            <Button asChild>
              <Link href="/signup">Get started</Link>
            </Button>
          </>
        )}
      </div>

      {/* Mobile menu button */}
      <div className="lg:hidden">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setMobileMenuOpen(true)}
          className="text-muted-foreground"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden">
          <div className="fixed inset-0 z-50" />
          <div className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-background px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xl font-bold">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <span className="text-sm font-bold">NM</span>
                </div>
                <div>
                  <span className="text-foreground">Note</span>
                  <span className="text-blue-600 dark:text-blue-400">Master</span>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMobileMenuOpen(false)}
                className="text-muted-foreground"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-border">
                <div className="space-y-2 py-6">
                  <a
                    href="/features"
                    className="block px-3 py-2 text-base font-semibold leading-7 text-foreground hover:text-primary"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Features
                  </a>
                  <a
                    href="/pricing"
                    className="block px-3 py-2 text-base font-semibold leading-7 text-foreground hover:text-primary"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Pricing
                  </a>
                  <a
                    href="/docs"
                    className="block px-3 py-2 text-base font-semibold leading-7 text-foreground hover:text-primary"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Documentation
                  </a>
                  <a
                    href="/about"
                    className="block px-3 py-2 text-base font-semibold leading-7 text-foreground hover:text-primary"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    About
                  </a>
                  <a
                    href="/contact"
                    className="block px-3 py-2 text-base font-semibold leading-7 text-foreground hover:text-primary"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Contact
                  </a>
                </div>
                <div className="py-6">
                  <div className="flex flex-col gap-4">
                    <ThemeToggle />
                    {session?.user ? (
                      <Button asChild>
                        <Link href="/app">Go to App</Link>
                      </Button>
                    ) : (
                      <>
                        <Button variant="ghost" asChild>
                          <Link href="/signin">Sign in</Link>
                        </Button>
                        <Button asChild>
                          <Link href="/signup">Get started</Link>
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
