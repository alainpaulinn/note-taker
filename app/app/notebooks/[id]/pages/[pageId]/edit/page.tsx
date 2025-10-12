import { getPage, updatePage } from "@/app/actions/page"
import { RichTextEditor } from "@/components/rich-text-editor"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Save, Eye, Edit } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

interface PageEditorProps {
  params: {
    id: string
    pageId: string
  }
}

export default async function PageEditor({ params }: PageEditorProps) {
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
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href={`/notebooks/${params.id}/pages/${params.pageId}`}>
              <Eye className="mr-2 h-4 w-4" />
              View
            </Link>
          </Button>
          <Button>
            <Save className="mr-2 h-4 w-4" />
            Save
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>Page Content</CardTitle>
              <CardDescription>
                Edit your page content using the rich text editor
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RichTextEditor
                content={page.content || ""}
                placeholder="Start writing your notes..."
              />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Page Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  defaultValue={page.title}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags">Tags</Label>
                <div className="flex flex-wrap gap-2">
                  {page.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <Input
                  placeholder="Add tags..."
                />
              </div>

              <div className="space-y-2">
                <Label>Page Type</Label>
                <div className="text-sm text-muted-foreground">
                  {page.type === "text" && "Text Page"}
                  {page.type === "drawing" && "Drawing Page"}
                  {page.type === "mixed" && "Mixed Content Page"}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Edit className="mr-2 h-4 w-4" />
                Duplicate Page
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Move to Another Notebook
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
