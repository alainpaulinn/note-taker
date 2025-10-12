import { DrawingCanvas } from "@/components/drawing-canvas"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Save, Download, Upload } from "lucide-react"
import Link from "next/link"

export default function CanvasPage() {
  return (
    <div className="flex flex-col gap-6 h-full">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/app">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight">Drawing Canvas</h1>
          <p className="text-muted-foreground">
            Create diagrams, sketches, and visual notes
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Save className="mr-2 h-4 w-4" />
            Save to Notebook
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button variant="outline">
            <Upload className="mr-2 h-4 w-4" />
            Import
          </Button>
        </div>
      </div>

      <div className="flex-1 min-h-0">
        <DrawingCanvas
          onSave={(data) => {
            console.log("Saving drawing:", data)
            // TODO: Implement save to database
          }}
          onExport={(data) => {
            console.log("Exporting drawing:", data)
          }}
          onImport={(data) => {
            console.log("Importing drawing:", data)
          }}
        />
      </div>
    </div>
  )
}
