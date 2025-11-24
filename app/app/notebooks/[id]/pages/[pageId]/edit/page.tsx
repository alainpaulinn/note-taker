import { getPage } from "@/app/actions/page"
import { UnifiedNoteSurface } from "@/components/unified-note-surface"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Eye } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { PageHeader } from "@/components/site-header"

interface PageEditorProps {
  params: Promise<{
    id: string
    pageId: string
  }>
}

export default async function PageEditor({ params }: PageEditorProps) {
  const { id, pageId } = await params
  const page = await getPage(pageId)

  if (!page) {
    notFound()
  }

  return (
    <>
      <PageHeader
        title={page.title}
        description={`Updated ${new Date(page.updatedAt).toLocaleString()}`}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href={`/app/notebooks/${id}`}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Link>
            </Button>
            <Button variant="ghost" size="sm" asChild>
              <Link href={`/app/notebooks/${id}/pages/${pageId}`}>
                <Eye className="mr-2 h-4 w-4" />
                View
              </Link>
            </Button>
          </div>
        }
      />
      <div className="relative min-h-[calc(100vh-2rem)] overflow-hidden rounded-3xl border border-border/50 bg-[radial-gradient(circle,_rgba(226,232,240,0.6)_1px,_transparent_1px)] bg-[length:20px_20px]">
        <div className="absolute inset-0 bg-gradient-to-br from-background/60 via-background/40 to-background/80" />
        <div className="relative h-full">
          <UnifiedNoteSurface
            pageId={page.id}
            initialContent={page.content || ""}
            initialDrawing={page.drawingData}
          />
        </div>
      </div>
    </>
  )
}
