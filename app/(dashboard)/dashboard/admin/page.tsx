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
    { label: "ผู้ใช้ทั้งหมด", value: totalUsers, sub: "registered users", color: "text-indigo-600", bg: "bg-indigo-50 border-indigo-100" },
    { label: "โปรเจกต์ทั้งหมด", value: totalProjects, sub: `เฉลี่ย ${avgProjectsPerUser}/คน`, color: "text-blue-600", bg: "bg-blue-50 border-blue-100" },
    { label: "หน้า AI ทั้งหมด", value: totalPages, sub: `เฉลี่ย ${avgPagesPerUser}/คน`, color: "text-violet-600", bg: "bg-violet-50 border-violet-100" },
  ]

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-10">
        <div className="inline-flex items-center gap-2 bg-red-50 text-red-500 text-xs font-bold tracking-widest uppercase px-3 py-1.5 rounded-full border border-red-100 mb-3">
          🔐 Admin Only
        </div>
        <h1 className="text-2xl font-extrabold text-gray-900">Analytics Dashboard</h1>
        <p className="text-sm text-gray-400 mt-1">ภาพรวมการใช้งาน FolioForge ทั้งหมด</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        {stats.map((s) => (
          <div key={s.label} className={`rounded-2xl border p-6 ${s.bg}`}>
            <p className="text-xs text-gray-400 font-medium mb-2">{s.label}</p>
            <p className={`text-5xl font-extrabold mb-1 ${s.color}`}>{s.value.toLocaleString()}</p>
            <p className="text-xs text-gray-400">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Recent Users Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between">
          <h2 className="text-sm font-bold text-gray-900">ผู้ใช้ล่าสุด</h2>
          <span className="text-xs text-gray-400 bg-gray-50 px-2.5 py-1 rounded-full">{recentUsers.length} คนล่าสุด</span>
        </div>

        {/* Table header */}
        <div className="grid grid-cols-12 gap-4 px-6 py-2.5 bg-gray-50/70 border-b border-gray-100 text-xs font-semibold text-gray-400 uppercase tracking-wide">
          <div className="col-span-1">#</div>
          <div className="col-span-4">ผู้ใช้</div>
          <div className="col-span-3">Email</div>
          <div className="col-span-2 text-center">Projects</div>
          <div className="col-span-2 text-right">สมัครวันที่</div>
        </div>

        <div className="divide-y divide-gray-50">
          {recentUsers.map((user, idx) => (
            <div key={user.id} className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-gray-50/50 transition-colors">
              <div className="col-span-1 text-xs text-gray-300 font-mono">{idx + 1}</div>
              <div className="col-span-4">
                <p className="text-sm font-semibold text-gray-900 truncate">{user.name || user.username}</p>
                <p className="text-xs text-gray-400 font-mono">@{user.username}</p>
              </div>
              <div className="col-span-3">
                <p className="text-xs text-gray-500 truncate">{user.email}</p>
              </div>
              <div className="col-span-2 text-center">
                <div className="flex items-center justify-center gap-2">
                  <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-semibold">
                    {user._count.projects}P
                  </span>
                  <span className="text-xs bg-violet-50 text-violet-600 px-2 py-0.5 rounded-full font-semibold">
                    {user._count.portfolioPages}AI
                  </span>
                </div>
              </div>
              <div className="col-span-2 text-right">
                <p className="text-xs text-gray-400">
                  {new Date(user.createdAt).toLocaleDateString("th-TH", { year: "2-digit", month: "short", day: "numeric" })}
                </p>
              </div>
            </div>
          ))}
          {recentUsers.length === 0 && (
            <div className="px-6 py-12 text-center text-sm text-gray-400">
              ยังไม่มีผู้ใช้
            </div>
          )}
        </div>
      </div>

      {/* Footer note */}
      <p className="text-xs text-gray-300 text-center mt-6">
        ข้อมูล ณ วันที่ {new Date().toLocaleDateString("th-TH", { year: "numeric", month: "long", day: "numeric" })}
      </p>
    </div>
  )
}
