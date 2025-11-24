import { createInstantNotebook } from "@/app/actions/notebook"
import { redirect } from "next/navigation"

export default async function NewNotebookPage() {
  const { notebookId, pageId } = await createInstantNotebook()
  redirect(`/app/notebooks/${notebookId}/pages/${pageId}/edit`)
}
