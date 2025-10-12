"use client"

import React from "react"
import { usePermission, useUserRoles } from "@/hooks/use-rbac"
import { Skeleton } from "@/components/ui/skeleton"

interface PermissionGuardProps {
  permission: string
  organizationId?: string
  projectId?: string
  children: React.ReactNode
  fallback?: React.ReactNode
  loading?: React.ReactNode
}

export function PermissionGuard({
  permission,
  organizationId,
  projectId,
  children,
  fallback = null,
  loading = <Skeleton className="h-8 w-24" />
}: PermissionGuardProps) {
  const { hasAccess, loading: checkingPermission } = usePermission(permission, organizationId, projectId)

  if (checkingPermission) {
    return <>{loading}</>
  }

  if (!hasAccess) {
    return <>{fallback}</>
  }

  return <>{children}</>
}

interface RoleGuardProps {
  roles: string | string[]
  organizationId?: string
  projectId?: string
  children: React.ReactNode
  fallback?: React.ReactNode
  loading?: React.ReactNode
}

export function RoleGuard({
  roles,
  organizationId,
  projectId,
  children,
  fallback = null,
  loading = <Skeleton className="h-8 w-24" />
}: RoleGuardProps) {
  const { roles: userRoles, loading: checkingRoles } = useRoles(organizationId, projectId)
  
  if (checkingRoles) {
    return <>{loading}</>
  }

  const requiredRoles = Array.isArray(roles) ? roles : [roles]
  const hasRequiredRole = userRoles.some(userRole => 
    requiredRoles.includes(userRole.role.name)
  )

  if (!hasRequiredRole) {
    return <>{fallback}</>
  }

  return <>{children}</>
}

// Utility hook for RoleGuard
function useRoles(organizationId?: string, projectId?: string) {
  const { roles, loading } = useUserRoles(organizationId, projectId)
  return { roles, loading }
}