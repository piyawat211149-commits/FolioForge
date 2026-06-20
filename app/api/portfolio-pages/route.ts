import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/db"

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const pages = await prisma.portfolioPage.findMany({
    where: { userId: session.user.id },
    orderBy: { pageOrder: "asc" },
  })
  return NextResponse.json(pages)
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { title, slug, content, pageOrder } = await req.json()
  if (!title || !slug) return NextResponse.json({ error: "title and slug required" }, { status: 400 })

  // Upsert — replace if slug already exists for this user
  const page = await prisma.portfolioPage.upsert({
    where: { userId_slug: { userId: session.user.id, slug } },
    update: { title, content: JSON.stringify(content ?? {}), pageOrder: pageOrder ?? 0 },
    create: { title, slug, content: JSON.stringify(content ?? {}), pageOrder: pageOrder ?? 0, userId: session.user.id },
  })
  return NextResponse.json(page, { status: 201 })
}

export async function DELETE() {
  // Delete all pages for this user (used before AI regeneration)
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  await prisma.portfolioPage.deleteMany({ where: { userId: session.user.id } })
  return NextResponse.json({ success: true })
}
