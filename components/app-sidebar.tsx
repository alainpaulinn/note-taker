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
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavDocuments } from "@/components/nav-documents"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import { SearchCommand } from "@/components/search-command"
import { NotebookSelector } from "@/components/notebook-selector"
import { useNotebook } from "@/components/notebook-context"
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
import { useSession } from "next-auth/react"
import { useUserPermissions, useIsSuperAdmin } from "@/hooks/use-rbac"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { state } = useSidebar()
  const { selectedNotebook } = useNotebook()
  const [searchOpen, setSearchOpen] = React.useState(false)
  const { data: session } = useSession()
  const { permissions, loading: permissionsLoading } = useUserPermissions()
  const { isSuperAdmin, loading: superAdminLoading } = useIsSuperAdmin()

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
        title: "Search",
        url: "#",
        icon: Search,
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
                  <span className="text-sm font-bold">NM</span>
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                  <div className="text-xl font-bold hover:opacity-80 transition-opacity">
                    <span className="text-foreground">Note</span>
                    <span className="text-blue-600 dark:text-blue-400">Master</span>
                  </div>
                  <span className="truncate text-xs">Learning Platform</span>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent className="overflow-y-auto overflow-x-hidden">
          <SidebarFooter>
            <NotebookSelector />
          </SidebarFooter>
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
          <NavDocuments documents={data.documents} />
          <NavSecondary
            items={data.navSecondary.map((item) =>
              item.title === "Search" ? { ...item, onClick: () => setSearchOpen(true) } : item,
            )}
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

