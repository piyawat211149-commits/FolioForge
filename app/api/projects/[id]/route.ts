import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/db"
import { stringifyTags } from "@/lib/utils"

async function getProject(id: string, userId: string) {
  return prisma.project.findFirst({ where: { id, userId }, include: { files: true } })
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { id } = await params
  const project = await getProject(id, session.user.id)
  if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json(project)
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { id } = await params
  if (!await getProject(id, session.user.id)) return NextResponse.json({ error: "Not found" }, { status: 404 })

  const { title, description, tags, externalUrl, isPublic, date, fileIds } = await req.json()

  // Link any newly-uploaded orphan files to this project
  if (fileIds?.length) {
    await prisma.projectFile.updateMany({
      where: { id: { in: fileIds }, projectId: null },
      data: { projectId: id },
    })
  }

  const updated = await prisma.project.update({
    where: { id },
    data: {
      ...(title !== undefined && { title }),
      ...(description !== undefined && { description }),
      ...(tags !== undefined && { tags: stringifyTags(tags) }),
      ...(externalUrl !== undefined && { externalUrl }),
      ...(isPublic !== undefined && { isPublic }),
      ...(date !== undefined && { date: date ? new Date(date) : null }),
    },
    include: { files: true },
  })
  return NextResponse.json(updated)
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { id } = await params
  if (!await getProject(id, session.user.id)) return NextResponse.json({ error: "Not found" }, { status: 404 })
  await prisma.project.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
