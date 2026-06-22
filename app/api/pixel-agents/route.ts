import { NextResponse } from "next/server"
import { readdir, readFile, stat } from "fs/promises"
import { join } from "path"
import { exec } from "child_process"
import { promisify } from "util"

const execAsync = promisify(exec)
const ROOT = process.cwd()

if (process.env.NODE_ENV === "production") {
  // no-op in production
}

async function countFilesRecursive(dir: string, match: (f: string) => boolean): Promise<string[]> {
  const results: string[] = []
  try {
    const entries = await readdir(join(ROOT, dir), { withFileTypes: true })
    for (const e of entries) {
      const full = join(dir, e.name)
      if (e.isDirectory() && !e.name.startsWith(".") && e.name !== "node_modules") {
        results.push(...(await countFilesRecursive(full, match)))
      } else if (e.isFile() && match(e.name)) {
        results.push(full)
      }
    }
  } catch {}
  return results
}

async function checkFrontend() {
  const components = await countFilesRecursive("components", f => f.endsWith(".tsx"))
  const pages = await countFilesRecursive("app", f => f === "page.tsx")
  const clientFiles = await countFilesRecursive("app", f => f.endsWith(".tsx"))
  let useClientCount = 0
  for (const f of clientFiles) {
    try {
      const content = await readFile(join(ROOT, f), "utf-8")
      if (content.includes('"use client"')) useClientCount++
    } catch {}
  }
  const globalCss = await readFile(join(ROOT, "app/globals.css"), "utf-8").catch(() => "")
  const cssLines = globalCss.split("\n").length

  return {
    findings: [
      `พบ ${components.length} components`,
      `${pages.length} หน้า (pages)`,
      `${useClientCount} ไฟล์ใช้ "use client"`,
      `CSS ${cssLines} บรรทัด`,
    ],
    score: Math.min(100, components.length * 5 + pages.length * 3),
    mood: components.length > 5 ? "happy" : "thinking",
  }
}

async function checkBackend() {
  const apiRoutes = await countFilesRecursive("app/api", f => f === "route.ts")
  let hasAuth = false
  try {
    await stat(join(ROOT, "auth.ts"))
    hasAuth = true
  } catch {}
  let hasProxy = false
  try {
    await stat(join(ROOT, "proxy.ts"))
    hasProxy = true
  } catch {}
  let hasOldMiddleware = false
  try {
    await stat(join(ROOT, "middleware.ts"))
    hasOldMiddleware = true
  } catch {}

  const findings = [
    `${apiRoutes.length} API routes`,
    hasAuth ? "Auth config ✓" : "⚠ ไม่มี auth config",
    hasOldMiddleware ? "⚠ ยังใช้ middleware.ts (deprecated)" : hasProxy ? "Proxy ✓ (Next 16)" : "ไม่มี proxy/middleware",
  ]

  return {
    findings,
    score: apiRoutes.length * 7 + (hasAuth ? 20 : 0) + (hasProxy ? 10 : 0),
    mood: hasOldMiddleware ? "worried" : "happy",
  }
}

async function checkDatabase() {
  try {
    const schema = await readFile(join(ROOT, "prisma/schema.prisma"), "utf-8")
    const models = schema.match(/^model\s+\w+/gm) || []
    const relations = schema.match(/@relation/g) || []
    const hasIndex = schema.includes("@@index") || schema.includes("@@unique")
    return {
      findings: [
        `${models.length} models: ${models.map(m => m.replace("model ", "")).join(", ")}`,
        `${relations.length} relations`,
        hasIndex ? "มี index/unique ✓" : "⚠ ไม่มี index เพิ่มเติม",
      ],
      score: models.length * 15 + relations.length * 5,
      mood: models.length >= 4 ? "happy" : "thinking",
    }
  } catch {
    return { findings: ["⚠ ไม่พบ prisma schema"], score: 0, mood: "worried" as const }
  }
}

async function checkAI() {
  const hasGeminiKey = !!process.env.GEMINI_API_KEY
  const aiRoutes = await countFilesRecursive("app/api/ai-generate", f => f === "route.ts")
  const aiBuilder = await countFilesRecursive("app", f => f.includes("ai-builder"))

  return {
    findings: [
      hasGeminiKey ? "Gemini API Key ✓" : "⚠ ไม่พบ GEMINI_API_KEY",
      `${aiRoutes.length} AI endpoint`,
      `AI Builder: ${aiBuilder.length > 0 ? "มี ✓" : "⚠ ไม่พบ"}`,
    ],
    score: (hasGeminiKey ? 40 : 0) + aiRoutes.length * 20,
    mood: hasGeminiKey ? "happy" : "worried",
  }
}

async function checkQA() {
  let tscResult = { ok: true, errors: 0, details: "" }
  try {
    await execAsync("npx tsc --noEmit --pretty false 2>&1", { cwd: ROOT, timeout: 30000 })
    tscResult.ok = true
  } catch (e: unknown) {
    const err = e as { stdout?: string }
    const output = err.stdout || ""
    const errorLines = output.split("\n").filter((l: string) => l.includes("error TS"))
    tscResult = { ok: false, errors: errorLines.length, details: errorLines.slice(0, 3).join("; ") }
  }

  let gitStatus = { uncommitted: 0, untracked: 0 }
  try {
    const { stdout } = await execAsync("git status --porcelain", { cwd: ROOT })
    const lines = stdout.trim().split("\n").filter(Boolean)
    gitStatus.uncommitted = lines.filter(l => l.startsWith(" M") || l.startsWith("M ")).length
    gitStatus.untracked = lines.filter(l => l.startsWith("??")).length
  } catch {}

  const findings = [
    tscResult.ok ? "TypeScript ✓ ไม่มี error" : `⚠ TypeScript ${tscResult.errors} errors`,
    `${gitStatus.uncommitted} ไฟล์ยังไม่ commit`,
    `${gitStatus.untracked} ไฟล์ untracked`,
  ]
  if (tscResult.details) findings.push(tscResult.details)

  return {
    findings,
    score: (tscResult.ok ? 50 : 20) + Math.max(0, 30 - gitStatus.uncommitted * 3),
    mood: tscResult.ok && gitStatus.uncommitted < 5 ? "happy" : "worried",
  }
}

async function checkDevOps() {
  const envVars = ["DATABASE_URL", "AUTH_SECRET", "GEMINI_API_KEY", "SMTP_HOST"]
  const missing = envVars.filter(v => !process.env[v])

  let buildable = true
  try {
    const pkg = JSON.parse(await readFile(join(ROOT, "package.json"), "utf-8"))
    buildable = !!pkg.scripts?.build
  } catch {}

  let hasVercel = false
  try {
    await stat(join(ROOT, ".vercel"))
    hasVercel = true
  } catch {}

  return {
    findings: [
      missing.length === 0 ? "ENV vars ครบ ✓" : `⚠ ขาด: ${missing.join(", ")}`,
      buildable ? "Build script ✓" : "⚠ ไม่มี build script",
      hasVercel ? "Vercel linked ✓" : "ยังไม่ได้ link Vercel",
    ],
    score: (4 - missing.length) * 15 + (buildable ? 20 : 0) + (hasVercel ? 20 : 0),
    mood: missing.length === 0 ? "happy" : "worried",
  }
}

export async function GET() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "dev only" }, { status: 403 })
  }

  const [frontend, backend, database, ai, qa, devops] = await Promise.all([
    checkFrontend(),
    checkBackend(),
    checkDatabase(),
    checkAI(),
    checkQA(),
    checkDevOps(),
  ])

  return NextResponse.json({
    timestamp: new Date().toISOString(),
    agents: [
      { id: 0, name: "น้องมิ้นท์", role: "Frontend / UI", ...frontend },
      { id: 1, name: "น้องเบส", role: "Backend / API", ...backend },
      { id: 2, name: "น้องแบงค์", role: "Database", ...database },
      { id: 3, name: "น้องฟ้า", role: "AI Generation", ...ai },
      { id: 4, name: "น้องเพลง", role: "QA / Review", ...qa },
      { id: 5, name: "น้องบอส", role: "DevOps / Deploy", ...devops },
    ],
  })
}
