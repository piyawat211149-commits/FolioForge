import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/db"

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { id } = await params
  const { title, content, isVisible, pageOrder } = await req.json()
  const page = await prisma.portfolioPage.findFirst({ where: { id, userId: session.user.id } })
  if (!page) return NextResponse.json({ error: "Not found" }, { status: 404 })
  const updated = await prisma.portfolioPage.update({
    where: { id },
    data: {
      ...(title !== undefined && { title }),
      ...(content !== undefined && { content: JSON.stringify(content) }),
      ...(isVisible !== undefined && { isVisible }),
      ...(pageOrder !== undefined && { pageOrder }),
    },
  })
  return NextResponse.json(updated)
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { id } = await params
  const page = await prisma.portfolioPage.findFirst({ where: { id, userId: session.user.id } })
  if (!page) return NextResponse.json({ error: "Not found" }, { status: 404 })
  await prisma.portfolioPage.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
