"use client"

import { useMemo } from "react"
import { Calendar, Clock, Target } from "lucide-react"
import type { Page, Notebook } from "@prisma/client"

interface PlannerProps {
  notebooks: (Notebook & { pages: Page[] })[]
}

export function NotebookPlanner({ notebooks }: PlannerProps) {
  const agenda = useMemo(() => {
    const entries: {
      notebook: string
      title: string
      date: Date
      pageCount: number
    }[] = []

    notebooks.forEach((notebook) => {
      notebook.pages.slice(0, 6).forEach((page) => {
        entries.push({
          notebook: notebook.name,
          title: page.title,
          date: new Date(page.updatedAt ?? page.createdAt),
          pageCount: notebook.pages.length,
        })
      })
    })

    return entries
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .slice(0, 6)
  }, [notebooks])

  if (agenda.length === 0) {
    return (
      <div className="rounded-2xl border border-border/60 bg-card/40 p-6">
        <div className="flex items-center gap-3 text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>No dated notes yet. Create a note to see it scheduled here.</span>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-border/60 bg-card/40 p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            Upcoming Sessions
          </p>
          <p className="text-lg font-semibold">Date-based notes</p>
        </div>
        <Target className="h-5 w-5 text-primary" />
      </div>
      <div className="space-y-3">
        {agenda.map((item) => (
          <div
            key={`${item.title}-${item.date.toISOString()}`}
            className="flex items-center justify-between rounded-xl border border-border/40 bg-background/40 px-3 py-2"
          >
            <div>
              <p className="text-sm font-medium">{item.title}</p>
              <p className="text-xs text-muted-foreground">{item.notebook}</p>
            </div>
            <div className="text-right text-xs text-muted-foreground flex flex-col items-end gap-1">
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {item.date.toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                })}
              </span>
              <span>{item.pageCount} linked pages</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
