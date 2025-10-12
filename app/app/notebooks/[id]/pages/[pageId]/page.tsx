import { getPage } from "@/app/actions/page"
import { RichTextEditor } from "@/components/rich-text-editor"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Edit, Share, Download, MoreHorizontal } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

interface PageViewerProps {
  params: {
    id: string
    pageId: string
  }
}

export default async function PageViewer({ params }: PageViewerProps) {
  const page = await getPage(params.pageId)

  if (!page) {
    notFound()
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/notebooks/${params.id}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Notebook
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight">{page.title}</h1>
          <div className="flex items-center gap-4 mt-2">
            <Badge variant="secondary">{page.type}</Badge>
            <span className="text-sm text-muted-foreground">
              Updated {new Date(page.updatedAt).toLocaleDateString()}
            </span>
            {page.tags.length > 0 && (
              <div className="flex gap-1">
                {page.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href={`/notebooks/${params.id}/pages/${params.pageId}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Link>
          </Button>
          <Button variant="outline" size="icon">
            <Share className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Download className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          {page.type === "text" || page.type === "mixed" ? (
            <div className="prose prose-sm max-w-none">
              <RichTextEditor
                content={page.content || ""}
                editable={false}
              />
            </div>
          ) : page.type === "drawing" ? (
            <div className="flex items-center justify-center h-96 border-2 border-dashed border-muted-foreground/25 rounded-lg">
              <div className="text-center">
                <div className="text-muted-foreground mb-2">
                  Drawing content will be displayed here
                </div>
                <Button asChild>
                  <Link href={`/notebooks/${params.id}/pages/${params.pageId}/edit`}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Drawing
                  </Link>
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-12">
              No content available
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
