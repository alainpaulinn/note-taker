import { auth } from "@/auth"
import { MarketingNavigationClient } from "./marketing-navigation-client"
import { UserGreeting } from "./user-greeting"

const navigationItems = [
  { name: "Features", href: "/features" },
  { name: "Pricing", href: "/pricing" },
  { name: "Documentation", href: "/docs" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
]

export async function MarketingNavigation() {
  // Server-side session check - no client-side hydration issues
  const session = await auth()

  return (
    <>
      {/* Fixed Navigation Bar - Server Rendered */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo - Server Rendered */}
            <a href="/" className="flex items-center gap-2 text-xl font-bold">
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <span className="text-sm font-bold">NM</span>
              </div>
              <div>
                <span className="text-foreground">Note</span>
                <span className="text-blue-600 dark:text-blue-400">Master</span>
              </div>
            </a>

            {/* Desktop Navigation - Server Rendered */}
            <div className="hidden lg:flex items-center space-x-6">
              {navigationItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-sm font-medium transition-colors hover:text-blue-600 dark:hover:text-blue-400 text-muted-foreground"
                >
                  {item.name}
                </a>
              ))}
            </div>

            {/* Client Interactive Components */}
            <MarketingNavigationClient session={session} />
          </div>
        </div>
      </nav>
      
      {/* Conditional User Greeting - Server Rendered Based on Session */}
      {session?.user && (
        <UserGreeting 
          user={{
            name: session.user.name || "User",
            email: session.user.email || "",
            image: session.user.image || "",
            initials: session.user.name?.charAt(0) || session.user.email?.charAt(0) || "U",
            lastLogin: "2 hours ago",
            notebookCount: 3
          }} 
        />
      )}
    </>
  )
}