import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import bcrypt from "bcryptjs"
import { randomBytes } from "crypto"
import { sendVerificationEmail } from "@/lib/email"

export async function POST(req: NextRequest) {
  try {
    const { email, password, username, name } = await req.json()

    if (!email || !password || !username) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }
    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 })
    }
    const usernameRegex = /^[a-z0-9_-]{3,30}$/
    if (!usernameRegex.test(username)) {
      return NextResponse.json(
        { error: "Username must be 3-30 chars, lowercase letters, numbers, - or _ only" },
        { status: 400 }
      )
    }

    const existing = await prisma.user.findFirst({ where: { OR: [{ email }, { username }] } })
    if (existing?.email === email) return NextResponse.json({ error: "Email already registered" }, { status: 400 })
    if (existing?.username === username) return NextResponse.json({ error: "Username already taken" }, { status: 400 })

    const passwordHash = await bcrypt.hash(password, 12)
    const user = await prisma.user.create({
      data: { email, username, name: name || username, passwordHash },
    })

    const token = randomBytes(32).toString("hex")
    await prisma.verificationToken.create({
      data: { token, userId: user.id, expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) },
    })

    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000"
    await sendVerificationEmail(email, token, baseUrl)

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("Register error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
