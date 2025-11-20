"use server"

import { auth } from "@/auth"
import { prisma } from "@/prisma/prisma"
import { revalidatePath } from "next/cache"

export async function createQuickNote(formData: FormData) {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error("Unauthorized")
  }

  const notebookId = formData.get("notebookId") as string | null
  const title = (formData.get("title") as string | null)?.trim()
  const content = (formData.get("content") as string | null)?.trim()

  if (!title) {
    throw new Error("Title is required")
  }

  const notebook =
    notebookId && notebookId !== "new"
      ? await prisma.notebook.findFirst({
          where: {
            id: notebookId,
            userId: session.user.id,
          },
        })
      : null

  const destination =
    notebook ??
    (await prisma.notebook.create({
      data: {
        name: "Quick Captures",
        description: "Drop-zone for quick thoughts and meeting snippets.",
        userId: session.user.id,
        color: "#6C63FF",
      },
    }))

  const page = await prisma.page.create({
    data: {
      title,
      content,
      notebookId: destination.id,
      userId: session.user.id,
      tags: ["quick-capture"],
    },
  })

  revalidatePath("/app")
  revalidatePath(`/app/notebooks/${destination.id}`)

  return { success: true, page }
}
