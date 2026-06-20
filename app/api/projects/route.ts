import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/db"
import { stringifyTags } from "@/lib/utils"

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const projects = await prisma.project.findMany({
    where: { userId: session.user.id },
    include: { files: true },
    orderBy: { createdAt: "desc" },
  })
  return NextResponse.json(projects)
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { title, description, tags, externalUrl, isPublic, date, fileIds } = await req.json()
  if (!title || !description) return NextResponse.json({ error: "Title and description required" }, { status: 400 })

  const project = await prisma.project.create({
    data: {
      title, description,
      tags: stringifyTags(tags || []),
      externalUrl: externalUrl || null,
      isPublic: isPublic !== false,
      date: date ? new Date(date) : null,
      userId: session.user.id,
    },
    include: { files: true },
  })

  if (fileIds?.length) {
    await prisma.projectFile.updateMany({
      where: { id: { in: fileIds }, projectId: null },
      data: { projectId: project.id },
    })
  }

  return NextResponse.json(project, { status: 201 })
}
