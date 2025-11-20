"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { RichTextEditor } from "@/components/rich-text-editor"
import { renderMarkdown } from "@/lib/markdown/render"

interface DualModeEditorProps {
  defaultContent?: string
  onChange?: (value: string) => void
}

export function DualModeEditor({ defaultContent = "", onChange }: DualModeEditorProps) {
  const [mode, setMode] = useState<"visual" | "markdown">("visual")
  const [markdown, setMarkdown] = useState("")

  return (
    <Tabs value={mode} onValueChange={(value) => setMode(value as typeof mode)}>
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="visual">Visual</TabsTrigger>
        <TabsTrigger value="markdown">Markdown</TabsTrigger>
      </TabsList>
      <TabsContent value="visual" className="mt-4">
        <RichTextEditor content={defaultContent} onChange={onChange} />
      </TabsContent>
      <TabsContent value="markdown" className="mt-4 space-y-4">
        <Textarea
          rows={10}
          placeholder="Write in markdown..."
          value={markdown}
          onChange={(event) => {
            setMarkdown(event.target.value)
            onChange?.(renderMarkdown(event.target.value))
          }}
        />
        <div className="rounded-lg border border-border/60 p-4 text-sm text-muted-foreground prose prose-sm max-w-none">
          <div dangerouslySetInnerHTML={{ __html: renderMarkdown(markdown) }} />
        </div>
      </TabsContent>
    </Tabs>
  )
}
