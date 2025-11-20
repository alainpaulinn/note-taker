"use client"

import { useTransition } from "react"
import { createQuickNote } from "@/app/actions/quick-note"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, PenSquare } from "lucide-react"
import { useFormStatus } from "react-dom"

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <PenSquare className="mr-2 h-4 w-4" />}
      Drop note
    </Button>
  )
}

export function QuickCaptureCard() {
  const [, startTransition] = useTransition()

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-primary/10 via-background to-background">
      <CardHeader>
        <CardTitle className="text-base">Quick capture</CardTitle>
        <p className="text-sm text-muted-foreground">
          Jot down meeting takeaways or study reminders. We'll drop them into your Quick Captures notebook.
        </p>
      </CardHeader>
      <CardContent>
        <form
          action={(formData) =>
            startTransition(async () => {
              await createQuickNote(formData)
            })
          }
          className="space-y-3"
        >
          <Input name="title" placeholder="Title" required />
          <Textarea name="content" placeholder="Details, decisions, next steps..." rows={4} />
          <input type="hidden" name="notebookId" value="new" />
          <SubmitButton />
        </form>
      </CardContent>
    </Card>
  )
}
