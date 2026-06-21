import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { parseTags } from "@/lib/utils"

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS })
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  const { username } = await params

  const user = await prisma.user.findUnique({
    where: { username },
    include: {
      projects: {
        where: { isPublic: true },
        include: { files: true },
        orderBy: { date: "desc" },
      },
    },
  })

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404, headers: CORS_HEADERS })
  }

  return NextResponse.json(
    {
      user: {
        name: user.name || user.username,
        username: user.username,
        bio: user.bio || "",
        avatarUrl: user.avatarUrl || "",
      },
      projects: user.projects.map((p) => ({
        id: p.id,
        title: p.title,
        description: p.description,
        tags: parseTags(p.tags),
        externalUrl: p.externalUrl || null,
        date: p.date?.toISOString() ?? null,
        files: p.files.map((f) => ({ url: f.url, type: f.type, filename: f.filename })),
      })),
    },
    { headers: CORS_HEADERS }
  )
}
