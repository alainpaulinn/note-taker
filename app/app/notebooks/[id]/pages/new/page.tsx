import { createInstantPage } from "@/app/actions/page"
import { redirect } from "next/navigation"

interface NewPagePageProps {
  params: Promise<{
    id: string
  }>
}

export default async function NewPagePage({ params }: NewPagePageProps) {
  const { id } = await params
  const page = await createInstantPage(id)
  redirect(`/app/notebooks/${id}/pages/${page.id}/edit`)
}
