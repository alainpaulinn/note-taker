import { createPage } from "@/app/actions/page"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, FileText, PenTool, Layers } from "lucide-react"
import Link from "next/link"

interface NewPagePageProps {
  params: {
    id: string
  }
}

export default function NewPagePage({ params }: NewPagePageProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/notebooks/${params.id}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Notebook
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Create New Page</h1>
          <p className="text-muted-foreground">
            Add a new page to your notebook
          </p>
        </div>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Page Details</CardTitle>
          <CardDescription>
            Configure your page settings and content type
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={createPage.bind(null, params.id)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                name="title"
                placeholder="Enter page title"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Page Type</Label>
              <Select name="type" defaultValue="text">
                <SelectTrigger>
                  <SelectValue placeholder="Select page type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Text Page - Rich text editor
                    </div>
                  </SelectItem>
                  <SelectItem value="drawing">
                    <div className="flex items-center gap-2">
                      <PenTool className="h-4 w-4" />
                      Drawing Page - Canvas for sketches
                    </div>
                  </SelectItem>
                  <SelectItem value="mixed">
                    <div className="flex items-center gap-2">
                      <Layers className="h-4 w-4" />
                      Mixed Page - Text and drawings
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Tags (comma-separated)</Label>
              <Input
                id="tags"
                name="tags"
                placeholder="e.g., important, study, review"
              />
            </div>

            <div className="flex gap-3">
              <Button type="submit">
                Create Page
              </Button>
              <Button type="button" variant="outline" asChild>
                <Link href={`/notebooks/${params.id}`}>
                  Cancel
                </Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
