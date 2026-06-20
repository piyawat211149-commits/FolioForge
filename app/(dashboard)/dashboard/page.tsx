import { auth } from "@/auth"
import { prisma } from "@/lib/db"
import { parseTags } from "@/lib/utils"
import Link from "next/link"
import Image from "next/image"
import { DeleteProjectButton } from "./delete-project-button"
import { OnboardingTour } from "@/components/onboarding-tour"

export default async function DashboardPage() {
  const session = await auth()
  if (!session) return null

  const [projects, pageCount] = await Promise.all([
    prisma.project.findMany({
      where: { userId: session.user.id },
      include: { files: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.portfolioPage.count({ where: { userId: session.user.id } }),
  ])

  const firstName = session.user.name?.split(" ")[0] || session.user.name || "คุณ"

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <OnboardingTour />

      {/* Welcome header */}
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-gray-900">
          สวัสดี, {firstName} 👋
        </h1>
        <p className="text-sm text-gray-400 mt-1">จัดการพอร์ตโฟลิโอและโปรเจกต์ของคุณที่นี่</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <p className="text-xs text-gray-400 font-medium mb-1">โปรเจกต์ทั้งหมด</p>
          <p className="text-2xl font-extrabold text-gray-900">{projects.length}</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <p className="text-xs text-gray-400 font-medium mb-1">หน้าพอร์ต (AI)</p>
          <p className="text-2xl font-extrabold text-gray-900">{pageCount}</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <p className="text-xs text-gray-400 font-medium mb-1">เผยแพร่แล้ว</p>
          <p className="text-2xl font-extrabold text-gray-900">{projects.filter(p => p.isPublic).length}</p>
        </div>
      </div>

      {/* AI Builder CTA */}
      {pageCount === 0 && (
        <Link
          href="/dashboard/ai-builder"
          data-tour="nav-ai"
          className="flex items-center gap-5 mb-8 p-5 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 transition-all group shadow-lg shadow-indigo-500/20"
        >
          <div className="w-12 h-12 rounded-xl bg-white/15 flex items-center justify-center text-2xl flex-shrink-0">✦</div>
          <div className="flex-1">
            <p className="text-sm font-bold text-white">ลอง AI สร้างพอร์ตโฟลิโอ</p>
            <p className="text-xs text-indigo-200 mt-0.5">บอกข้อมูลตัวเอง AI จะสร้างพอร์ตโฟลิโอแบบ multi-page ให้ทันที</p>
          </div>
          <span className="text-white/60 group-hover:text-white group-hover:translate-x-1 transition-all text-lg">→</span>
        </Link>
      )}

      {/* Section header */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-base font-bold text-gray-900">โปรเจกต์ของฉัน</h2>
        <Link
          href="/dashboard/projects/new"
          className="bg-gray-900 text-white px-4 py-2 text-xs font-bold hover:bg-black transition-colors rounded-lg"
        >
          + เพิ่มโปรเจกต์
        </Link>
      </div>

      {/* Projects grid */}
      {projects.length === 0 ? (
        <div className="rounded-3xl border-2 border-dashed border-gray-100 bg-gray-50/50 py-20 px-8 text-center">
          <div className="w-16 h-16 rounded-2xl bg-white border border-gray-100 shadow-sm flex items-center justify-center text-3xl mx-auto mb-5">
            📁
          </div>
          <h3 className="text-base font-bold text-gray-800 mb-2">ยังไม่มีโปรเจกต์</h3>
          <p className="text-sm text-gray-400 mb-6 max-w-xs mx-auto leading-relaxed">
            เพิ่มโปรเจกต์แรกของคุณ หรือให้ AI สร้างพอร์ตโฟลิโอให้ทั้งหมดเลย
          </p>
          <div className="flex items-center justify-center gap-3">
            <Link
              href="/dashboard/projects/new"
              className="bg-gray-900 text-white px-5 py-2.5 text-sm font-bold hover:bg-black transition-colors rounded-xl"
            >
              + เพิ่มโปรเจกต์
            </Link>
            <Link
              href="/dashboard/ai-builder"
              className="border border-indigo-200 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-5 py-2.5 text-sm font-bold transition-colors rounded-xl"
            >
              ✦ สร้างด้วย AI
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => {
            const cover = project.files.find((f) => f.type === "image")
            const tags = parseTags(project.tags)
            return (
              <div key={project.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group">
                {cover ? (
                  <div className="aspect-video relative overflow-hidden bg-gray-50">
                    <Image src={cover.url} alt={project.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                ) : (
                  <div className="aspect-video bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                    <span className="text-gray-200 text-4xl">◈</span>
                  </div>
                )}
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <h3 className="font-bold text-sm text-gray-900 leading-tight">{project.title}</h3>
                    <span className={`shrink-0 text-xs px-2 py-0.5 rounded-full font-semibold ${
                      project.isPublic ? "bg-green-50 text-green-600" : "bg-gray-100 text-gray-400"
                    }`}>
                      {project.isPublic ? "สาธารณะ" : "ส่วนตัว"}
                    </span>
                  </div>
                  <p className="text-gray-400 text-xs leading-relaxed line-clamp-2 mb-3">
                    {project.description || "ไม่มีคำอธิบาย"}
                  </p>
                  {tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="text-xs px-2 py-0.5 bg-gray-50 text-gray-500 rounded-md border border-gray-100">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="flex items-center gap-3 pt-3 border-t border-gray-50">
                    <Link href={`/dashboard/projects/${project.id}/edit`} className="text-xs text-gray-400 hover:text-gray-900 font-semibold transition-colors">
                      แก้ไข
                    </Link>
                    <DeleteProjectButton projectId={project.id} />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
