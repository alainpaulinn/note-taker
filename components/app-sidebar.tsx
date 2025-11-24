"use client"

import * as React from "react"
import {
  FileText,
  BarChart3,
  Download,
  BookOpen,
  LifeBuoy,
  Search,
  Settings2,
  SquareTerminal,
  Bell,
  Users,
  Globe,
  Database,
  NotebookPen,
  FileImage,
  PenTool,
  Shield,
  Building2,
  Sparkles,
  CalendarClock,
  Target,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavDocuments } from "@/components/nav-documents"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import { SearchCommand } from "@/components/search-command"
import { NotebookSelector } from "@/components/notebook-selector"
import { Button } from "@/components/ui/button"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel,
  useSidebar,
} from "@/components/ui/sidebar"
import Link from "next/link"
import { useUserPermissions, useIsSuperAdmin } from "@/hooks/use-rbac"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { state } = useSidebar()
  const isCollapsed = state === "collapsed"
  const { permissions, loading: permissionsLoading } = useUserPermissions()
  const { isSuperAdmin, loading: superAdminLoading } = useIsSuperAdmin()

  const openCommandPalette = React.useCallback(() => {
    window.dispatchEvent(new CustomEvent("open-command-palette"))
  }, [])

  const data = {
    user: {
      name: "John Learner",
      email: "john@A-notes.com",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    navMain: [
      {
        title: "Home",
        url: "/app",
        icon: SquareTerminal,
        isActive: true,
      },
      {
        title: "Notebooks",
        url: "/app/notebooks",
        icon: NotebookPen,
      },
      {
        title: "Canvas",
        url: "/app/canvas",
        icon: PenTool,
      },
      {
        title: "Materials",
        url: "/app/materials",
        icon: FileImage,
      },
      {
        title: "Templates",
        url: "/app/templates",
        icon: FileText,
      },
      {
        title: "Analytics",
        url: "/app/analytics",
        icon: BarChart3,
      },
      {
        title: "Notifications",
        url: "/app/notifications",
        icon: Bell,
      },
      {
        title: "Export",
        url: "/app/export",
        icon: Download,
      },
    ],
    navAdmin: [
      ...(isSuperAdmin || permissions.includes("system.regions.manage") ? [{
        title: "Regions",
        url: "/admin/regions",
        icon: Globe,
      }] : []),
      ...(isSuperAdmin || permissions.includes("system.users.manage") ? [{
        title: "User Management",
        url: "/admin/users",
        icon: Users,
      }] : []),
      ...(isSuperAdmin || permissions.includes("system.users.manage") ? [{
        title: "Roles & Permissions",
        url: "/admin/roles",
        icon: Shield,
      }] : []),
      ...(isSuperAdmin || permissions.includes("system.organizations.manage") ? [{
        title: "Organizations",
        url: "/admin/organizations",
        icon: Building2,
      }] : []),
      ...(isSuperAdmin || permissions.includes("system.settings.manage") ? [{
        title: "System Settings",
        url: "/admin/system",
        icon: Database,
      }] : []),
      ...(isSuperAdmin || permissions.includes("system.settings.manage") ? [{
        title: "Admin Analytics",
        url: "/admin/analytics",
        icon: BarChart3,
      }] : []),
    ],
    navSecondary: [
      {
        title: "Settings",
        url: "/settings",
        icon: Settings2,
      },
      {
        title: "Get Help",
        url: "/help",
        icon: LifeBuoy,
      },
      {
        title: "Command Palette",
        url: "#",
        icon: Search,
        onClick: openCommandPalette,
      },
    ],
    documents: [
      {
        name: "Note Templates",
        url: "/app/templates",
        icon: FileText,
      },
      {
        name: "Learning Resources",
        url: "/app/resources",
        icon: BookOpen,
      },
      {
        name: "Export Formats",
        url: "/app/formats",
        icon: Download,
      },
    ],
    workflows: [
      {
        title: "Meeting notes",
        description: "Agenda + decisions template",
        icon: Users,
        url: "/app/templates?filter=meetings",
      },
      {
        title: "Daily study plan",
        description: "Time-boxed schedule",
        icon: CalendarClock,
        url: "/app/templates?filter=daily",
      },
      {
        title: "Idea garden",
        description: "Unstructured brainstorming",
        icon: Sparkles,
        url: "/app/notebooks?view=ideas",
      },
    ],
    collections: [
      {
        title: "Today",
        count: 4,
        url: "/app/notebooks?filter=today",
      },
      {
        title: "Pinned",
        count: 8,
        url: "/app/notebooks?filter=pinned",
      },
      {
        title: "Shared with me",
        count: 12,
        url: "/app/notebooks?filter=shared",
      },
    ],
  }

  return (
    <>
      <Sidebar collapsible="icon" className="overflow-hidden bg-sidebar" {...props}>
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground group-data-[collapsible=icon]:justify-center"
                tooltip={state === "collapsed" ? "A-notes" : undefined}
              >
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground shrink-0">
                  <span className="text-sm font-bold">AN</span>
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                  <div className="text-xl font-bold hover:opacity-80 transition-opacity">
                    <span className="text-foreground">A</span>
                    <span className="text-blue-600 dark:text-blue-400">-notes</span>
                  </div>
                  <span className="truncate text-xs text-muted-foreground">Ideas in one orbit</span>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent className="overflow-y-auto overflow-x-hidden space-y-4 px-3">
          {!isCollapsed && (
            <div className="space-y-3">
              <NotebookSelector />
              <div className="rounded-2xl border border-border/40 bg-muted/10 p-3 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">Quick start</p>
                    <p className="text-sm font-semibold">Capture instantly</p>
                  </div>
                  <Sparkles className="h-4 w-4 text-primary" />
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button asChild size="sm" className="flex-1">
                    <Link href="/app/notebooks/new">New notebook</Link>
                  </Button>
                  <Button asChild variant="outline" size="sm" className="flex-1">
                    <Link href="/app/notebooks">Browse notes</Link>
                  </Button>
                  <Button variant="ghost" size="sm" className="w-full" onClick={openCommandPalette}>
                    Launch command (⌘K)
                  </Button>
                </div>
              </div>
              <div className="rounded-2xl border border-border/30 bg-background/80 p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Next up</p>
                    <p className="font-semibold">Strategy sync</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} · 30 min block
                    </p>
                  </div>
                  <Target className="h-4 w-4 text-primary" />
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Jump back into <span className="font-medium">Product Decisions</span> notebook.
                </p>
              </div>
            </div>
          )}
          {isCollapsed && (
            <div className="px-1">
              <NotebookSelector />
            </div>
          )}
          <NavMain items={data.navMain} />
          {!permissionsLoading && !superAdminLoading && data.navAdmin.length > 0 && (
            <SidebarGroup>
              <SidebarGroupLabel>Admin</SidebarGroupLabel>
              <SidebarMenu>
                {data.navAdmin.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton tooltip={item.title} asChild>
                      <Link href={item.url}>
                        {item.icon && <item.icon />}
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroup>
          )}
          {!isCollapsed && (
            <>
              <SidebarGroup>
                <SidebarGroupLabel>Workflows</SidebarGroupLabel>
                <SidebarMenu>
                  {data.workflows.map((flow) => (
                    <SidebarMenuItem key={flow.title}>
                      <SidebarMenuButton asChild tooltip={flow.title}>
                        <Link href={flow.url}>
                          <flow.icon className="text-muted-foreground" />
                          <div className="flex flex-col text-left">
                            <span>{flow.title}</span>
                            <span className="text-xs text-muted-foreground">{flow.description}</span>
                          </div>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroup>
              <SidebarGroup>
                <SidebarGroupLabel>Collections</SidebarGroupLabel>
                <SidebarMenu>
                  {data.collections.map((collection) => (
                    <SidebarMenuItem key={collection.title}>
                      <SidebarMenuButton asChild tooltip={collection.title}>
                        <Link href={collection.url}>
                          <div className="flex flex-col">
                            <span>{collection.title}</span>
                            <span className="text-xs text-muted-foreground">{collection.count} notes</span>
                          </div>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroup>
            </>
          )}
          <NavDocuments documents={data.documents} />
          <NavSecondary
            items={data.navSecondary}
            className="mt-auto"
          />
        </SidebarContent>
        <SidebarFooter>
          <NavUser />
        </SidebarFooter>
      </Sidebar>
      <SearchCommand />
    </>
  )
}

