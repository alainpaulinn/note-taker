import { NextResponse } from "next/server"
import { saveLocalFile } from "@/lib/storage/local-file-storage"

export async function POST(request: Request) {
  const formData = await request.formData()
  const file = formData.get("file")

  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: "File missing" }, { status: 400 })
  }

  try {
    const stored = await saveLocalFile(file)
    return NextResponse.json(stored)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Failed to save file" }, { status: 500 })
  }
}
