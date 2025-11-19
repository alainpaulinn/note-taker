import { getNotebooks } from "@/app/actions/notebook"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, BookOpen, FileText, Image } from "lucide-react"
import Link from "next/link"

export default async function NotebooksPage() {
  const notebooks = await getNotebooks()

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Notebooks</h1>
          <p className="text-muted-foreground">
            Organize your learning materials and notes
          </p>
        </div>
        <Button asChild>
          <Link href="/app/notebooks/new">
            <Plus className="mr-2 h-4 w-4" />
            New Notebook
          </Link>
        </Button>
      </div>

      {notebooks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12">
          <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No notebooks yet</h3>
          <p className="text-muted-foreground text-center mb-6">
            Create your first notebook to start organizing your learning materials
          </p>
          <Button asChild>
            <Link href="/app/notebooks/new">
              <Plus className="mr-2 h-4 w-4" />
              Create Notebook
            </Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {notebooks.map((notebook) => (
            <Card key={notebook.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-white"
                    style={{ backgroundColor: notebook.color || "#3b82f6" }}
                  >
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg">{notebook.name}</CardTitle>
                    <CardDescription className="text-sm">
                      {notebook.description || "No description"}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-1">
                    <FileText className="h-4 w-4" />
                    <span>{notebook._count.pages} pages</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Image className="h-4 w-4" />
                    <span>{notebook._count.materials} materials</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button asChild variant="outline" size="sm" className="flex-1">
                    <Link href={`/app/notebooks/${notebook.id}`}>
                      Open
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/app/notebooks/${notebook.id}/edit`}>
                      Edit
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
