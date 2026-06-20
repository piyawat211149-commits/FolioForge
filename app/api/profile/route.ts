import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/db"

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id:true, username:true, email:true, name:true, bio:true, avatarUrl:true, school:true, gpa:true, contactLinks:true, theme:true },
  })
  return NextResponse.json(user)
}

export async function PATCH(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { name, bio, school, gpa, contactLinks, theme, avatarUrl } = await req.json()

  const user = await prisma.user.update({
    where: { id: session.user.id },
    data: {
      ...(name !== undefined && { name }),
      ...(bio !== undefined && { bio }),
      ...(school !== undefined && { school }),
      ...(gpa !== undefined && { gpa }),
      ...(contactLinks !== undefined && { contactLinks: JSON.stringify(contactLinks) }),
      ...(theme !== undefined && { theme }),
      ...(avatarUrl !== undefined && { avatarUrl }),
    },
    select: { id:true, username:true, email:true, name:true, bio:true, avatarUrl:true, school:true, gpa:true, contactLinks:true, theme:true },
  })
  return NextResponse.json(user)
}
