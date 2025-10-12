"use server"

import { auth } from "@/auth"
import { prisma } from "@/prisma/prisma"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { randomBytes } from "crypto"

// Get current user session
async function getCurrentUser() {
  const session = await auth()
  if (!session?.user?.id) {
    redirect("/signin")
  }
  return session.user.id
}

// Account/Profile Actions
export async function getUserProfile() {
  try {
    const userId = await getCurrentUser()
    
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        company: true,
        jobTitle: true,
        bio: true,
        timezone: true,
        image: true,
      }
    })

    if (!user) {
      throw new Error("User not found")
    }

    return { success: true, data: user }
  } catch (error) {
    console.error("Error fetching user profile:", error)
    return { success: false, error: "Failed to fetch profile data" }
  }
}

export async function updateUserProfile(data: {
  firstName?: string
  lastName?: string
  email?: string
  company?: string
  jobTitle?: string
  bio?: string
  timezone?: string
  image?: string
}) {
  try {
    const userId = await getCurrentUser()
    
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        company: data.company,
        jobTitle: data.jobTitle,
        bio: data.bio,
        timezone: data.timezone,
        image: data.image,
      }
    })

    revalidatePath("/settings/account")
    return { success: true, data: updatedUser }
  } catch (error) {
    console.error("Error updating user profile:", error)
    return { success: false, error: "Failed to update profile" }
  }
}

// Notification Settings Actions
export async function getNotificationSettings() {
  try {
    const userId = await getCurrentUser()
    
    let settings = await prisma.notificationSettings.findUnique({
      where: { userId }
    })

    // Create default settings if they don't exist
    if (!settings) {
      settings = await prisma.notificationSettings.create({
        data: { userId }
      })
    }

    return { success: true, data: settings }
  } catch (error) {
    console.error("Error fetching notification settings:", error)
    return { success: false, error: "Failed to fetch notification settings" }
  }
}

export async function updateNotificationSettings(data: {
  designComplete?: boolean
  collaboration?: boolean
  weeklyReports?: boolean
  marketing?: boolean
  billing?: boolean
  emailNotifications?: boolean
  pushNotifications?: boolean
  smsNotifications?: boolean
}) {
  try {
    const userId = await getCurrentUser()
    
    const settings = await prisma.notificationSettings.upsert({
      where: { userId },
      update: data,
      create: { userId, ...data }
    })

    revalidatePath("/settings/notifications")
    return { success: true, data: settings }
  } catch (error) {
    console.error("Error updating notification settings:", error)
    return { success: false, error: "Failed to update notification settings" }
  }
}

// User Preferences Actions
export async function getUserPreferences() {
  try {
    const userId = await getCurrentUser()
    
    let preferences = await prisma.userPreferences.findUnique({
      where: { userId }
    })

    // Create default preferences if they don't exist
    if (!preferences) {
      preferences = await prisma.userPreferences.create({
        data: { userId }
      })
    }

    return { success: true, data: preferences }
  } catch (error) {
    console.error("Error fetching user preferences:", error)
    return { success: false, error: "Failed to fetch preferences" }
  }
}

export async function updateUserPreferences(data: {
  theme?: string
  units?: string
  autoSaveInterval?: string
  showGrid?: boolean
  enableTooltips?: boolean
}) {
  try {
    const userId = await getCurrentUser()
    
    const preferences = await prisma.userPreferences.upsert({
      where: { userId },
      update: data,
      create: { userId, ...data }
    })

    revalidatePath("/settings/preferences")
    return { success: true, data: preferences }
  } catch (error) {
    console.error("Error updating user preferences:", error)
    return { success: false, error: "Failed to update preferences" }
  }
}

// Security Actions
export async function updatePassword(data: {
  currentPassword: string
  newPassword: string
}) {
  try {
    const userId = await getCurrentUser()
    
    // For demo purposes - in a real app, you'd need to handle password verification
    // This would require storing hashed passwords and verifying the current password
    
    // Simulate password update
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    return { success: true, message: "Password updated successfully" }
  } catch (error) {
    console.error("Error updating password:", error)
    return { success: false, error: "Failed to update password" }
  }
}

// API Key Actions
export async function getUserApiKeys() {
  try {
    const userId = await getCurrentUser()
    
    const apiKeys = await prisma.apiKey.findMany({
      where: { userId, isActive: true },
      select: {
        id: true,
        name: true,
        key: true,
        lastUsed: true,
        createdAt: true,
      }
    })

    // Mask the keys for security
    const maskedKeys = apiKeys.map(key => ({
      ...key,
      key: `${key.key.substring(0, 8)}${'•'.repeat(16)}`
    }))

    return { success: true, data: maskedKeys }
  } catch (error) {
    console.error("Error fetching API keys:", error)
    return { success: false, error: "Failed to fetch API keys" }
  }
}

export async function generateApiKey(name: string) {
  try {
    const userId = await getCurrentUser()
    
    const key = `ak_${randomBytes(16).toString('hex')}`
    
    const apiKey = await prisma.apiKey.create({
      data: {
        userId,
        name,
        key,
      }
    })

    revalidatePath("/settings/security")
    return { success: true, data: apiKey }
  } catch (error) {
    console.error("Error generating API key:", error)
    return { success: false, error: "Failed to generate API key" }
  }
}

export async function deleteApiKey(keyId: string) {
  try {
    const userId = await getCurrentUser()
    
    await prisma.apiKey.update({
      where: { 
        id: keyId,
        userId // Ensure user can only delete their own keys
      },
      data: { isActive: false }
    })

    revalidatePath("/settings/security")
    return { success: true, message: "API key deleted successfully" }
  } catch (error) {
    console.error("Error deleting API key:", error)
    return { success: false, error: "Failed to delete API key" }
  }
} 