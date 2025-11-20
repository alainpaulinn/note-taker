"use client"

import { useTransition, useState } from "react"
import { Sparkles, RefreshCcw } from "lucide-react"
import { summarizePage } from "@/app/actions/ai"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface AISummaryPanelProps {
  pageId: string
  initialSummary?: string
}

export function AISummaryPanel({ pageId, initialSummary }: AISummaryPanelProps) {
  const [isPending, startTransition] = useTransition()
  const [summary, setSummary] = useState(initialSummary ?? "")
  const [suggestions, setSuggestions] = useState<string[]>([])

  const handleSummarize = () => {
    startTransition(async () => {
      const result = await summarizePage(pageId)
      setSummary(result.summary)
      setSuggestions(result.suggestions)
    })
  }

  return (
    <Card className="border-primary/20 bg-gradient-to-b from-primary/5 via-background to-background">
      <CardHeader className="space-y-1">
        <CardTitle className="flex items-center gap-2 text-base">
          <Sparkles className="h-4 w-4 text-primary" />
          AI Recap
        </CardTitle>
        <Button
          variant="outline"
          size="sm"
          onClick={handleSummarize}
          disabled={isPending}
          className="w-full"
        >
          {isPending ? (
            <>
              <RefreshCcw className="mr-2 h-4 w-4 animate-spin" />
              Summarizing…
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Summarize note
            </>
          )}
        </Button>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        {summary ? (
          <p className="text-muted-foreground whitespace-pre-line">{summary}</p>
        ) : (
          <p className="text-muted-foreground">
            No recap yet. Trigger AI to distill the page into a TL;DR and
            suggested next steps.
          </p>
        )}
        {suggestions.length > 0 && (
          <ul className="space-y-1 text-xs text-muted-foreground">
            {suggestions.map((suggestion) => (
              <li
                key={suggestion}
                className="flex items-start gap-2 rounded-lg bg-background/80 px-3 py-2"
              >
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary" />
                {suggestion}
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
