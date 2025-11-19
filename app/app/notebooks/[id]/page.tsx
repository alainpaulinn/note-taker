import { getNotebook } from "@/app/actions/notebook"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { 
  Plus, 
  BookOpen, 
  FileText, 
  Image, 
  Edit, 
  Trash2, 
  ArrowLeft,
  Calendar,
  Tag
} from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

interface NotebookPageProps {
  params: {
    id: string
  }
}

export default async function NotebookPage({ params }: NotebookPageProps) {
  const notebook = await getNotebook(params.id)

  if (!notebook) {
    notFound()
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/app/notebooks">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Notebooks
          </Link>
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <div 
              className="w-10 h-10 rounded-lg flex items-center justify-center text-white"
              style={{ backgroundColor: notebook.color || "#3b82f6" }}
            >
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{notebook.name}</h1>
              <p className="text-muted-foreground">
                {notebook.description || "No description"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>Created {new Date(notebook.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-1">
              <Tag className="h-4 w-4" />
              <span>{notebook.visibility}</span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href={`/app/notebooks/${notebook.id}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Link>
          </Button>
          <Button variant="outline" size="icon">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Tabs defaultValue="pages" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="pages" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Pages ({notebook._count.pages})
          </TabsTrigger>
          <TabsTrigger value="materials" className="flex items-center gap-2">
            <Image className="h-4 w-4" />
            Materials ({notebook._count.materials})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pages" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Pages</h2>
            <Button asChild>
              <Link href={`/app/notebooks/${notebook.id}/pages/new`}>
                <Plus className="mr-2 h-4 w-4" />
                New Page
              </Link>
            </Button>
          </div>

          {notebook.pages.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No pages yet</h3>
                <p className="text-muted-foreground text-center mb-6">
                  Create your first page to start taking notes
                </p>
                <Button asChild>
                  <Link href={`/app/notebooks/${notebook.id}/pages/new`}>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Page
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {notebook.pages.map((page) => (
                <Card key={page.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">{page.title}</CardTitle>
                        <CardDescription>
                          {page.type === "text" && "Text page"}
                          {page.type === "drawing" && "Drawing page"}
                          {page.type === "mixed" && "Mixed content page"}
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        {page.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                      <span>Updated {new Date(page.updatedAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex gap-2">
                      <Button asChild variant="outline" size="sm" className="flex-1">
                        <Link href={`/app/notebooks/${notebook.id}/pages/${page.id}`}>
                          Open
                        </Link>
                      </Button>
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/app/notebooks/${notebook.id}/pages/${page.id}/edit`}>
                          Edit
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="materials" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Materials</h2>
            <Button asChild>
              <Link href={`/app/notebooks/${notebook.id}/materials/new`}>
                <Plus className="mr-2 h-4 w-4" />
                Add Material
              </Link>
            </Button>
          </div>

          {notebook.materials.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Image className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No materials yet</h3>
                <p className="text-muted-foreground text-center mb-6">
                  Upload files, add links, or attach resources to this notebook
                </p>
                <Button asChild>
                  <Link href={`/app/notebooks/${notebook.id}/materials/new`}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Material
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {notebook.materials.map((material) => (
                <Card key={material.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">{material.name}</CardTitle>
                        <CardDescription>
                          {material.type} • {material.fileSize ? `${(material.fileSize / 1024).toFixed(1)} KB` : "External link"}
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        {material.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                      <span>Added {new Date(material.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex gap-2">
                      <Button asChild variant="outline" size="sm" className="flex-1">
                        <Link href={material.externalUrl || material.fileUrl || "#"}>
                          Open
                        </Link>
                      </Button>
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/app/notebooks/${notebook.id}/materials/${material.id}/edit`}>
                          Edit
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
