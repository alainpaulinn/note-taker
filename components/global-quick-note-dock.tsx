"use client"

import { useState, useTransition, FormEvent } from "react"
import { createQuickNote } from "@/app/actions/quick-note"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, PenSquare } from "lucide-react"

export function GlobalQuickNoteDock() {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [isPending, startTransition] = useTransition()

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!title && !content) return

    const formData = new FormData()
    formData.append("title", title || "Untitled note")
    formData.append("content", content)
    formData.append("notebookId", "new")

    startTransition(async () => {
      await createQuickNote(formData)
      setTitle("")
      setContent("")
    })
  }

  return (
    <Card className="border-primary/20 bg-gradient-to-r from-primary/10 via-background to-background shadow-sm">
      <CardContent className="p-4">
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 md:flex-row md:items-center">
          <div className="flex-1 space-y-2">
            <Input
              placeholder="Start typing a title…"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />
            <Textarea
              placeholder="Capture thoughts, meeting notes, research links…"
              rows={2}
              value={content}
              onChange={(event) => setContent(event.target.value)}
            />
          </div>
          <Button type="submit" size="lg" disabled={isPending} className="md:w-40">
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving…
              </>
            ) : (
              <>
                <PenSquare className="mr-2 h-4 w-4" />
                Drop note
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
