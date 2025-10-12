"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { BadgeCheck, Bell, ChevronsUpDown, CreditCard, LogOut, Sparkles, Settings, Shield } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar"
import { getUserProfile } from "@/app/actions/user-settings"
import { signOutUser } from "@/app/actions/auth"
import { useToast } from "@/hooks/use-toast"

interface UserData {
  id: string
  firstName: string | null
  lastName: string | null
  email: string
  image: string | null
}

export function NavUser() {
  const { isMobile } = useSidebar()
  const router = useRouter()
  const { toast } = useToast()
  const [user, setUser] = useState<UserData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadUserData()
  }, [])

  // Server action for loading user data
  const loadUserData = async () => {
    try {
      const result = await getUserProfile()
      if (result.success && result.data) {
        setUser({
          id: result.data.id,
          firstName: result.data.firstName,
          lastName: result.data.lastName,
          email: result.data.email || "",
          image: result.data.image,
        })
      } else {
        console.error("Failed to load user profile:", result.error)
      }
    } catch (error) {
      console.error("Failed to load user data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Server action for sign out
  const handleSignOut = async () => {
    try {
      await signOutUser()
      toast({
        title: "Signed out",
        description: "You have been successfully signed out.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive"
      })
    }
  }

  // Client-side navigation (needs to be client-side for routing)
  const navigateToSettings = (path: string) => {
    router.push(`/settings/${path}`)
  }

  // Pure functions for display logic
  const getDisplayName = () => {
    if (!user) return "User"
    if (user.firstName || user.lastName) {
      return `${user.firstName || ""} ${user.lastName || ""}`.trim()
    }
    return user.email?.split("@")[0] || "User"
  }

  const getInitials = () => {
    if (!user) return "U"
    if (user.firstName || user.lastName) {
      return `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`.toUpperCase()
    }
    return user.email?.[0]?.toUpperCase() || "U"
  }

  if (isLoading) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg" className="animate-pulse">
            <div className="h-8 w-8 rounded-lg bg-muted"></div>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <div className="h-4 w-24 bg-muted rounded"></div>
              <div className="h-3 w-32 bg-muted rounded mt-1"></div>
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    )
  }

  if (!user) {
    return null
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={user.image || "/placeholder-user.jpg"} alt={getDisplayName()} />
                <AvatarFallback className="rounded-lg">{getInitials()}</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{getDisplayName()}</span>
                <span className="truncate text-xs text-muted-foreground">{user.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user.image || "/placeholder-user.jpg"} alt={getDisplayName()} />
                  <AvatarFallback className="rounded-lg">{getInitials()}</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{getDisplayName()}</span>
                  <span className="truncate text-xs text-muted-foreground">{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => navigateToSettings("billing")}>
                <Sparkles />
                Upgrade to Pro
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => navigateToSettings("account")}>
                <BadgeCheck />
                Account
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigateToSettings("billing")}>
                <CreditCard />
                Billing
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigateToSettings("notifications")}>
                <Bell />
                Notifications
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigateToSettings("preferences")}>
                <Settings />
                Preferences
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigateToSettings("security")}>
                <Shield />
                Security
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut}>
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
