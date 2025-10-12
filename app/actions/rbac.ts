"use server"

import { auth } from "@/auth"
import { prisma } from "@/prisma/prisma"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { hasPermission, isUserSuperAdmin, canAssignRole, getCurrentUserPermissions } from "@/lib/rbac"

// Get current user session and verify admin access
async function getCurrentUser() {
  const session = await auth()
  if (!session?.user?.id) {
    redirect("/signin")
  }
  return session.user
}

// Permission checking server action
export async function checkUserPermission(permission: string, organizationId?: string, projectId?: string) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return { hasAccess: false, error: "No session" }
    }

    const hasAccess = await hasPermission(session.user.id, permission, organizationId, projectId)
    return { hasAccess, error: null }
  } catch (error) {
    console.error('❌ Error in checkUserPermission:', error)
    return { hasAccess: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

// Super admin checking server action
export async function checkIsSuperAdmin() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return { isSuperAdmin: false, error: "No session" }
    }

    const isSuperAdmin = await isUserSuperAdmin(session.user.id)
    return { isSuperAdmin, error: null }
  } catch (error) {
    console.error('❌ Error in checkIsSuperAdmin:', error)
    return { isSuperAdmin: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

async function requirePermission(permission: string, organizationId?: string, projectId?: string) {
  const user = await getCurrentUser()
  const hasAccess = await hasPermission(user.id!, permission, organizationId, projectId)
  
  if (!hasAccess) {
    throw new Error("Unauthorized: Insufficient permissions")
  }
  
  return user
}

// User Management Actions
export async function getAllUsers(organizationId?: string) {
  try {
    await requirePermission('system.users.manage')
    
    const users = await prisma.user.findMany({
      include: {
        userRoles: {
          where: organizationId ? { organizationId } : {},
          include: {
            role: true,
            organization: true,
            project: true,
          }
        },
        userOrganizations: {
          include: {
            organization: true
          }
        },
        _count: {
          select: {
            projects: true,
            userRoles: true,
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return users
  } catch (error) {
    console.error('Error fetching users:', error)
    throw new Error('Failed to fetch users')
  }
}

export async function getUserById(userId: string) {
  await requirePermission('system.users.manage')
  
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        userRoles: {
          include: {
            role: true,
            organization: true,
            project: true,
          }
        },
        userOrganizations: {
          include: {
            organization: true
          }
        },
        projects: {
          include: {
            organization: true
          }
        },
        auditLogs: {
          take: 10,
          orderBy: { createdAt: 'desc' }
        }
      }
    })

    if (!user) {
      throw new Error('User not found')
    }

    return user
  } catch (error) {
    console.error('Error fetching user:', error)
    throw new Error('Failed to fetch user')
  }
}

export async function updateUser(userId: string, data: {
  name?: string
  firstName?: string
  lastName?: string
  company?: string
  jobTitle?: string
  bio?: string
  timezone?: string
}) {
  const currentUser = await requirePermission('system.users.manage')
  
  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        ...data,
        updatedAt: new Date(),
      }
    })

    // Log the action
    await prisma.auditLog.create({
      data: {
        userId: currentUser.id,
        action: 'user.updated',
        resource: 'user',
        resourceId: userId,
        details: { updatedFields: Object.keys(data) },
        success: true,
      }
    })

    revalidatePath('/admin/users')
    return updatedUser
  } catch (error) {
    console.error('Error updating user:', error)
    throw new Error('Failed to update user')
  }
}

export async function deactivateUser(userId: string) {
  const currentUser = await requirePermission('system.users.manage')
  
  try {
    // Don't allow deactivating self
    if (userId === currentUser.id) {
      throw new Error('Cannot deactivate your own account')
    }

    // Deactivate all user roles instead of deleting the user
    await prisma.userRole.updateMany({
      where: { userId },
      data: { isActive: false }
    })

    // Update user organization status
    await prisma.userOrganization.updateMany({
      where: { userId },
      data: { status: 'suspended' }
    })

    // Log the action
    await prisma.auditLog.create({
      data: {
        userId: currentUser.id,
        action: 'user.deactivated',
        resource: 'user',
        resourceId: userId,
        success: true,
      }
    })

    revalidatePath('/admin/users')
    return { success: true }
  } catch (error) {
    console.error('Error deactivating user:', error)
    throw new Error('Failed to deactivate user')
  }
}

// Role Management Actions
export async function assignRole(data: {
  userId: string
  roleId: string
  organizationId?: string
  projectId?: string
  expiresAt?: Date
  assignedReason?: string
}) {
  const currentUser = await requirePermission(
    data.organizationId ? 'org.users.manage' : 'system.users.manage',
    data.organizationId,
    data.projectId
  )

  try {
    // Get the role being assigned
    const role = await prisma.role.findUnique({ where: { id: data.roleId } })
    if (!role) {
      throw new Error('Role not found')
    }

    // Check if current user can assign this role
    const currentUserRoles = await prisma.userRole.findMany({
      where: {
        userId: currentUser.id,
        isActive: true,
        OR: [
          { expiresAt: null },
          { expiresAt: { gte: new Date() } }
        ]
      },
      include: { role: true }
    })

    const canAssign = currentUserRoles.some(ur => 
      canAssignRole(ur.role.name, role.name) || ur.role.name === 'super_admin'
    )

    if (!canAssign) {
      throw new Error('Insufficient permissions to assign this role')
    }

    // Check if role assignment already exists
    const existingRole = await prisma.userRole.findFirst({
      where: {
        userId: data.userId,
        roleId: data.roleId,
        organizationId: data.organizationId || null,
        projectId: data.projectId || null,
      }
    })

    if (existingRole) {
      // Update existing role to active if it was inactive
      await prisma.userRole.update({
        where: { id: existingRole.id },
        data: {
          isActive: true,
          expiresAt: data.expiresAt,
          assignedBy: currentUser.id,
          assignedReason: data.assignedReason,
        }
      })
    } else {
      // Create new role assignment
      await prisma.userRole.create({
        data: {
          userId: data.userId,
          roleId: data.roleId,
          organizationId: data.organizationId,
          projectId: data.projectId,
          expiresAt: data.expiresAt,
          assignedBy: currentUser.id,
          assignedReason: data.assignedReason,
        }
      })
    }

    // Log the action
    await prisma.auditLog.create({
      data: {
        userId: currentUser.id,
        organizationId: data.organizationId,
        action: 'role.assigned',
        resource: 'user',
        resourceId: data.userId,
        details: {
          roleId: data.roleId,
          roleName: role.name,
          organizationId: data.organizationId,
          projectId: data.projectId,
        },
        success: true,
      }
    })

    revalidatePath('/admin/users')
    return { success: true }
  } catch (error) {
    console.error('Error assigning role:', error)
    throw new Error('Failed to assign role')
  }
}

export async function removeRole(userRoleId: string) {
  const currentUser = await requirePermission('system.users.manage')

  try {
    const userRole = await prisma.userRole.findUnique({
      where: { id: userRoleId },
      include: {
        role: true,
        user: true,
      }
    })

    if (!userRole) {
      throw new Error('Role assignment not found')
    }

    // Don't allow removing own super admin role
    if (userRole.userId === currentUser.id && userRole.role.name === 'super_admin') {
      throw new Error('Cannot remove your own super admin role')
    }

    // Deactivate the role instead of deleting
    await prisma.userRole.update({
      where: { id: userRoleId },
      data: { isActive: false }
    })

    // Log the action
    await prisma.auditLog.create({
      data: {
        userId: currentUser.id,
        organizationId: userRole.organizationId,
        action: 'role.removed',
        resource: 'user',
        resourceId: userRole.userId,
        details: {
          roleId: userRole.roleId,
          roleName: userRole.role.name,
        },
        success: true,
      }
    })

    revalidatePath('/admin/users')
    return { success: true }
  } catch (error) {
    console.error('Error removing role:', error)
    throw new Error('Failed to remove role')
  }
}

// Organization Management Actions
export async function getAllOrganizations() {
  await requirePermission('system.organizations.manage')

  try {
    const organizations = await prisma.organization.findMany({
      include: {
        _count: {
          select: {
            userOrganizations: true,
            projects: true,
            userRoles: true,
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return organizations
  } catch (error) {
    console.error('Error fetching organizations:', error)
    throw new Error('Failed to fetch organizations')
  }
}

export async function createOrganization(data: {
  name: string
  slug: string
  description?: string
  industry?: string
  size?: string
  website?: string
  bypassQuota?: boolean // For admin override
}) {
  const currentUser = await getCurrentUser()
  
  // Check if user has system permission OR if they have quota available
  const hasSystemPermission = await hasPermission(currentUser.id!, 'system.organizations.manage')
  
  if (!hasSystemPermission && !data.bypassQuota) {
    // Check user's organization quota
    const user = await prisma.user.findUnique({
      where: { id: currentUser.id! }
    })
    
    if (!user || user.usedOrganizations >= user.maxOrganizations) {
      throw new Error('Organization creation quota exceeded. Please contact sales to increase your limit.')
    }
  }

  try {
    // Check if slug is unique
    const existingOrg = await prisma.organization.findUnique({
      where: { slug: data.slug }
    })

    if (existingOrg) {
      throw new Error('Organization slug already exists')
    }

    const organization = await prisma.organization.create({
      data: {
        ...data,
        subscriptionTier: 'free',
        subscriptionStatus: 'active',
      }
    })

    // Update user's used organization count if not admin
    if (!hasSystemPermission && currentUser.id) {
      await prisma.user.update({
        where: { id: currentUser.id },
        data: {
          usedOrganizations: {
            increment: 1
          }
        }
      })
    }

    // Add user as organization owner
    const orgOwnerRole = await prisma.role.findUnique({ where: { name: 'org_owner' } })
    if (orgOwnerRole && currentUser.id) {
      await prisma.userRole.create({
        data: {
          userId: currentUser.id,
          roleId: orgOwnerRole.id,
          organizationId: organization.id,
          assignedBy: currentUser.id,
          assignedReason: 'Organization creator',
        }
      })

      // Add to user-organization relationship
      await prisma.userOrganization.create({
        data: {
          userId: currentUser.id,
          organizationId: organization.id,
          status: 'active',
        }
      })
    }

    // Log the action
    await prisma.auditLog.create({
      data: {
        userId: currentUser.id,
        action: 'organization.created',
        resource: 'organization',
        resourceId: organization.id,
        success: true,
      }
    })

    revalidatePath('/admin/organizations')
    return organization
  } catch (error) {
    console.error('Error creating organization:', error)
    throw new Error('Failed to create organization')
  }
}

export async function updateUserQuota(userId: string, maxOrganizations: number) {
  await requirePermission('system.users.manage')

  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { maxOrganizations }
    })

    // Log the action
    const currentUser = await getCurrentUser()
    await prisma.auditLog.create({
      data: {
        userId: currentUser.id,
        action: 'user.quota.updated',
        resource: 'user',
        resourceId: userId,
        details: { newQuota: maxOrganizations },
        success: true,
      }
    })

    revalidatePath('/admin/users')
    revalidatePath('/admin/roles')
    return updatedUser
  } catch (error) {
    console.error('Error updating user quota:', error)
    throw new Error('Failed to update user quota')
  }
}

// Roles and Permissions Query Actions
export async function getAllRoles() {
  try {
    await requirePermission('system.users.manage')
    
    const roles = await prisma.role.findMany({
      where: { isActive: true },
      include: {
        rolePermissions: {
          include: {
            permission: true
          }
        },
        _count: {
          select: {
            userRoles: true
          }
        }
      },
      orderBy: { level: 'asc' }
    })

    return roles
  } catch (error) {
    console.error('Error fetching roles:', error)
    throw new Error('Failed to fetch roles')
  }
}

export async function getAllPermissions() {
  await requirePermission('system.users.manage')

  try {
    const permissions = await prisma.permission.findMany({
      where: { isActive: true },
      orderBy: [
        { category: 'asc' },
        { resource: 'asc' },
        { action: 'asc' }
      ]
    })

    return permissions
  } catch (error) {
    console.error('Error fetching permissions:', error)
    throw new Error('Failed to fetch permissions')
  }
}

export async function getAuditLogs(organizationId?: string, limit = 50) {
  await requirePermission(
    organizationId ? 'org.manage' : 'system.admin.full',
    organizationId
  )

  try {
    const auditLogs = await prisma.auditLog.findMany({
      where: organizationId ? { organizationId } : {},
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          }
        },
        organization: {
          select: {
            id: true,
            name: true,
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    })

    return auditLogs
  } catch (error) {
    console.error('Error fetching audit logs:', error)
    throw new Error('Failed to fetch audit logs')
  }
}

// Create a new user
export async function createUser(data: {
  email: string
  firstName: string
  lastName: string
  company?: string
  jobTitle?: string
  maxOrganizations: number
}) {
  const session = await auth()
  
  if (!session?.user?.id) {
    throw new Error('Unauthorized')
  }

  // Check permissions
  const canManageUsers = await hasPermission(session.user.id, "system.users.manage")
  if (!canManageUsers) {
    throw new Error('Insufficient permissions')
  }

  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email }
    })

    if (existingUser) {
      throw new Error('User already exists with this email')
    }

    // Create the user
    const user = await prisma.user.create({
      data: {
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        name: `${data.firstName} ${data.lastName}`,
        company: data.company || null,
        jobTitle: data.jobTitle || null,
        maxOrganizations: data.maxOrganizations,
        usedOrganizations: 0,
      }
    })

    // Log the audit event
    await prisma.auditLog.create({
      data: {
        action: 'CREATE_USER',
        resource: 'User',
        resourceId: user.id,
        userId: session.user.id,
        details: {
          email: data.email,
          name: user.name,
        }
      }
    })

    return user
  } catch (error) {
    console.error('Error creating user:', error)
    throw error instanceof Error ? error : new Error('Failed to create user')
  }
}

// Create a new role
export async function createRole(data: {
  name: string
  displayName: string
  description?: string
  scope: string
  level: number
  permissionIds?: string[]
}) {
  const session = await auth()
  
  if (!session?.user?.id) {
    throw new Error('Unauthorized')
  }

  // Check permissions
  const canManageRoles = await hasPermission(session.user.id, "system.users.manage")
  if (!canManageRoles) {
    throw new Error('Insufficient permissions')
  }

  try {
    // Check if role already exists
    const existingRole = await prisma.role.findUnique({
      where: { name: data.name }
    })

    if (existingRole) {
      throw new Error('Role already exists with this name')
    }

    // Create the role
    const role = await prisma.role.create({
      data: {
        name: data.name,
        displayName: data.displayName,
        description: data.description || null,
        scope: data.scope,
        level: data.level,
        isSystemRole: false, // Custom roles are not system roles
        isActive: true,
      }
    })

    // Add role permissions if provided
    if (data.permissionIds && data.permissionIds.length > 0) {
      await prisma.rolePermission.createMany({
        data: data.permissionIds.map(permissionId => ({
          roleId: role.id,
          permissionId
        }))
      })
    }

    // Log the audit event
    await prisma.auditLog.create({
      data: {
        action: 'CREATE_ROLE',
        resource: 'Role',
        resourceId: role.id,
        userId: session.user.id,
        details: {
          name: data.name,
          displayName: data.displayName,
          scope: data.scope,
          level: data.level,
          permissionCount: data.permissionIds?.length || 0
        }
      }
    })

    return role
  } catch (error) {
    console.error('Error creating role:', error)
    throw error instanceof Error ? error : new Error('Failed to create role')
  }
}

export async function getUserPermissions(organizationId?: string, projectId?: string) {
  try {
    const permissions = await getCurrentUserPermissions(organizationId, projectId)
    return permissions
  } catch (error) {
    console.error("Error fetching user permissions:", error)
    return []
  }
}

export async function updateRole(roleId: string, data: {
  name: string
  displayName: string
  description?: string
  scope: string
  level: number
  permissionIds: string[]
}) {
  await requirePermission('system.users.manage')
  
  try {
    // Update role basic info
    const role = await prisma.role.update({
      where: { id: roleId },
      data: {
        displayName: data.displayName,
        description: data.description,
        scope: data.scope,
        level: data.level,
      }
    })

    // Delete existing role permissions
    await prisma.rolePermission.deleteMany({
      where: { roleId }
    })

    // Add new role permissions
    if (data.permissionIds.length > 0) {
      await prisma.rolePermission.createMany({
        data: data.permissionIds.map(permissionId => ({
          roleId,
          permissionId
        }))
      })
    }

    // Log the update
    await prisma.auditLog.create({
      data: {
        action: 'UPDATE_ROLE',
        resource: 'Role',
        resourceId: role.id,
        userId: (await getCurrentUser()).id,
        details: {
          displayName: data.displayName,
          scope: data.scope,
          level: data.level,
          permissionCount: data.permissionIds.length
        }
      }
    })

    return role
  } catch (error) {
    console.error('Error updating role:', error)
    throw error instanceof Error ? error : new Error('Failed to update role')
  }
}