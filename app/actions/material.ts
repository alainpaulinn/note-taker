"use server"

import { auth } from "@/auth"
import { prisma } from "@/prisma/prisma"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { z } from "zod"

const createMaterialSchema = z.object({
  name: z.string().min(1, "Material name is required"),
  description: z.string().optional(),
  type: z.string().min(1, "Material type is required"),
  fileUrl: z.string().optional(),
  fileName: z.string().optional(),
  fileSize: z.number().optional(),
  mimeType: z.string().optional(),
  thumbnailUrl: z.string().optional(),
  externalUrl: z.string().optional(),
  tags: z.array(z.string()).optional(),
})

const updateMaterialSchema = createMaterialSchema.partial()

export async function createMaterial(notebookId: string, formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) {
    redirect("/signin")
  }

  const validatedFields = createMaterialSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    type: formData.get("type"),
    fileUrl: formData.get("fileUrl"),
    fileName: formData.get("fileName"),
    fileSize: formData.get("fileSize") ? parseInt(formData.get("fileSize") as string) : undefined,
    mimeType: formData.get("mimeType"),
    thumbnailUrl: formData.get("thumbnailUrl"),
    externalUrl: formData.get("externalUrl"),
    tags: formData.get("tags") ? JSON.parse(formData.get("tags") as string) : [],
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  try {
    // Check if user owns the notebook
    const notebook = await prisma.notebook.findFirst({
      where: {
        id: notebookId,
        userId: session.user.id,
      },
    })

    if (!notebook) {
      return {
        errors: {
          name: ["Notebook not found or you don't have permission to add materials to it."],
        },
      }
    }

    const material = await prisma.material.create({
      data: {
        ...validatedFields.data,
        notebookId,
        userId: session.user.id,
        tags: validatedFields.data.tags || [],
      },
    })

    revalidatePath(`/notebooks/${notebookId}`)
    return { success: true, material }
  } catch (error) {
    console.error("Error creating material:", error)
    return {
      errors: {
        name: ["Failed to create material. Please try again."],
      },
    }
  }
}

export async function updateMaterial(id: string, formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) {
    redirect("/signin")
  }

  const validatedFields = updateMaterialSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    type: formData.get("type"),
    fileUrl: formData.get("fileUrl"),
    fileName: formData.get("fileName"),
    fileSize: formData.get("fileSize") ? parseInt(formData.get("fileSize") as string) : undefined,
    mimeType: formData.get("mimeType"),
    thumbnailUrl: formData.get("thumbnailUrl"),
    externalUrl: formData.get("externalUrl"),
    tags: formData.get("tags") ? JSON.parse(formData.get("tags") as string) : undefined,
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  try {
    // Check if user owns the material
    const existingMaterial = await prisma.material.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
    })

    if (!existingMaterial) {
      return {
        errors: {
          name: ["Material not found or you don't have permission to edit it."],
        },
      }
    }

    const material = await prisma.material.update({
      where: { id },
      data: validatedFields.data,
    })

    revalidatePath(`/notebooks/${existingMaterial.notebookId}`)
    return { success: true, material }
  } catch (error) {
    console.error("Error updating material:", error)
    return {
      errors: {
        name: ["Failed to update material. Please try again."],
      },
    }
  }
}

export async function deleteMaterial(id: string) {
  const session = await auth()
  if (!session?.user?.id) {
    redirect("/signin")
  }

  try {
    // Check if user owns the material
    const existingMaterial = await prisma.material.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
    })

    if (!existingMaterial) {
      return {
        error: "Material not found or you don't have permission to delete it.",
      }
    }

    await prisma.material.delete({
      where: { id },
    })

    revalidatePath(`/notebooks/${existingMaterial.notebookId}`)
    return { success: true }
  } catch (error) {
    console.error("Error deleting material:", error)
    return {
      error: "Failed to delete material. Please try again.",
    }
  }
}

export async function getMaterial(id: string) {
  const session = await auth()
  if (!session?.user?.id) {
    redirect("/signin")
  }

  try {
    const material = await prisma.material.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
      include: {
        notebook: true,
      },
    })

    return material
  } catch (error) {
    console.error("Error fetching material:", error)
    return null
  }
}

export async function uploadMaterialFile(notebookId: string, file: File) {
  const session = await auth()
  if (!session?.user?.id) {
    redirect("/signin")
  }

  try {
    // Check if user owns the notebook
    const notebook = await prisma.notebook.findFirst({
      where: {
        id: notebookId,
        userId: session.user.id,
      },
    })

    if (!notebook) {
      return {
        error: "Notebook not found or you don't have permission to upload materials to it.",
      }
    }

    // In a real application, you would upload the file to a storage service like AWS S3, Cloudinary, etc.
    // For now, we'll just create a placeholder URL
    const fileUrl = `/uploads/${file.name}`
    
    const material = await prisma.material.create({
      data: {
        name: file.name,
        type: file.type.split('/')[0] || 'file',
        fileUrl,
        fileName: file.name,
        fileSize: file.size,
        mimeType: file.type,
        notebookId,
        userId: session.user.id,
        tags: [],
      },
    })

    revalidatePath(`/notebooks/${notebookId}`)
    return { success: true, material }
  } catch (error) {
    console.error("Error uploading material:", error)
    return {
      error: "Failed to upload material. Please try again.",
    }
  }
}
