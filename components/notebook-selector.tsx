"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar"
import { Badge } from "@/components/ui/badge"
import { NotebookPen, Check, ChevronsUpDown, Plus, FileImage, FileText } from "lucide-react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { useNotebook } from "./notebook-context"
import { recordNotebookAccess } from "@/app/actions/notebook"

export function NotebookSelector() {
    const { state } = useSidebar()
    const { selectedNotebook, setSelectedNotebook, notebooks, isLoading, refreshNotebooks } = useNotebook()
    const router = useRouter()
    const pathname = usePathname()

    const handleNotebookSelect = async (notebook: any) => {
        setSelectedNotebook(notebook)
        
        // Record that the user accessed this notebook
        try {
            await recordNotebookAccess(notebook.id)
            // Refresh the notebooks list to update the ordering
            await refreshNotebooks()
        } catch (error) {
            console.error("Failed to record notebook access:", error)
        }
        
        // If not on the main app page, navigate to the selected notebook
        if (pathname !== '/app') {
            // Check if we're currently on a notebook page to preserve the context
            if (pathname.startsWith('/app/notebooks/')) {
                // If on a notebook's pages or materials, navigate to the same section of the new notebook
                if (pathname.includes('/pages/')) {
                    router.push(`/app/notebooks/${notebook.id}/pages`)
                } else if (pathname.includes('/materials/')) {
                    router.push(`/app/notebooks/${notebook.id}/materials`)
                } else {
                    // Otherwise, navigate to the new notebook's main page
                    router.push(`/app/notebooks/${notebook.id}`)
                }
            } else {
                // If on any other page, navigate to the new notebook's main page
                router.push(`/app/notebooks/${notebook.id}`)
            }
        }
    }

    const getVisibilityColor = (visibility: string) => {
        switch (visibility) {
            case 'public':
                return 'bg-green-500/10 text-green-600'
            case 'organization':
                return 'bg-blue-500/10 text-blue-600'
            case 'private':
                return 'bg-gray-500/10 text-gray-600'
            default:
                return 'bg-gray-500/10 text-gray-600'
        }
    }

    const getNotebookIcon = (icon?: string) => {
        switch (icon) {
            case 'book':
                return <NotebookPen className="size-4" />
            case 'file':
                return <FileText className="size-4" />
            case 'image':
                return <FileImage className="size-4" />
            default:
                return <NotebookPen className="size-4" />
        }
    }

    if (isLoading) {
        return (
            <SidebarMenu>
                <SidebarMenuItem>
                    <SidebarMenuButton size="lg" className="animate-pulse">
                        <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-muted">
                            <NotebookPen className="size-4" />
                        </div>
                        <div className="grid flex-1 text-left text-sm leading-tight">
                            <div className="h-4 bg-muted rounded w-24"></div>
                            <div className="h-3 bg-muted rounded w-16 mt-1"></div>
                        </div>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
        )
    }

    if (notebooks.length === 0) {
        return (
            <SidebarMenu>
                <SidebarMenuItem>
                    <Link href="/app/notebooks/new">
                        <SidebarMenuButton size="lg" className="hover:bg-muted/50">
                            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-muted">
                                <Plus className="size-4" />
                            </div>
                            <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                                <span className="truncate font-medium">Create Notebook</span>
                                <span className="truncate text-xs text-muted-foreground">Get started</span>
                            </div>
                        </SidebarMenuButton>
                    </Link>
                </SidebarMenuItem>
            </SidebarMenu>
        )
    }

    return (
        <SidebarGroup>
            <SidebarGroupLabel>Notebooks</SidebarGroupLabel>
            <SidebarMenu>
                <SidebarMenuItem>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <SidebarMenuButton
                                size="lg"
                                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                                tooltip={state === "collapsed" ? selectedNotebook?.name : undefined}
                            >
                                <div 
                                    className="flex aspect-square size-8 items-center justify-center rounded-lg text-white"
                                    style={{ backgroundColor: selectedNotebook?.color || '#3b82f6' }}
                                >
                                    {getNotebookIcon(selectedNotebook?.icon)}
                                </div>
                                <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                                    <span className="truncate font-semibold">
                                        {selectedNotebook?.name || 'Select Notebook'}
                                    </span>
                                    <span className="truncate text-xs text-muted-foreground">
                                        {selectedNotebook ? (
                                            <Badge variant="secondary" className={`${getVisibilityColor(selectedNotebook.visibility || 'private')} text-xs px-1 py-0 h-4`}>
                                                {selectedNotebook.visibility || 'private'}
                                            </Badge>
                                        ) : (
                                            'No notebook selected'
                                        )}
                                    </span>
                                </div>
                                <ChevronsUpDown className="ml-auto size-4 group-data-[collapsible=icon]:hidden" />
                            </SidebarMenuButton>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                            align="start"
                            side="bottom"
                            sideOffset={4}
                        >
                            <DropdownMenuLabel className="text-xs text-muted-foreground">
                                Notebooks
                            </DropdownMenuLabel>
                            {notebooks.slice(0, 7).map((notebook) => (
                                <DropdownMenuItem
                                    key={notebook.id}
                                    onClick={() => handleNotebookSelect(notebook)}
                                    className="gap-2 p-2"
                                >
                                    <div 
                                        className="flex size-6 items-center justify-center rounded-sm text-white"
                                        style={{ backgroundColor: notebook.color || '#3b82f6' }}
                                    >
                                        {getNotebookIcon(notebook.icon)}
                                    </div>
                                    <div className="flex-1">
                                        <div className="font-medium">{notebook.name}</div>
                                        <div className="text-xs text-muted-foreground">{notebook.description || 'No description'}</div>
                                    </div>
                                    <Badge variant="secondary" className={`${getVisibilityColor(notebook.visibility || 'private')} text-xs`}>
                                        {notebook.visibility || 'private'}
                                    </Badge>
                                    {selectedNotebook?.id === notebook.id && (
                                        <Check className="ml-auto size-4" />
                                    )}
                                </DropdownMenuItem>
                            ))}
                            {notebooks.length > 7 && (
                                <>
                                    <DropdownMenuSeparator />
                                    <Link href="/app/notebooks">
                                        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                            <div className="flex size-6 items-center justify-center rounded-md border">
                                                <NotebookPen className="size-4" />
                                            </div>
                                            View all notebooks ({notebooks.length})
                                        </DropdownMenuItem>
                                    </Link>
                                </>
                            )}
                            <DropdownMenuSeparator />
                            <Link href="/app/notebooks/new">
                                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                    <div className="flex size-6 items-center justify-center rounded-md border border-dashed">
                                        <Plus className="size-4" />
                                    </div>
                                    Add new notebook
                                    <DropdownMenuShortcut>⌘N</DropdownMenuShortcut>
                                </DropdownMenuItem>
                            </Link>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </SidebarMenuItem>
            </SidebarMenu>
        </SidebarGroup>
    )
}
