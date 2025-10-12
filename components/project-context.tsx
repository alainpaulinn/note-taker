"use client"

import * as React from "react"

interface Notebook {
  id: string
  name: string
  description?: string
  color?: string
  coverColor?: string
  coverImage?: string
  icon?: string
  visibility?: string
  createdAt: string
  updatedAt: string
}

interface Page {
  id: string
  title: string
  content?: string
  type?: string
  order?: number
  notebookId: string
  createdAt: string
  updatedAt: string
}

interface Material {
  id: string
  name: string
  description?: string
  type?: string
  fileUrl?: string
  fileName?: string
  fileSize?: number
  mimeType?: string
  notebookId: string
  createdAt: string
  updatedAt: string
}

interface NotebookContextValue {
  selectedNotebook: Notebook | null
  setSelectedNotebook: (notebook: Notebook | null) => void
  notebooks: Notebook[]
  setNotebooks: (notebooks: Notebook[]) => void
  pages: Page[]
  setPages: (pages: Page[]) => void
  materials: Material[]
  setMaterials: (materials: Material[]) => void
  isLoading: boolean
  setIsLoading: (loading: boolean) => void
  refreshNotebooks: () => Promise<void>
  refreshPages: (notebookId: string) => Promise<void>
  refreshMaterials: (notebookId: string) => Promise<void>
}

const NotebookContext = React.createContext<NotebookContextValue | undefined>(undefined)

export function NotebookProvider({ children }: { children: React.ReactNode }) {
  const [selectedNotebook, setSelectedNotebook] = React.useState<Notebook | null>(null)
  const [notebooks, setNotebooks] = React.useState<Notebook[]>([])
  const [pages, setPages] = React.useState<Page[]>([])
  const [materials, setMaterials] = React.useState<Material[]>([])
  const [isLoading, setIsLoading] = React.useState(false)

  const refreshNotebooks = React.useCallback(async () => {
    setIsLoading(true)
    try {
      // TODO: Implement actual notebook fetching logic
      // const fetchedNotebooks = await fetchNotebooks()
      // setNotebooks(fetchedNotebooks)
    } catch (error) {
      console.error("Failed to refresh notebooks:", error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const refreshPages = React.useCallback(async (notebookId: string) => {
    try {
      // TODO: Implement actual page fetching logic
      // const fetchedPages = await fetchPages(notebookId)
      // setPages(fetchedPages)
    } catch (error) {
      console.error("Failed to refresh pages:", error)
    }
  }, [])

  const refreshMaterials = React.useCallback(async (notebookId: string) => {
    try {
      // TODO: Implement actual material fetching logic
      // const fetchedMaterials = await fetchMaterials(notebookId)
      // setMaterials(fetchedMaterials)
    } catch (error) {
      console.error("Failed to refresh materials:", error)
    }
  }, [])

  const value = React.useMemo(() => ({
    selectedNotebook,
    setSelectedNotebook,
    notebooks,
    setNotebooks,
    pages,
    setPages,
    materials,
    setMaterials,
    isLoading,
    setIsLoading,
    refreshNotebooks,
    refreshPages,
    refreshMaterials
  }), [selectedNotebook, notebooks, pages, materials, isLoading, refreshNotebooks, refreshPages, refreshMaterials])

  return (
    <NotebookContext.Provider value={value}>
      {children}
    </NotebookContext.Provider>
  )
}

export function useNotebook() {
  const context = React.useContext(NotebookContext)
  if (!context) {
    throw new Error('useNotebook must be used within a NotebookProvider')
  }
  return context
}
