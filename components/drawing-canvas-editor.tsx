"use client"

import { useTransition } from "react"
import { DrawingCanvas } from "@/components/drawing-canvas"
import { updatePageDrawing } from "@/app/actions/page"

interface DrawingCanvasEditorProps {
  pageId: string
  initialData?: any
}

export function DrawingCanvasEditor({ pageId, initialData }: DrawingCanvasEditorProps) {
  const [isPending, startTransition] = useTransition()
  return (
    <DrawingCanvas
      initialData={initialData}
      editable={!isPending}
      onSave={(data) =>
        startTransition(async () => {
          await updatePageDrawing(pageId, data)
        })
      }
    />
  )
}
