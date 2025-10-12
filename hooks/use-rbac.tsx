"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"

interface UserRole {
  id: string
  role: {
    id: string
    name: string
    displayName: string
    level: number
    scope: string
  }
  organizationId?: string
  projectId?: string
  notebookId?: string
  expiresAt?: string
  isActive: boolean
}

interface Permission {
  id: string
  name: string
  displayName: string
  category: string
  resource: string
  action: string
}

export function useUserRoles(organizationId?: string, projectId?: string, notebookId?: string) {
  const { data: session } = useSession()
  const [roles, setRoles] = useState<UserRole[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!session?.user?.id) {
      setLoading(false)
      return
    }

    // Mock implementation - in a real app, this would fetch from the API
    const mockRoles: UserRole[] = [
      {
        id: "1",
        role: {
          id: "1",
          name: "user",
          displayName: "User",
          level: 5,
          scope: "system"
        },
        isActive: true
      }
    ]

    setRoles(mockRoles)
    setLoading(false)
  }, [session?.user?.id, organizationId, projectId, notebookId])

  return { roles, loading }
}

export function useUserPermissions(organizationId?: string, projectId?: string, notebookId?: string) {
  const { data: session } = useSession()
  const [permissions, setPermissions] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!session?.user?.id) {
      setLoading(false)
      return
    }

    // Mock implementation - in a real app, this would fetch from the API
    const mockPermissions = [
      "notebooks.create",
      "notebooks.read",
      "notebooks.update",
      "notebooks.delete",
      "pages.create",
      "pages.read",
      "pages.update",
      "pages.delete",
      "materials.create",
      "materials.read",
      "materials.update",
      "materials.delete"
    ]

    setPermissions(mockPermissions)
    setLoading(false)
  }, [session?.user?.id, organizationId, projectId, notebookId])

  return { permissions, loading }
}

export function usePermission(permission: string, organizationId?: string, projectId?: string, notebookId?: string) {
  const { permissions, loading } = useUserPermissions(organizationId, projectId, notebookId)
  
  const hasAccess = permissions.includes(permission)
  
  return { hasAccess, loading }
}

export function useIsSuperAdmin() {
  const { roles, loading } = useUserRoles()
  
  const isSuperAdmin = roles.some(role => role.role.name === "super_admin")
  
  return { isSuperAdmin, loading }
}
