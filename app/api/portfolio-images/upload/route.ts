import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/db"
import { put } from "@vercel/blob"
import { randomBytes } from "crypto"

const MAX_FILE_SIZE = 10 * 1024 * 1024
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"]

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const formData = await req.formData()
  const file = formData.get("file") as File
  const pageSlug = formData.get("pageSlug") as string

  if (!file) return NextResponse.json({ error: "No file" }, { status: 400 })
  if (!pageSlug) return NextResponse.json({ error: "No pageSlug" }, { status: 400 })
  if (file.size > MAX_FILE_SIZE) return NextResponse.json({ error: "File exceeds 10MB" }, { status: 400 })
  if (!ALLOWED_TYPES.includes(file.type)) return NextResponse.json({ error: "Only images allowed" }, { status: 400 })

  const page = await prisma.portfolioPage.findFirst({
    where: { userId: session.user.id, slug: pageSlug },
  })
  if (!page) return NextResponse.json({ error: "Page not found" }, { status: 404 })

  const ext = file.name.split(".").pop() || "jpg"
  const uniqueName = `portfolio/${session.user.id}/${pageSlug}/${randomBytes(8).toString("hex")}.${ext}`
  const blob = await put(uniqueName, file, { access: "public" })

  const content = JSON.parse(page.content || "{}")
  if (!content.images) content.images = []
  content.images.push({ url: blob.url, filename: file.name })

  await prisma.portfolioPage.update({
    where: { id: page.id },
    data: { content: JSON.stringify(content) },
  })

  return NextResponse.json({ url: blob.url, filename: file.name }, { status: 201 })
}
