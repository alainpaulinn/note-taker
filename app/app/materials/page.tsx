import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  Plus, 
  Search, 
  Filter, 
  Grid, 
  List, 
  Image, 
  Video, 
  FileText, 
  Link as LinkIcon,
  Download,
  Eye,
  Edit,
  Trash2
} from "lucide-react"
import Link from "next/link"

export default function MaterialsPage() {
  // Mock data - in real app, this would come from the database
  const materials = [
    {
      id: "1",
      name: "React Tutorial",
      type: "link",
      externalUrl: "https://react.dev/learn",
      tags: ["react", "tutorial", "frontend"],
      createdAt: new Date("2024-01-15"),
    },
    {
      id: "2",
      name: "Project Requirements.pdf",
      type: "pdf",
      fileName: "Project Requirements.pdf",
      fileSize: 1024000,
      tags: ["project", "requirements"],
      createdAt: new Date("2024-01-14"),
    },
    {
      id: "3",
      name: "Architecture Diagram",
      type: "image",
      fileName: "architecture.png",
      fileSize: 512000,
      tags: ["architecture", "diagram"],
      createdAt: new Date("2024-01-13"),
    },
  ]

  const getMaterialIcon = (type: string) => {
    switch (type) {
      case "image":
        return <Image className="h-4 w-4" />
      case "video":
        return <Video className="h-4 w-4" />
      case "pdf":
      case "document":
        return <FileText className="h-4 w-4" />
      case "link":
        return <LinkIcon className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Materials</h1>
          <p className="text-muted-foreground">
            Manage all your learning materials and resources
          </p>
        </div>
        <Button asChild>
          <Link href="/materials/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Material
          </Link>
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search materials..."
                  className="pl-10"
                />
              </div>
            </div>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
            <Button variant="outline" size="icon">
              <Grid className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <List className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Materials Grid */}
      {materials.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No materials yet</h3>
            <p className="text-muted-foreground text-center mb-6">
              Upload files or add links to get started
            </p>
            <Button asChild>
              <Link href="/materials/new">
                <Plus className="mr-2 h-4 w-4" />
                Add Material
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {materials.map((material) => (
            <Card key={material.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  {getMaterialIcon(material.type)}
                  <div className="flex-1">
                    <CardTitle className="text-lg">{material.name}</CardTitle>
                    <CardDescription>
                      {material.type === "link" 
                        ? "External link"
                        : `${material.type.toUpperCase()} • ${formatFileSize(material.fileSize || 0)}`
                      }
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-1 mb-4">
                  {material.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <div className="text-sm text-muted-foreground mb-4">
                  Added {material.createdAt.toLocaleDateString()}
                </div>
                <div className="flex gap-2">
                  <Button asChild variant="outline" size="sm" className="flex-1">
                    <Link href={material.externalUrl || "#"}>
                      <Eye className="mr-2 h-4 w-4" />
                      View
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Trash2 className="h-4 w-4" />
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
