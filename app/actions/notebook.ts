"use server"

import { auth } from "@/auth"
import { prisma } from "@/prisma/prisma"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { z } from "zod"

const createNotebookSchema = z.object({
  name: z.string().min(1, "Notebook name is required"),
  description: z.string().optional(),
  color: z.string().optional(),
  icon: z.string().optional(),
  visibility: z.enum(["private", "organization", "public"]).default("private"),
})

const updateNotebookSchema = createNotebookSchema.partial()

const DEFAULT_NOTEBOOK_COLORS = ["#3b82f6", "#10b981", "#f97316", "#8b5cf6", "#ec4899", "#14b8a6"]
const DEFAULT_NOTEBOOK_ICONS = ["book", "target", "graduation-cap", "sparkles", "star", "list"]

function pickRandom<T>(items: T[]) {
  return items[Math.floor(Math.random() * items.length)]
}

async function createStarterPage(notebookId: string, userId: string) {
  const starterContent = `<p class="text-base">Welcome to your new notebook. Capture study plans, meeting notes, or brainstorm ideas.</p>
  <ul>
    <li>Use the toolbar to switch between rich text and sketches.</li>
    <li>Tag notes so you can find them later.</li>
    <li>Invite collaborators from the notebook menu.</li>
  </ul>`

  return prisma.page.create({
    data: {
      title: "New page",
      content: starterContent,
      type: "mixed",
      notebookId,
      userId,
      order: 1,
      tags: [],
    },
  })
}

async function createNotebookWithDefaults(
  data: {
    name: string
    description?: string | null
    color?: string | null
    icon?: string | null
    visibility?: "private" | "organization" | "public"
  },
  userId: string,
) {
  const notebook = await prisma.notebook.create({
    data: {
      name: data.name,
      description: data.description,
      color: data.color || pickRandom(DEFAULT_NOTEBOOK_COLORS),
      icon: data.icon || pickRandom(DEFAULT_NOTEBOOK_ICONS),
      visibility: data.visibility || "private",
      userId,
    },
  })

  const starterPage = await createStarterPage(notebook.id, userId)
  return { notebook, starterPage }
}

export async function createNotebook(formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) {
    redirect("/signin")
  }

  const validatedFields = createNotebookSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    color: formData.get("color"),
    icon: formData.get("icon"),
    visibility: formData.get("visibility"),
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  const { name, description, color, icon, visibility } = validatedFields.data

  try {
    const { notebook, starterPage } = await createNotebookWithDefaults(
      { name, description, color, icon, visibility },
      session.user.id,
    )

    revalidatePath("/notebooks")
    redirect(`/app/notebooks/${notebook.id}/pages/${starterPage.id}/edit`)
  } catch (error) {
    console.error("Error creating notebook:", error)
    return {
      errors: {
        name: ["Failed to create notebook. Please try again."],
      },
    }
  }
}

export async function updateNotebook(id: string, formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) {
    redirect("/signin")
  }

  const validatedFields = updateNotebookSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    color: formData.get("color"),
    icon: formData.get("icon"),
    visibility: formData.get("visibility"),
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  try {
    // Check if user owns the notebook
    const existingNotebook = await prisma.notebook.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
    })

    if (!existingNotebook) {
      return {
        errors: {
          name: ["Notebook not found or you don't have permission to edit it."],
        },
      }
    }

    const notebook = await prisma.notebook.update({
      where: { id },
      data: validatedFields.data,
    })

    revalidatePath("/notebooks")
    revalidatePath(`/notebooks/${id}`)
    return { success: true, notebook }
  } catch (error) {
    console.error("Error updating notebook:", error)
    return {
      errors: {
        name: ["Failed to update notebook. Please try again."],
      },
    }
  }
}

export async function deleteNotebook(id: string) {
  const session = await auth()
  if (!session?.user?.id) {
    redirect("/signin")
  }

  try {
    // Check if user owns the notebook
    const existingNotebook = await prisma.notebook.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
    })

    if (!existingNotebook) {
      return {
        error: "Notebook not found or you don't have permission to delete it.",
      }
    }

    await prisma.notebook.delete({
      where: { id },
    })

    revalidatePath("/notebooks")
    return { success: true }
  } catch (error) {
    console.error("Error deleting notebook:", error)
    return {
      error: "Failed to delete notebook. Please try again.",
    }
  }
}

export async function getNotebooks() {
  const session = await auth()
  if (!session?.user?.id) {
    return []
  }

  try {
    const notebooks = await prisma.notebook.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        pages: {
          orderBy: {
            updatedAt: "desc",
          },
          take: 10,
        },
        _count: {
          select: {
            pages: true,
            materials: true,
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    })

    return notebooks
  } catch (error) {
    console.error("Error fetching notebooks:", error)
    return []
  }
}

export async function getNotebook(id: string) {
  const session = await auth()
  if (!session?.user?.id) {
    redirect("/signin")
  }

  try {
    const notebook = await prisma.notebook.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
      include: {
        pages: {
          orderBy: {
            order: "asc",
          },
        },
        materials: {
          orderBy: {
            createdAt: "desc",
          },
        },
        _count: {
          select: {
            pages: true,
            materials: true,
          },
        },
      },
    })

    return notebook
  } catch (error) {
    console.error("Error fetching notebook:", error)
    return null
  }
}

export async function recordNotebookAccess(notebookId: string) {
  const session = await auth()
  
  if (!session?.user?.id) {
    throw new Error("Unauthorized")
  }

  try {
    // TODO: Implement actual notebook access recording logic
    // This could update a lastAccessedAt field or create an access log
    console.log(`Recording notebook access: ${notebookId} by user: ${session.user.id}`)
    
    return { success: true }
  } catch (error) {
    console.error("Failed to record notebook access:", error)
    throw error
  }
}

export async function createInstantNotebook() {
  const session = await auth()
  if (!session?.user?.id) {
    redirect("/signin")
  }

  const name = `Notebook ${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`

  const { notebook, starterPage } = await createNotebookWithDefaults(
    {
      name,
      description: "Click to describe your notebook purpose.",
    },
    session.user.id,
  )

  return { notebookId: notebook.id, pageId: starterPage.id }
}
