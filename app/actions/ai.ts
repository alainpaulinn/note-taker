"use server"

import { auth } from "@/auth"
import { prisma } from "@/prisma/prisma"

type SummaryResult = {
  summary: string
  suggestions: string[]
}

const DEFAULT_SUMMARY =
  "Add more context to unlock a full AI summary. Describe goals, questions, and decisions to generate targeted recaps."

export async function summarizePage(pageId: string): Promise<SummaryResult> {
  const session = await auth()
  if (!session?.user?.id) {
    throw new Error("Unauthorized")
  }

  const page = await prisma.page.findFirst({
    where: {
      id: pageId,
      userId: session.user.id,
    },
  })

  if (!page) {
    throw new Error("Page not found")
  }

  const content = page.content ?? ""

  if (!content.trim()) {
    return {
      summary: DEFAULT_SUMMARY,
      suggestions: [
        "Capture the core question you're answering.",
        "List the major decisions from this session.",
        "Highlight blockers that need help.",
      ],
    }
  }

  if (!process.env.OPENAI_API_KEY) {
    const condensed = content.replace(/<[^>]+>/g, "").slice(0, 360)
    return {
      summary: `${condensed}${content.length > 360 ? "…" : ""}`,
      suggestions: [
        "Add an action item list to turn this note into momentum.",
        "Tag teammates or courses so the note stays discoverable.",
        "Link this note to related notebooks for the graph view.",
      ],
    }
  }

  const prompt = `Summarize the following note. Provide a concise paragraph plus three actionable insights.

Note content:
${content}`

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      temperature: 0.4,
      messages: [
        { role: "system", content: "You condense notes for A-notes users." },
        { role: "user", content: prompt },
      ],
    }),
  })

  if (!response.ok) {
    console.error("AI summary failed", await response.text())
    return {
      summary: DEFAULT_SUMMARY,
      suggestions: [
        "Something went wrong with AI. Try again or check the logs.",
        "Ensure OPENAI_API_KEY is configured in the environment.",
        "Keep a manual TL;DR while AI is unavailable.",
      ],
    }
  }

  const data = await response.json()
  const summary = data?.choices?.[0]?.message?.content ?? DEFAULT_SUMMARY

  return {
    summary,
    suggestions: summary
      .split("\n")
      .filter((line: string) => line.trim().length > 0)
      .slice(1, 4),
  }
}
