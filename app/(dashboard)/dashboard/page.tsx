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
    <div className="p-6 lg:p-8 max-w-5xl mx-auto">
      <OnboardingTour />

      {/* Welcome header */}
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">
          สวัสดี, {firstName} 👋
        </h1>
        <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">จัดการพอร์ตโฟลิโอและโปรเจกต์ของคุณที่นี่</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-8">
        {[
          { label: "โปรเจกต์ทั้งหมด", value: projects.length, gradient: "from-indigo-500 to-blue-500" },
          { label: "หน้าพอร์ต (AI)", value: pageCount, gradient: "from-violet-500 to-purple-500" },
          { label: "เผยแพร่แล้ว", value: projects.filter(p => p.isPublic).length, gradient: "from-emerald-500 to-teal-500" },
        ].map((stat) => (
          <div key={stat.label} className="relative overflow-hidden bg-white dark:bg-white/[0.04] rounded-2xl border border-gray-100 dark:border-white/5 p-5 group hover:shadow-lg hover:shadow-indigo-500/5 transition-all duration-300">
            <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${stat.gradient} opacity-[0.07] rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500`} />
            <p className="text-xs text-gray-400 dark:text-gray-500 font-medium mb-1">{stat.label}</p>
            <p className={`text-2xl font-extrabold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* AI Builder CTA */}
      {pageCount === 0 && (
        <Link
          href="/dashboard/ai-builder"
          data-tour="nav-ai"
          className="flex items-center gap-5 mb-8 p-5 rounded-2xl bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 hover:from-indigo-500 hover:via-violet-500 hover:to-purple-500 transition-all group shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30 hover:-translate-y-0.5 duration-300"
        >
          <div className="w-12 h-12 rounded-xl bg-white/15 flex items-center justify-center text-2xl flex-shrink-0 backdrop-blur-sm">✦</div>
          <div className="flex-1">
            <p className="text-sm font-bold text-white">ลอง AI สร้างพอร์ตโฟลิโอ</p>
            <p className="text-xs text-indigo-200 mt-0.5">บอกข้อมูลตัวเอง AI จะสร้างพอร์ตโฟลิโอแบบ multi-page ให้ทันที</p>
          </div>
          <span className="text-white/60 group-hover:text-white group-hover:translate-x-1 transition-all text-lg">→</span>
        </Link>
      )}

      {/* Section header */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-base font-bold text-gray-900 dark:text-white">โปรเจกต์ของฉัน</h2>
        <Link
          href="/dashboard/projects/new"
          className="bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 text-white px-4 py-2 text-xs font-bold transition-all rounded-xl shadow-md shadow-indigo-500/20 hover:shadow-lg hover:shadow-indigo-500/30 hover:-translate-y-0.5 duration-300"
        >
          + เพิ่มโปรเจกต์
        </Link>
      </div>

      {/* Projects grid */}
      {projects.length === 0 ? (
        <div className="rounded-3xl border-2 border-dashed border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-white/[0.02] py-20 px-8 text-center">
          <div className="w-16 h-16 rounded-2xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 shadow-sm flex items-center justify-center text-3xl mx-auto mb-5">
            📁
          </div>
          <h3 className="text-base font-bold text-gray-800 dark:text-gray-200 mb-2">ยังไม่มีโปรเจกต์</h3>
          <p className="text-sm text-gray-400 dark:text-gray-500 mb-6 max-w-xs mx-auto leading-relaxed">
            เพิ่มโปรเจกต์แรกของคุณ หรือให้ AI สร้างพอร์ตโฟลิโอให้ทั้งหมดเลย
          </p>
          <div className="flex items-center justify-center gap-3">
            <Link
              href="/dashboard/projects/new"
              className="bg-gray-900 dark:bg-white dark:text-gray-900 text-white px-5 py-2.5 text-sm font-bold hover:bg-black dark:hover:bg-gray-100 transition-colors rounded-xl"
            >
              + เพิ่มโปรเจกต์
            </Link>
            <Link
              href="/dashboard/ai-builder"
              className="border border-indigo-200 dark:border-indigo-500/30 text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 px-5 py-2.5 text-sm font-bold transition-colors rounded-xl"
            >
              ✦ สร้างด้วย AI
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project, i) => {
            const cover = project.files.find((f) => f.type === "image")
            const tags = parseTags(project.tags)
            return (
              <div
                key={project.id}
                className="bg-white dark:bg-white/[0.04] rounded-2xl border border-gray-100 dark:border-white/5 overflow-hidden hover:shadow-xl hover:shadow-indigo-500/5 dark:hover:shadow-indigo-500/10 transition-all duration-300 group hover:-translate-y-1"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                {cover ? (
                  <div className="aspect-video relative overflow-hidden bg-gray-50 dark:bg-white/5">
                    <Image src={cover.url} alt={project.title} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                ) : (
                  <div className="aspect-video bg-gradient-to-br from-indigo-50 to-violet-50 dark:from-indigo-500/10 dark:to-violet-500/10 flex items-center justify-center">
                    <span className="text-indigo-200 dark:text-indigo-500/30 text-4xl group-hover:scale-110 transition-transform duration-300">◈</span>
                  </div>
                )}
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <h3 className="font-bold text-sm text-gray-900 dark:text-white leading-tight">{project.title}</h3>
                    <span className={`shrink-0 text-xs px-2 py-0.5 rounded-full font-semibold ${
                      project.isPublic
                        ? "bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400"
                        : "bg-gray-100 dark:bg-white/5 text-gray-400 dark:text-gray-500"
                    }`}>
                      {project.isPublic ? "สาธารณะ" : "ส่วนตัว"}
                    </span>
                  </div>
                  <p className="text-gray-400 dark:text-gray-500 text-xs leading-relaxed line-clamp-2 mb-3">
                    {project.description || "ไม่มีคำอธิบาย"}
                  </p>
                  {tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="text-xs px-2 py-0.5 bg-gray-50 dark:bg-white/5 text-gray-500 dark:text-gray-400 rounded-md border border-gray-100 dark:border-white/5">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="flex items-center gap-3 pt-3 border-t border-gray-50 dark:border-white/5">
                    <Link href={`/dashboard/projects/${project.id}/edit`} className="text-xs text-indigo-500 hover:text-indigo-700 dark:hover:text-indigo-300 font-semibold transition-colors">
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
