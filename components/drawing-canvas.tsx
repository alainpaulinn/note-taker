"use client"

import { Excalidraw } from "@excalidraw/excalidraw"
import { ExcalidrawImperativeAPI } from "@excalidraw/excalidraw/types/types"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Save, Undo, Redo, Download, Upload } from "lucide-react"

interface DrawingCanvasProps {
  initialData?: any
  onSave?: (data: any) => void
  onExport?: (data: any) => void
  onImport?: (data: any) => void
  editable?: boolean
}

export function DrawingCanvas({ 
  initialData, 
  onSave, 
  onExport, 
  onImport, 
  editable = true 
}: DrawingCanvasProps) {
  const [excalidrawAPI, setExcalidrawAPI] = useState<ExcalidrawImperativeAPI | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleSave = async () => {
    if (!excalidrawAPI) return
    
    setIsLoading(true)
    try {
      const elements = excalidrawAPI.getSceneElements()
      const appState = excalidrawAPI.getAppState()
      const data = { elements, appState }
      onSave?.(data)
    } catch (error) {
      console.error("Error saving drawing:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleExport = async () => {
    if (!excalidrawAPI) return
    
    try {
      const elements = excalidrawAPI.getSceneElements()
      const appState = excalidrawAPI.getAppState()
      const data = { elements, appState }
      
      // Create a blob and download
      const blob = new Blob([JSON.stringify(data, null, 2)], { 
        type: 'application/json' 
      })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `drawing-${Date.now()}.json`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
      
      onExport?.(data)
    } catch (error) {
      console.error("Error exporting drawing:", error)
    }
  }

  const handleImport = () => {
    fileInputRef.current?.click()
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string)
        excalidrawAPI?.updateScene(data)
        onImport?.(data)
      } catch (error) {
        console.error("Error importing drawing:", error)
      }
    }
    reader.readAsText(file)
  }

  const handleUndo = () => {
    excalidrawAPI?.history.undo()
  }

  const handleRedo = () => {
    excalidrawAPI?.history.redo()
  }

  return (
    <div className="flex flex-col gap-4 h-full">
      {editable && (
        <Card>
          <CardHeader>
            <CardTitle>Drawing Tools</CardTitle>
            <CardDescription>
              Use the toolbar below to draw, add shapes, and annotate
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 flex-wrap">
              <Button 
                onClick={handleSave} 
                disabled={isLoading}
                size="sm"
              >
                <Save className="mr-2 h-4 w-4" />
                {isLoading ? "Saving..." : "Save"}
              </Button>
              <Button 
                onClick={handleUndo} 
                variant="outline" 
                size="sm"
                disabled={!excalidrawAPI?.history.canUndo()}
              >
                <Undo className="mr-2 h-4 w-4" />
                Undo
              </Button>
              <Button 
                onClick={handleRedo} 
                variant="outline" 
                size="sm"
                disabled={!excalidrawAPI?.history.canRedo()}
              >
                <Redo className="mr-2 h-4 w-4" />
                Redo
              </Button>
              <Button 
                onClick={handleExport} 
                variant="outline" 
                size="sm"
              >
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
              <Button 
                onClick={handleImport} 
                variant="outline" 
                size="sm"
              >
                <Upload className="mr-2 h-4 w-4" />
                Import
              </Button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleFileUpload}
              className="hidden"
            />
          </CardContent>
        </Card>
      )}

      <Card className="flex-1">
        <CardContent className="p-0 h-[600px]">
          <Excalidraw
            ref={(api) => setExcalidrawAPI(api)}
            initialData={initialData}
            viewModeEnabled={!editable}
            zenModeEnabled={false}
            gridModeEnabled={true}
            theme="light"
            name="A-notes Drawing"
            UIOptions={{
              canvasActions: {
                loadScene: false,
                saveToActiveFile: false,
                export: false,
                toggleTheme: true,
              },
              tools: {
                image: true,
              },
            }}
          />
        </CardContent>
      </Card>
    </div>
  )
}

