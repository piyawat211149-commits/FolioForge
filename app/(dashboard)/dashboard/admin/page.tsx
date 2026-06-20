import { auth } from "@/auth"
import { prisma } from "@/lib/db"
import { redirect } from "next/navigation"

const ADMIN_EMAIL = "piyawat211149@gmail.com"

export default async function AdminPage() {
  const session = await auth()
  if (!session?.user?.email || session.user.email !== ADMIN_EMAIL) {
    redirect("/dashboard")
  }

  const [totalUsers, totalProjects, totalPages, recentUsers] = await Promise.all([
    prisma.user.count(),
    prisma.project.count(),
    prisma.portfolioPage.count(),
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      take: 20,
      select: {
        id: true,
        name: true,
        email: true,
        username: true,
        createdAt: true,
        _count: { select: { projects: true, portfolioPages: true } },
      },
    }),
  ])

  const avgProjectsPerUser = totalUsers > 0 ? (totalProjects / totalUsers).toFixed(1) : "0"
  const avgPagesPerUser = totalUsers > 0 ? (totalPages / totalUsers).toFixed(1) : "0"

  const stats = [
    { label: "ผู้ใช้ทั้งหมด", value: totalUsers, sub: "registered users", gradient: "from-indigo-500 to-blue-500" },
    { label: "โปรเจกต์ทั้งหมด", value: totalProjects, sub: `เฉลี่ย ${avgProjectsPerUser}/คน`, gradient: "from-violet-500 to-purple-500" },
    { label: "หน้า AI ทั้งหมด", value: totalPages, sub: `เฉลี่ย ${avgPagesPerUser}/คน`, gradient: "from-emerald-500 to-teal-500" },
  ]

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-10">
        <div className="inline-flex items-center gap-2 bg-red-50 dark:bg-red-500/10 text-red-500 dark:text-red-400 text-xs font-bold tracking-widest uppercase px-3 py-1.5 rounded-full border border-red-100 dark:border-red-500/20 mb-3">
          🔐 Admin Only
        </div>
        <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">Analytics Dashboard</h1>
        <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">ภาพรวมการใช้งาน FolioForge ทั้งหมด</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        {stats.map((s) => (
          <div key={s.label} className="relative overflow-hidden rounded-2xl border border-gray-100 dark:border-white/5 bg-white dark:bg-white/[0.03] p-6 transition-colors duration-300">
            <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${s.gradient} opacity-[0.07] rounded-full -translate-y-1/2 translate-x-1/2`} />
            <p className="text-xs text-gray-400 dark:text-gray-500 font-medium mb-2">{s.label}</p>
            <p className={`text-5xl font-extrabold mb-1 bg-gradient-to-r ${s.gradient} bg-clip-text text-transparent`}>{s.value.toLocaleString()}</p>
            <p className="text-xs text-gray-400 dark:text-gray-500">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Recent Users Table */}
      <div className="bg-white dark:bg-white/[0.03] rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm overflow-hidden transition-colors duration-300">
        <div className="px-6 py-4 border-b border-gray-50 dark:border-white/5 flex items-center justify-between">
          <h2 className="text-sm font-bold text-gray-900 dark:text-white">ผู้ใช้ล่าสุด</h2>
          <span className="text-xs text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-white/5 px-2.5 py-1 rounded-full">{recentUsers.length} คนล่าสุด</span>
        </div>

        {/* Table header */}
        <div className="grid grid-cols-12 gap-4 px-6 py-2.5 bg-gray-50/70 dark:bg-white/[0.02] border-b border-gray-100 dark:border-white/5 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide">
          <div className="col-span-1">#</div>
          <div className="col-span-4">ผู้ใช้</div>
          <div className="col-span-3">Email</div>
          <div className="col-span-2 text-center">Projects</div>
          <div className="col-span-2 text-right">สมัครวันที่</div>
        </div>

        <div className="divide-y divide-gray-50 dark:divide-white/5">
          {recentUsers.map((user, idx) => (
            <div key={user.id} className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-gray-50/50 dark:hover:bg-white/[0.02] transition-colors">
              <div className="col-span-1 text-xs text-gray-300 dark:text-gray-600 font-mono">{idx + 1}</div>
              <div className="col-span-4">
                <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{user.name || user.username}</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 font-mono">@{user.username}</p>
              </div>
              <div className="col-span-3">
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
              </div>
              <div className="col-span-2 text-center">
                <div className="flex items-center justify-center gap-2">
                  <span className="text-xs bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-full font-semibold">
                    {user._count.projects}P
                  </span>
                  <span className="text-xs bg-violet-50 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400 px-2 py-0.5 rounded-full font-semibold">
                    {user._count.portfolioPages}AI
                  </span>
                </div>
              </div>
              <div className="col-span-2 text-right">
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  {new Date(user.createdAt).toLocaleDateString("th-TH", { year: "2-digit", month: "short", day: "numeric" })}
                </p>
              </div>
            </div>
          ))}
          {recentUsers.length === 0 && (
            <div className="px-6 py-12 text-center text-sm text-gray-400 dark:text-gray-500">
              ยังไม่มีผู้ใช้
            </div>
          )}
        </div>
      </div>

      {/* Footer note */}
      <p className="text-xs text-gray-300 dark:text-gray-600 text-center mt-6">
        ข้อมูล ณ วันที่ {new Date().toLocaleDateString("th-TH", { year: "numeric", month: "long", day: "numeric" })}
      </p>
    </div>
  )
}
