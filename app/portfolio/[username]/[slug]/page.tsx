import { prisma } from "@/lib/db"
import { notFound } from "next/navigation"
import { MultiPagePortfolioClient } from "./multi-page-client"

export async function generateMetadata({ params }: { params: Promise<{ username: string; slug: string }> }) {
  const { username, slug } = await params
  const user = await prisma.user.findUnique({ where: { username } })
  if (!user) return { title: "Not found" }
  const page = await prisma.portfolioPage.findFirst({ where: { userId: user.id, slug } })
  return {
    title: `${page?.title ?? slug} — ${user.name || username}`,
    description: user.bio || `Portfolio of ${user.name || username}`,
  }
}

export default async function MultiPortfolioPage({ params }: { params: Promise<{ username: string; slug: string }> }) {
  const { username, slug } = await params

  const user = await prisma.user.findUnique({
    where: { username },
    select: { id: true, name: true, username: true, avatarUrl: true, bio: true, school: true, theme: true },
  })
  if (!user) notFound()

  const allPages = await prisma.portfolioPage.findMany({
    where: { userId: user.id, isVisible: true },
    orderBy: { pageOrder: "asc" },
  })
  if (!allPages.length) notFound()

  const currentPage = allPages.find(p => p.slug === slug)
  if (!currentPage) notFound()

  const parsedPages = allPages.map(p => ({
    id: p.id,
    title: p.title,
    slug: p.slug,
    content: (() => { try { return JSON.parse(p.content) } catch { return {} } })(),
  }))

  const currentContent = (() => { try { return JSON.parse(currentPage.content) } catch { return {} } })()

  return (
    <MultiPagePortfolioClient
      user={{ name: user.name || user.username, username: user.username, avatarUrl: user.avatarUrl || "", bio: user.bio || "", school: user.school || "", theme: user.theme }}
      pages={parsedPages}
      currentSlug={slug}
      currentContent={currentContent}
    />
  )
}
