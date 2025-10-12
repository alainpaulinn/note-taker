import { getNotebooks } from "@/app/actions/notebook"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PageHeader } from "@/components/site-header"
import { 
  BookOpen, 
  FileText, 
  Image, 
  Plus, 
  TrendingUp, 
  Clock,
  Users,
  Star
} from "lucide-react"
import Link from "next/link"

export default async function AppPage() {
  const notebooks = await getNotebooks()
  const recentNotebooks = notebooks.slice(0, 3)

  return (
    <>
      <PageHeader 
        title="Dashboard"
        description="Welcome to your learning workspace"
        actions={
          <Button asChild size="sm">
            <Link href="/app/notebooks/new">
              <Plus className="mr-2 h-4 w-4" />
              Create Notebook
            </Link>
          </Button>
        }
      />
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Welcome to NoteMaster</h1>
          <p className="text-xl text-muted-foreground mt-2">
            Your personal learning companion
          </p>
        </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Notebooks</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{notebooks.length}</div>
            <p className="text-xs text-muted-foreground">
              {notebooks.length === 0 ? "Create your first notebook" : "Active notebooks"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pages</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {notebooks.reduce((acc, notebook) => acc + notebook._count.pages, 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Across all notebooks
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Materials</CardTitle>
            <Image className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {notebooks.reduce((acc, notebook) => acc + notebook._count.materials, 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              Files and resources
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Learning Streak</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7</div>
            <p className="text-xs text-muted-foreground">
              Days in a row
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Notebooks</CardTitle>
            <CardDescription>
              Your most recently updated notebooks
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recentNotebooks.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8">
                <BookOpen className="h-8 w-8 text-muted-foreground mb-3" />
                <p className="text-sm text-muted-foreground text-center mb-4">
                  No notebooks yet. Create your first one to get started!
                </p>
                <Button asChild size="sm">
                  <Link href="/app/notebooks/new">
                    <Plus className="mr-2 h-4 w-4" />
                    Create Notebook
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {recentNotebooks.map((notebook) => (
                  <div key={notebook.id} className="flex items-center gap-3 p-3 rounded-lg border">
                    <div 
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm"
                      style={{ backgroundColor: notebook.color || "#3b82f6" }}
                    >
                      <BookOpen className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{notebook.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {notebook._count.pages} pages • {notebook._count.materials} materials
                      </p>
                    </div>
                    <Button asChild variant="ghost" size="sm">
                      <Link href={`/app/notebooks/${notebook.id}`}>
                        Open
                      </Link>
                    </Button>
                  </div>
                ))}
                <Button asChild variant="outline" className="w-full">
                  <Link href="/app/notebooks">
                    View All Notebooks
                  </Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common tasks to get you started
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              <Button asChild variant="outline" className="justify-start">
                <Link href="/app/notebooks/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Create New Notebook
                </Link>
              </Button>
              <Button asChild variant="outline" className="justify-start">
                <Link href="/app/canvas">
                  <FileText className="mr-2 h-4 w-4" />
                  Start Drawing
                </Link>
              </Button>
              <Button asChild variant="outline" className="justify-start">
                <Link href="/app/templates">
                  <Star className="mr-2 h-4 w-4" />
                  Browse Templates
                </Link>
              </Button>
              <Button asChild variant="outline" className="justify-start">
                <Link href="/app/materials">
                  <Image className="mr-2 h-4 w-4" />
                  Manage Materials
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      </div>
    </>
  )
}
