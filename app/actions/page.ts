"use server"

import { auth } from "@/auth"
import { prisma } from "@/prisma/prisma"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { z } from "zod"

const createPageSchema = z.object({
  title: z.string().min(1, "Page title is required"),
  content: z.string().optional(),
  type: z.enum(["text", "drawing", "mixed"]).default("text"),
  drawingData: z.any().optional(),
  tags: z.array(z.string()).optional(),
})

const updatePageSchema = createPageSchema.partial()

export async function createPage(notebookId: string, formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) {
    redirect("/signin")
  }

  const validatedFields = createPageSchema.safeParse({
    title: formData.get("title"),
    content: formData.get("content"),
    type: formData.get("type"),
    drawingData: formData.get("drawingData") ? JSON.parse(formData.get("drawingData") as string) : undefined,
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
          title: ["Notebook not found or you don't have permission to add pages to it."],
        },
      }
    }

    // Get the next order number
    const lastPage = await prisma.page.findFirst({
      where: { notebookId },
      orderBy: { order: "desc" },
    })

    const page = await prisma.page.create({
      data: {
        ...validatedFields.data,
        notebookId,
        userId: session.user.id,
        order: (lastPage?.order || 0) + 1,
        tags: validatedFields.data.tags || [],
      },
    })

    revalidatePath(`/notebooks/${notebookId}`)
    return { success: true, page }
  } catch (error) {
    console.error("Error creating page:", error)
    return {
      errors: {
        title: ["Failed to create page. Please try again."],
      },
    }
  }
}

export async function updatePage(id: string, formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) {
    redirect("/signin")
  }

  const validatedFields = updatePageSchema.safeParse({
    title: formData.get("title"),
    content: formData.get("content"),
    type: formData.get("type"),
    drawingData: formData.get("drawingData") ? JSON.parse(formData.get("drawingData") as string) : undefined,
    tags: formData.get("tags") ? JSON.parse(formData.get("tags") as string) : undefined,
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  try {
    // Check if user owns the page
    const existingPage = await prisma.page.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
    })

    if (!existingPage) {
      return {
        errors: {
          title: ["Page not found or you don't have permission to edit it."],
        },
      }
    }

    const page = await prisma.page.update({
      where: { id },
      data: validatedFields.data,
    })

    revalidatePath(`/notebooks/${existingPage.notebookId}`)
    revalidatePath(`/notebooks/${existingPage.notebookId}/pages/${id}`)
    return { success: true, page }
  } catch (error) {
    console.error("Error updating page:", error)
    return {
      errors: {
        title: ["Failed to update page. Please try again."],
      },
    }
  }
}

export async function deletePage(id: string) {
  const session = await auth()
  if (!session?.user?.id) {
    redirect("/signin")
  }

  try {
    // Check if user owns the page
    const existingPage = await prisma.page.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
    })

    if (!existingPage) {
      return {
        error: "Page not found or you don't have permission to delete it.",
      }
    }

    await prisma.page.delete({
      where: { id },
    })

    revalidatePath(`/notebooks/${existingPage.notebookId}`)
    return { success: true }
  } catch (error) {
    console.error("Error deleting page:", error)
    return {
      error: "Failed to delete page. Please try again.",
    }
  }
}

export async function getPage(id: string) {
  const session = await auth()
  if (!session?.user?.id) {
    redirect("/signin")
  }

  try {
    const page = await prisma.page.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
      include: {
        notebook: true,
      },
    })

    return page
  } catch (error) {
    console.error("Error fetching page:", error)
    return null
  }
}

export async function reorderPages(notebookId: string, pageIds: string[]) {
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
        error: "Notebook not found or you don't have permission to reorder pages.",
      }
    }

    // Update the order of each page
    await Promise.all(
      pageIds.map((pageId, index) =>
        prisma.page.update({
          where: { id: pageId },
          data: { order: index },
        })
      )
    )

    revalidatePath(`/notebooks/${notebookId}`)
    return { success: true }
  } catch (error) {
    console.error("Error reordering pages:", error)
    return {
      error: "Failed to reorder pages. Please try again.",
    }
  }
}
