import { auth } from "@/auth"
import { getTeamFiles, getFilePages } from "@/lib/figma"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const fileKey = req.nextUrl.searchParams.get("fileKey")

  if (fileKey) {
    const pages = await getFilePages(fileKey)
    return NextResponse.json({ pages })
  }

  const files = await getTeamFiles()
  return NextResponse.json({ files })
}
