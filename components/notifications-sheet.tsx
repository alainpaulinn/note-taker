"use client"

import * as React from "react"
import { Bell, Check, Settings, Archive, Trash2, Filter } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface Notification {
  id: string
  title: string
  message: string
  type: "info" | "success" | "warning" | "error"
  timestamp: string
  read: boolean
  category: "design" | "collaboration" | "system" | "billing"
  actionUrl?: string
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    title: "Design Generation Complete",
    message: "Your parametric design variants for Riverside Complex are ready for review.",
    type: "success",
    timestamp: "2 minutes ago",
    read: false,
    category: "design",
    actionUrl: "/parametric",
  },
  {
    id: "2",
    title: "Team Member Added Comment",
    message: "Sarah Designer commented on Downtown Office Tower project.",
    type: "info",
    timestamp: "15 minutes ago",
    read: false,
    category: "collaboration",
  },
  {
    id: "3",
    title: "Export Ready for Download",
    message: "Your PDF package for Suburban Residential is ready.",
    type: "success",
    timestamp: "1 hour ago",
    read: true,
    category: "design",
    actionUrl: "/export",
  },
  {
    id: "4",
    title: "System Maintenance Scheduled",
    message: "Planned maintenance window: Tonight 11 PM - 2 AM EST.",
    type: "warning",
    timestamp: "2 hours ago",
    read: false,
    category: "system",
  },
  {
    id: "5",
    title: "Payment Processed Successfully",
    message: "Your monthly subscription payment of $49.00 has been processed.",
    type: "success",
    timestamp: "1 day ago",
    read: true,
    category: "billing",
  },
  {
    id: "6",
    title: "New Template Available",
    message: "Check out the new Sustainable Housing template in the library.",
    type: "info",
    timestamp: "2 days ago",
    read: true,
    category: "design",
  },
  {
    id: "7",
    title: "Collaboration Invite",
    message: "Mike Planner invited you to collaborate on Urban Development project.",
    type: "info",
    timestamp: "3 days ago",
    read: false,
    category: "collaboration",
  },
]

function getNotificationIcon(type: Notification["type"]) {
  switch (type) {
    case "success":
      return "✅"
    case "warning":
      return "⚠️"
    case "error":
      return "❌"
    default:
      return "ℹ️"
  }
}

function getNotificationColor(type: Notification["type"]) {
  switch (type) {
    case "success":
      return "text-green-600 dark:text-green-400"
    case "warning":
      return "text-yellow-600 dark:text-yellow-400"
    case "error":
      return "text-red-600 dark:text-red-400"
    default:
      return "text-blue-600 dark:text-blue-400"
  }
}

interface NotificationsSheetProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function NotificationsSheet({ open, onOpenChange }: NotificationsSheetProps) {
  const [notifications, setNotifications] = React.useState(mockNotifications)
  const [internalOpen, setInternalOpen] = React.useState(false)

  const isOpen = open !== undefined ? open : internalOpen
  const setIsOpen = onOpenChange || setInternalOpen

  const unreadCount = notifications.filter((n) => !n.read).length

  const markAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  const filterNotifications = (category?: string) => {
    if (!category || category === "all") return notifications
    return notifications.filter((n) => n.category === category)
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
          )}
          <span className="sr-only">Notifications</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px] py-6 px-0">
        <SheetHeader className="px-6">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <SheetTitle>Notifications</SheetTitle>
              <SheetDescription>Stay updated with your latest activities</SheetDescription>
            </div>
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>All Notifications</DropdownMenuItem>
                  <DropdownMenuItem>Design Updates</DropdownMenuItem>
                  <DropdownMenuItem>Collaboration</DropdownMenuItem>
                  <DropdownMenuItem>System</DropdownMenuItem>
                  <DropdownMenuItem>Billing</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button variant="outline" size="sm" onClick={markAllAsRead}>
                <Check className="h-4 w-4 mr-2" />
                Mark All Read
              </Button>
            </div>
          </div>
        </SheetHeader>

        <Tabs defaultValue="all" className="mt-6">
          <TabsList className="grid w-full grid-cols-2 px-6 bg-transparent">
            <TabsTrigger value="all">All ({notifications.length})</TabsTrigger>
            <TabsTrigger value="unread">Unread ({unreadCount})</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-4">
            <ScrollArea className="h-[calc(100vh-200px)] px-6 pb-20">
              <div className="space-y-4">
                {notifications.length === 0 ? (
                  <div className="text-center py-8">
                    <Bell className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No notifications yet</p>
                  </div>
                ) : (
                  notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 border rounded-lg transition-colors ${
                        !notification.read ? "bg-accent/50 border-primary/20" : "hover:bg-accent/30"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-1">
                          <span className="text-lg">{getNotificationIcon(notification.type)}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1">
                              <h4 className="font-medium text-sm">
                                {notification.title}
                                {!notification.read && (
                                  <Badge variant="secondary" className="ml-2 text-xs">
                                    New
                                  </Badge>
                                )}
                              </h4>
                              <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                              <p className="text-xs text-muted-foreground mt-2">{notification.timestamp}</p>
                            </div>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <span className="sr-only">Open menu</span>
                                  <div className="h-4 w-4 flex items-center justify-center">⋮</div>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                {!notification.read && (
                                  <DropdownMenuItem onClick={() => markAsRead(notification.id)}>
                                    <Check className="h-4 w-4 mr-2" />
                                    Mark as Read
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuItem>
                                  <Archive className="h-4 w-4 mr-2" />
                                  Archive
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() => deleteNotification(notification.id)}
                                  className="text-destructive"
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                          {notification.actionUrl && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="mt-3 bg-transparent"
                              onClick={() => {
                                // Navigate to action URL
                                window.location.href = notification.actionUrl!
                                setIsOpen(false)
                              }}
                            >
                              View Details
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="unread" className="mt-4">
            <ScrollArea className="h-[calc(100vh-200px)] px-6 pb-20">
              <div className="space-y-4">
                {notifications.filter((n) => !n.read).length === 0 ? (
                  <div className="text-center py-8">
                    <Check className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">All caught up!</p>
                  </div>
                ) : (
                  notifications
                    .filter((n) => !n.read)
                    .map((notification) => (
                      <div key={notification.id} className="p-4 border rounded-lg bg-accent/50 border-primary/20">
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 mt-1">
                            <span className="text-lg">{getNotificationIcon(notification.type)}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1">
                                <h4 className="font-medium text-sm">
                                  {notification.title}
                                  <Badge variant="secondary" className="ml-2 text-xs">
                                    New
                                  </Badge>
                                </h4>
                                <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                                <p className="text-xs text-muted-foreground mt-2">{notification.timestamp}</p>
                              </div>
                              <Button variant="ghost" size="sm" onClick={() => markAsRead(notification.id)}>
                                <Check className="h-4 w-4" />
                              </Button>
                            </div>
                            {notification.actionUrl && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="mt-3 bg-transparent"
                                onClick={() => {
                                  window.location.href = notification.actionUrl!
                                  setIsOpen(false)
                                }}
                              >
                                View Details
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                )}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>

        <div className="absolute bottom-4 left-4 right-4">
          <Separator className="mb-4" />
          <Button
            variant="outline"
            className="w-full bg-background"
            onClick={() => {
              window.location.href = "/notifications"
              setIsOpen(false)
            }}
          >
            <Settings className="h-4 w-4 mr-2" />
            Manage Notifications
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
