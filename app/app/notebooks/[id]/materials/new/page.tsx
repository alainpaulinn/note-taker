import { MaterialUpload } from "@/components/material-upload"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Plus, Link as LinkIcon, Upload } from "lucide-react"
import Link from "next/link"

interface NewMaterialPageProps {
  params: {
    id: string
  }
}

export default function NewMaterialPage({ params }: NewMaterialPageProps) {
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
          <h1 className="text-3xl font-bold tracking-tight">Add Materials</h1>
          <p className="text-muted-foreground">
            Upload files or add links to your notebook
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <MaterialUpload
            notebookId={params.id}
            onUpload={(material) => {
              console.log("Material uploaded:", material)
              // TODO: Show success message and redirect
            }}
          />
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Supported Formats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <Upload className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Images: PNG, JPG, GIF, WebP</span>
              </div>
              <div className="flex items-center gap-2">
                <Upload className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Videos: MP4, WebM, MOV</span>
              </div>
              <div className="flex items-center gap-2">
                <Upload className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Documents: PDF, DOC, DOCX</span>
              </div>
              <div className="flex items-center gap-2">
                <Upload className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Presentations: PPT, PPTX</span>
              </div>
              <div className="flex items-center gap-2">
                <Upload className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Text: TXT, MD</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <LinkIcon className="mr-2 h-4 w-4" />
                Add External Link
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Plus className="mr-2 h-4 w-4" />
                Create Note
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tips</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>• Use descriptive names for your materials</p>
              <p>• Add tags to organize content</p>
              <p>• Keep file sizes under 50MB</p>
              <p>• Use links for online resources</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
