import { createNotebook } from "@/app/actions/notebook"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, BookOpen, Palette, Eye } from "lucide-react"
import Link from "next/link"

const colors = [
  { name: "Blue", value: "#3b82f6" },
  { name: "Green", value: "#10b981" },
  { name: "Purple", value: "#8b5cf6" },
  { name: "Red", value: "#ef4444" },
  { name: "Orange", value: "#f59e0b" },
  { name: "Pink", value: "#ec4899" },
  { name: "Indigo", value: "#6366f1" },
  { name: "Teal", value: "#14b8a6" },
]

const icons = [
  { name: "Book", value: "book" },
  { name: "Graduation Cap", value: "graduation-cap" },
  { name: "Lightbulb", value: "lightbulb" },
  { name: "Target", value: "target" },
  { name: "Rocket", value: "rocket" },
  { name: "Star", value: "star" },
  { name: "Heart", value: "heart" },
  { name: "Zap", value: "zap" },
]

export default function NewNotebookPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/notebooks">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Notebooks
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Create New Notebook</h1>
          <p className="text-muted-foreground">
            Set up a new notebook for your learning materials
          </p>
        </div>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Notebook Details</CardTitle>
          <CardDescription>
            Configure your notebook settings and appearance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={createNotebook} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                name="name"
                placeholder="Enter notebook name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Describe what this notebook is for"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="color">Color</Label>
                <Select name="color" defaultValue="#3b82f6">
                  <SelectTrigger>
                    <SelectValue placeholder="Select color" />
                  </SelectTrigger>
                  <SelectContent>
                    {colors.map((color) => (
                      <SelectItem key={color.value} value={color.value}>
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-4 h-4 rounded-full border"
                            style={{ backgroundColor: color.value }}
                          />
                          {color.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="icon">Icon</Label>
                <Select name="icon" defaultValue="book">
                  <SelectTrigger>
                    <SelectValue placeholder="Select icon" />
                  </SelectTrigger>
                  <SelectContent>
                    {icons.map((icon) => (
                      <SelectItem key={icon.value} value={icon.value}>
                        {icon.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="visibility">Visibility</Label>
              <Select name="visibility" defaultValue="private">
                <SelectTrigger>
                  <SelectValue placeholder="Select visibility" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="private">
                    <div className="flex items-center gap-2">
                      <Eye className="h-4 w-4" />
                      Private - Only you can see this notebook
                    </div>
                  </SelectItem>
                  <SelectItem value="organization">
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4" />
                      Organization - Your organization can see this notebook
                    </div>
                  </SelectItem>
                  <SelectItem value="public">
                    <div className="flex items-center gap-2">
                      <Palette className="h-4 w-4" />
                      Public - Anyone can see this notebook
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-3">
              <Button type="submit">
                Create Notebook
              </Button>
              <Button type="button" variant="outline" asChild>
                <Link href="/notebooks">
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
