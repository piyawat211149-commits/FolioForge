import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/db"
import { del } from "@vercel/blob"

export async function DELETE(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { pageSlug, imageUrl } = await req.json()
  if (!pageSlug || !imageUrl) return NextResponse.json({ error: "Missing data" }, { status: 400 })

  const page = await prisma.portfolioPage.findFirst({
    where: { userId: session.user.id, slug: pageSlug },
  })
  if (!page) return NextResponse.json({ error: "Page not found" }, { status: 404 })

  const content = JSON.parse(page.content || "{}")
  content.images = (content.images || []).filter((img: { url: string }) => img.url !== imageUrl)

  await prisma.portfolioPage.update({
    where: { id: page.id },
    data: { content: JSON.stringify(content) },
  })

  try { await del(imageUrl) } catch {}

  return NextResponse.json({ success: true })
}
