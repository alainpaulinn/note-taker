import { getNotebook } from "@/app/actions/notebook"
import { Button } from "@/components/ui/button"
import { PageHeader } from "@/components/site-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  BookOpen, 
  FileText, 
  Image, 
  Settings,
  Plus,
  Video,
  Headphones,
  PenTool,
  Layers,
  Clock,
  TrendingUp,
  Target,
  Sparkles,
  ArrowRight,
  Play,
  CheckCircle2,
  Circle
} from "lucide-react"
import Link from "next/link"
import { redirect } from "next/navigation"

interface NotebookPageProps {
  params: {
    id: string
  }
}

export default async function NotebookPage({ params }: NotebookPageProps) {
  const notebook = await getNotebook(params.id)

  if (!notebook) {
    redirect("/app/notebooks")
  }

  // Calculate progress
  const totalItems = notebook._count.pages + notebook._count.materials
  const completedItems = 0 // TODO: Track completed items
  const progress = totalItems > 0 ? (completedItems / totalItems) * 100 : 0

  return (
    <>
      <PageHeader 
        title={notebook.name}
        description={notebook.description || "Your learning space"}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href={`/app/notebooks/${notebook.id}/config`}>
                <Settings className="mr-2 h-4 w-4" />
                Configure
              </Link>
            </Button>
            <Button size="sm" asChild>
              <Link href={`/app/notebooks/${notebook.id}/chapters/new`}>
                <Plus className="mr-2 h-4 w-4" />
                New Chapter
              </Link>
            </Button>
          </div>
        }
      />
      
      <div className="flex flex-col gap-6">
        {/* Welcome Banner */}
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200 dark:border-blue-800">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-lg"
                    style={{ backgroundColor: notebook.color || "#3b82f6" }}
                  >
                    <BookOpen className="h-6 w-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">{notebook.name}</h2>
                    <p className="text-sm text-muted-foreground">
                      {notebook.description || "Start your learning journey"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 mt-4">
                  <Badge variant="secondary" className="gap-1">
                    <CheckCircle2 className="h-3 w-3" />
                    {completedItems} / {totalItems} completed
                  </Badge>
                  <Badge variant="outline" className="gap-1">
                    <Clock className="h-3 w-3" />
                    Updated {new Date(notebook.updatedAt).toLocaleDateString()}
                  </Badge>
                  <Badge variant="outline" className="gap-1 capitalize">
                    {notebook.visibility}
                  </Badge>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                  {Math.round(progress)}%
                </div>
                <p className="text-xs text-muted-foreground">Progress</p>
              </div>
            </div>
            <div className="mt-4">
              <Progress value={progress} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Link href={`/app/notebooks/${notebook.id}/chapters`}>
            <Card className="hover:shadow-lg transition-all cursor-pointer hover:scale-105 border-2 hover:border-blue-500">
              <CardHeader className="pb-3">
                <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center mb-2">
                  <Layers className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <CardTitle className="text-lg">Chapters</CardTitle>
                <CardDescription>Organize your learning</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{notebook._count.pages}</div>
                <p className="text-xs text-muted-foreground">sections</p>
              </CardContent>
            </Card>
          </Link>

          <Link href={`/app/notebooks/${notebook.id}/materials`}>
            <Card className="hover:shadow-lg transition-all cursor-pointer hover:scale-105 border-2 hover:border-purple-500">
              <CardHeader className="pb-3">
                <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900 flex items-center justify-center mb-2">
                  <Image className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <CardTitle className="text-lg">Materials</CardTitle>
                <CardDescription>Files & resources</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{notebook._count.materials}</div>
                <p className="text-xs text-muted-foreground">files</p>
              </CardContent>
            </Card>
          </Link>

          <Link href={`/app/notebooks/${notebook.id}/audio`}>
            <Card className="hover:shadow-lg transition-all cursor-pointer hover:scale-105 border-2 hover:border-green-500">
              <CardHeader className="pb-3">
                <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900 flex items-center justify-center mb-2">
                  <Headphones className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <CardTitle className="text-lg">Audio Notes</CardTitle>
                <CardDescription>Voice recordings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
                <p className="text-xs text-muted-foreground">recordings</p>
              </CardContent>
            </Card>
          </Link>

          <Link href={`/app/notebooks/${notebook.id}/videos`}>
            <Card className="hover:shadow-lg transition-all cursor-pointer hover:scale-105 border-2 hover:border-orange-500">
              <CardHeader className="pb-3">
                <div className="w-10 h-10 rounded-lg bg-orange-100 dark:bg-orange-900 flex items-center justify-center mb-2">
                  <Video className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                </div>
                <CardTitle className="text-lg">Videos</CardTitle>
                <CardDescription>Visual learning</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
                <p className="text-xs text-muted-foreground">videos</p>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Main Content Area */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="notes">Notes</TabsTrigger>
            <TabsTrigger value="drawings">Drawings</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              {/* Getting Started */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-yellow-500" />
                    Getting Started
                  </CardTitle>
                  <CardDescription>
                    Quick actions to begin your learning journey
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button asChild variant="outline" className="w-full justify-between">
                    <Link href={`/app/notebooks/${notebook.id}/chapters/new`}>
                      <span className="flex items-center gap-2">
                        <Layers className="h-4 w-4" />
                        Create your first chapter
                      </span>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full justify-between">
                    <Link href={`/app/notebooks/${notebook.id}/materials/new`}>
                      <span className="flex items-center gap-2">
                        <Image className="h-4 w-4" />
                        Upload study materials
                      </span>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full justify-between">
                    <Link href={`/app/notebooks/${notebook.id}/notes/new`}>
                      <span className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Write your first note
                      </span>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full justify-between">
                    <Link href={`/app/notebooks/${notebook.id}/drawings/new`}>
                      <span className="flex items-center gap-2">
                        <PenTool className="h-4 w-4" />
                        Start drawing
                      </span>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Learning Goals */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-blue-500" />
                    Learning Goals
                  </CardTitle>
                  <CardDescription>
                    Track your progress and achievements
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2">
                        <Circle className="h-4 w-4 text-muted-foreground" />
                        Complete all chapters
                      </span>
                      <span className="text-muted-foreground">0%</span>
                    </div>
                    <Progress value={0} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2">
                        <Circle className="h-4 w-4 text-muted-foreground" />
                        Review all materials
                      </span>
                      <span className="text-muted-foreground">0%</span>
                    </div>
                    <Progress value={0} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2">
                        <Circle className="h-4 w-4 text-muted-foreground" />
                        Practice with exercises
                      </span>
                      <span className="text-muted-foreground">0%</span>
                    </div>
                    <Progress value={0} className="h-2" />
                  </div>
                  <Button asChild variant="link" className="w-full">
                    <Link href={`/app/notebooks/${notebook.id}/config`}>
                      <Settings className="mr-2 h-4 w-4" />
                      Set custom goals
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-500" />
                  Recent Activity
                </CardTitle>
                <CardDescription>
                  Your latest work in this notebook
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Clock className="h-12 w-12 text-muted-foreground mb-3" />
                  <p className="text-sm text-muted-foreground mb-2">
                    No activity yet
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Start learning to see your progress here
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notes" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Handwritten & Typed Notes
                </CardTitle>
                <CardDescription>
                  All your notes in one place
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center py-8">
                  <FileText className="h-12 w-12 text-muted-foreground mb-3" />
                  <p className="text-sm text-muted-foreground mb-4">
                    No notes yet. Start writing to capture your ideas!
                  </p>
                  <Button asChild>
                    <Link href={`/app/notebooks/${notebook.id}/notes/new`}>
                      <Plus className="mr-2 h-4 w-4" />
                      Create Note
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="drawings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PenTool className="h-5 w-5" />
                  Drawings & Diagrams
                </CardTitle>
                <CardDescription>
                  Visual notes and sketches
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center py-8">
                  <PenTool className="h-12 w-12 text-muted-foreground mb-3" />
                  <p className="text-sm text-muted-foreground mb-4">
                    No drawings yet. Visualize your ideas!
                  </p>
                  <Button asChild>
                    <Link href={`/app/notebooks/${notebook.id}/drawings/new`}>
                      <Plus className="mr-2 h-4 w-4" />
                      Start Drawing
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Activity Timeline
                </CardTitle>
                <CardDescription>
                  Track your learning journey
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center py-8">
                  <Clock className="h-12 w-12 text-muted-foreground mb-3" />
                  <p className="text-sm text-muted-foreground mb-2">
                    No activity to show yet
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Your learning activities will appear here
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  )
}