"use client"

import * as React from "react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { RichTextEditor } from "@/components/rich-text-editor"
import { renderMarkdown } from "@/lib/markdown/render"
import { updatePageDrawing } from "@/app/actions/page"
import { PenTool, Eraser, Layers, EyeOff, RefreshCw } from "lucide-react"

type Point = { x: number; y: number }

interface Stroke {
  color: string
  width: number
  points: Point[]
}

function normalizeDrawingData(raw: any): Stroke[] {
  if (!raw) {
    return []
  }

  try {
    const data = typeof raw === "string" ? JSON.parse(raw) : raw
    if (data && Array.isArray(data.strokes)) {
      return data.strokes as Stroke[]
    }
  } catch (error) {
    console.warn("Failed to parse drawing data", error)
  }

  return []
}

function stripHtml(html: string) {
  if (!html) return ""
  return html.replace(/<[^>]+>/g, "").trim()
}

interface UnifiedNoteSurfaceProps {
  pageId: string
  initialContent?: string
  initialDrawing?: any
}

export function UnifiedNoteSurface({
  pageId,
  initialContent = "",
  initialDrawing,
}: UnifiedNoteSurfaceProps) {
  const [mode, setMode] = React.useState<"visual" | "markdown">("visual")
  const [visualContent, setVisualContent] = React.useState(initialContent)
  const [markdown, setMarkdown] = React.useState(() => stripHtml(initialContent))
  const [renderedMarkdown, setRenderedMarkdown] = React.useState(() =>
    renderMarkdown(markdown || "Start typing in markdown to see a preview."),
  )
  const [drawingEnabled, setDrawingEnabled] = React.useState(true)
  const [penColor, setPenColor] = React.useState("#111827")
  const [penWidth, setPenWidth] = React.useState(3)
  const [strokes, setStrokes] = React.useState<Stroke[]>(() =>
    normalizeDrawingData(initialDrawing),
  )
  const [liveStroke, setLiveStroke] = React.useState<Stroke | null>(null)
  const [isDrawing, setIsDrawing] = React.useState(false)
  const [isSavingDrawing, startSavingDrawing] = React.useTransition()

  const surfaceRef = React.useRef<HTMLDivElement>(null)
  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  const devicePixelRatioRef = React.useRef(typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1)

  React.useEffect(() => {
    setRenderedMarkdown(
      renderMarkdown(markdown || "Start typing in markdown to see a preview."),
    )
  }, [markdown])

  const drawStroke = React.useCallback((ctx: CanvasRenderingContext2D, stroke: Stroke) => {
    if (stroke.points.length < 2) {
      return
    }

    ctx.strokeStyle = stroke.color
    ctx.lineWidth = stroke.width
    ctx.lineJoin = "round"
    ctx.lineCap = "round"
    ctx.beginPath()
    stroke.points.forEach((point, index) => {
      if (index === 0) {
        ctx.moveTo(point.x, point.y)
      } else {
        ctx.lineTo(point.x, point.y)
      }
    })
    ctx.stroke()
  }, [])

  const resizeCanvas = React.useCallback(() => {
    const canvas = canvasRef.current
    const surface = surfaceRef.current
    if (!canvas || !surface) {
      return
    }
    const rect = surface.getBoundingClientRect()
    const ratio = window.devicePixelRatio || 1
    devicePixelRatioRef.current = ratio
    canvas.width = rect.width * ratio
    canvas.height = rect.height * ratio
    canvas.style.width = `${rect.width}px`
    canvas.style.height = `${rect.height}px`
    const ctx = canvas.getContext("2d")
    if (ctx) {
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0)
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      strokes.forEach((stroke) => drawStroke(ctx, stroke))
      if (liveStroke) {
        drawStroke(ctx, liveStroke)
      }
    }
  }, [strokes, liveStroke, drawStroke])

  React.useEffect(() => {
    resizeCanvas()
  }, [resizeCanvas])

  React.useEffect(() => {
    const observer = new ResizeObserver(() => resizeCanvas())
    if (surfaceRef.current) {
      observer.observe(surfaceRef.current)
    }
    return () => observer.disconnect()
  }, [resizeCanvas])

  const persistDrawing = React.useCallback(
    (payload: Stroke[]) => {
      startSavingDrawing(async () => {
        await updatePageDrawing(pageId, { strokes: payload })
      })
    },
    [pageId],
  )

  const getCanvasPoint = (event: React.PointerEvent<HTMLCanvasElement>): Point | null => {
    const canvas = canvasRef.current
    if (!canvas) return null
    const rect = canvas.getBoundingClientRect()
    const ratio = devicePixelRatioRef.current
    const x = (event.clientX - rect.left) * ratio
    const y = (event.clientY - rect.top) * ratio
    return { x, y }
  }

  const handlePointerDown = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawingEnabled) {
      return
    }
    event.preventDefault()
    const startPoint = getCanvasPoint(event)
    if (!startPoint) return
    setIsDrawing(true)
    setLiveStroke({
      color: penColor,
      width: penWidth,
      points: [startPoint],
    })
  }

  const handlePointerMove = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return
    event.preventDefault()
    const nextPoint = getCanvasPoint(event)
    if (!nextPoint) return
    setLiveStroke((prev) => {
      if (!prev) return prev
      return {
        ...prev,
        points: [...prev.points, nextPoint],
      }
    })
  }

  const handlePointerEnd = () => {
    if (!isDrawing) return
    setIsDrawing(false)
    setLiveStroke((current) => {
      if (!current || current.points.length < 2) {
        return null
      }
      setStrokes((prev) => {
        const updated = [...prev, current]
        persistDrawing(updated)
        return updated
      })
      return null
    })
  }

  const handleClear = () => {
    setStrokes([])
    setLiveStroke(null)
    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    if (ctx && canvas) {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
    }
    persistDrawing([])
  }

  React.useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    strokes.forEach((stroke) => drawStroke(ctx, stroke))
    if (liveStroke) {
      drawStroke(ctx, liveStroke)
    }
  }, [strokes, liveStroke, drawStroke])

  return (
    <div className="space-y-4 min-h-[calc(100vh-12rem)]">
      <Tabs value={mode} onValueChange={(value) => setMode(value as "visual" | "markdown")}>
        <TabsList className="w-full justify-start">
          <TabsTrigger value="visual">Visual editor</TabsTrigger>
          <TabsTrigger value="markdown">Markdown</TabsTrigger>
        </TabsList>
      </Tabs>
      <div
        ref={surfaceRef}
        className="relative min-h-[calc(100vh-16rem)] rounded-3xl border border-border/40 bg-card/90 p-4 lg:p-8 shadow-2xl"
      >
        <div className="relative z-0">
          {mode === "visual" ? (
            <div className="min-h-[calc(100vh-16rem)]">
              <RichTextEditor content={visualContent} onChange={setVisualContent} />
            </div>
          ) : (
            <div className="grid gap-6 lg:grid-cols-2 min-h-[calc(100vh-16rem)]">
              <Textarea
                value={markdown}
                onChange={(event) => setMarkdown(event.target.value)}
                className="min-h-[calc(100vh-18rem)]"
                placeholder="Write in markdown..."
              />
              <div className="rounded-2xl border border-border/60 bg-background/80 backdrop-blur p-4 prose prose-sm max-w-none min-h-[calc(100vh-18rem)]">
                <div dangerouslySetInnerHTML={{ __html: renderedMarkdown }} />
              </div>
            </div>
          )}
        </div>

        <canvas
          ref={canvasRef}
          className={`absolute inset-0 z-10 bg-transparent ${
            drawingEnabled ? "pointer-events-auto cursor-crosshair" : "pointer-events-none"
          }`}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerEnd}
          onPointerLeave={handlePointerEnd}
          style={{ touchAction: drawingEnabled ? "none" : "auto" }}
        />

        <div className="absolute right-6 top-6 z-20 flex flex-wrap items-center gap-2 rounded-2xl border border-border/50 bg-background/90 px-4 py-2 shadow-sm">
          <Button
            variant={drawingEnabled ? "default" : "outline"}
            size="sm"
            onClick={() => setDrawingEnabled((prev) => !prev)}
          >
            <PenTool className="mr-2 h-4 w-4" />
            {drawingEnabled ? "Drawing on" : "Draw"}
          </Button>
          <div className="flex items-center gap-2">
            {["#111827", "#f97316", "#10b981", "#0ea5e9", "#ec4899"].map((color) => (
              <button
                key={color}
                className={`h-6 w-6 rounded-full border-2 ${
                  penColor === color ? "border-primary" : "border-transparent"
                }`}
                style={{ backgroundColor: color }}
                onClick={() => setPenColor(color)}
                type="button"
              />
            ))}
          </div>
          <div className="flex items-center gap-2">
            <Eraser className="h-4 w-4 text-muted-foreground" />
            <Input
              type="range"
              min={2}
              max={12}
              value={penWidth}
              onChange={(event) => setPenWidth(Number(event.target.value))}
              className="w-24"
            />
          </div>
          <Button variant="ghost" size="icon" onClick={handleClear}>
            <RefreshCw className="h-4 w-4" />
            <span className="sr-only">Clear drawing</span>
          </Button>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Layers className="h-4 w-4" />
            {isSavingDrawing ? "Saving…" : "Overlay"}
            {!drawingEnabled && <EyeOff className="h-4 w-4" />}
          </div>
        </div>
      </div>
    </div>
  )
}
