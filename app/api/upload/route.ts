import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/db"
import { put, del } from "@vercel/blob"
import { randomBytes } from "crypto"
import { getFileType } from "@/lib/utils"

const MAX_FILE_SIZE = 10 * 1024 * 1024
const ALLOWED_TYPES = ["image/jpeg","image/png","image/gif","image/webp","application/pdf"]

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const formData = await req.formData()
  const files = formData.getAll("files") as File[]
  if (!files.length) return NextResponse.json({ error: "No files" }, { status: 400 })

  const uploaded = []
  for (const file of files) {
    if (file.size > MAX_FILE_SIZE) return NextResponse.json({ error: `${file.name} exceeds 10MB` }, { status: 400 })
    if (!ALLOWED_TYPES.includes(file.type)) return NextResponse.json({ error: `${file.type} not allowed` }, { status: 400 })

    const ext = file.name.split(".").pop() || "bin"
    const uniqueName = `uploads/${session.user.id}/${randomBytes(8).toString("hex")}.${ext}`

    const blob = await put(uniqueName, file, { access: "public" })

    const record = await prisma.projectFile.create({
      data: { filename: file.name, url: blob.url, type: getFileType(file.type), projectId: null }
    })
    uploaded.push({ id: record.id, url: blob.url, filename: file.name, type: record.type })
  }

  return NextResponse.json({ files: uploaded }, { status: 201 })
}

export async function PATCH(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { fileId, projectId } = await req.json()
  const project = await prisma.project.findFirst({ where: { id: projectId, userId: session.user.id } })
  if (!project) return NextResponse.json({ error: "Project not found" }, { status: 404 })

  await prisma.projectFile.update({ where: { id: fileId }, data: { projectId } })
  return NextResponse.json({ success: true })
}

export async function DELETE(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { fileId } = await req.json()
  const file = await prisma.projectFile.findUnique({
    where: { id: fileId },
    include: { project: { select: { userId: true } } }
  })
  if (!file) return NextResponse.json({ error: "Not found" }, { status: 404 })
  if (file.project?.userId && file.project.userId !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  // Delete from Vercel Blob
  try {
    await del(file.url)
  } catch {
    // Ignore if already deleted
  }

  await prisma.projectFile.delete({ where: { id: fileId } })
  return NextResponse.json({ success: true })
}
