import { mkdir, writeFile } from "fs/promises"
import path from "path"
import crypto from "crypto"

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads")

async function ensureDir() {
  await mkdir(UPLOAD_DIR, { recursive: true })
}

export async function saveLocalFile(file: File) {
  await ensureDir()
  const arrayBuffer = await file.arrayBuffer()
  const buffer = Buffer.from(arrayBuffer)
  const extension = path.extname(file.name) || ""
  const hashedName = `${Date.now()}-${crypto.randomBytes(6).toString("hex")}${extension}`
  const filePath = path.join(UPLOAD_DIR, hashedName)
  await writeFile(filePath, buffer)

  return {
    url: `/uploads/${hashedName}`,
    size: file.size,
    mimeType: file.type,
    originalName: file.name,
  }
}
