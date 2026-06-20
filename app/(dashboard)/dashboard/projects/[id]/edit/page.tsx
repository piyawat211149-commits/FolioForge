import { prisma } from "@/lib/db"
import { auth } from "@/auth"
import { notFound } from "next/navigation"
import { parseTags } from "@/lib/utils"
import { ProjectForm } from "@/app/(dashboard)/project-form"
import Link from "next/link"

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await auth()
  if (!session) return null

  const project = await prisma.project.findFirst({
    where: { id, userId: session.user.id },
    include: { files: true },
  })

  if (!project) notFound()

  const initialData = {
    id: project.id,
    title: project.title,
    description: project.description,
    tags: parseTags(project.tags),
    externalUrl: project.externalUrl || "",
    isPublic: project.isPublic,
    date: project.date ? project.date.toISOString().split("T")[0] : "",
    files: project.files,
  }

  return (
    <div className="p-6 lg:p-8 max-w-2xl">
      <div className="mb-8">
        <Link href="/dashboard" className="text-xs text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors font-medium mb-4 inline-flex items-center gap-1">
          ← กลับ
        </Link>
        <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-1">แก้ไขโปรเจกต์</h1>
        <p className="text-sm text-gray-400 dark:text-gray-500">อัปเดตรายละเอียดโปรเจกต์ของคุณ</p>
      </div>
      <div className="bg-white dark:bg-white/[0.03] rounded-2xl border border-gray-100 dark:border-white/5 p-6 transition-colors duration-300">
        <ProjectForm initialData={initialData} />
      </div>
    </div>
  )
}
