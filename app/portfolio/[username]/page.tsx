import { prisma } from "@/lib/db"
import { notFound, redirect } from "next/navigation"
import { parseTags } from "@/lib/utils"
import { PortfolioClient } from "./portfolio-client"

export async function generateMetadata({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params
  const user = await prisma.user.findUnique({ where: { username } })
  if (!user) return { title: "Portfolio not found" }
  return {
    title: `${user.name || user.username} — Portfolio`,
    description: user.bio || `Portfolio of ${user.name || user.username}`,
  }
}

export default async function PortfolioPage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params
  const user = await prisma.user.findUnique({
    where: { username },
    include: {
      projects: { where: { isPublic: true }, include: { files: true }, orderBy: { date: "desc" } },
      portfolioPages: { where: { isVisible: true }, orderBy: { pageOrder: "asc" } },
    },
  })
  if (!user) notFound()

  // Redirect to AI-generated portfolio if pages exist
  if (user.portfolioPages.length > 0) {
    redirect(`/portfolio/${username}/${user.portfolioPages[0].slug}`)
  }

  const contactLinks = (() => {
    try { return user.contactLinks ? JSON.parse(user.contactLinks) : {} }
    catch { return {} }
  })()

  const projects = user.projects.map((p) => ({
    ...p,
    tags: parseTags(p.tags),
    date: p.date?.toISOString() ?? null,
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
  }))

  return (
    <PortfolioClient
      user={{
        name: user.name || user.username,
        username: user.username,
        bio: user.bio || "",
        school: user.school || "",
        gpa: user.gpa || "",
        avatarUrl: user.avatarUrl || "",
        theme: user.theme,
        contactLinks,
      }}
      projects={projects}
    />
  )
}
