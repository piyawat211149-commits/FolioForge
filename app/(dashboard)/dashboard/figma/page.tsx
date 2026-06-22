import { auth } from "@/auth"
import { getTeamFiles } from "@/lib/figma"
import { FigmaGallery } from "./figma-gallery"
import Link from "next/link"

export default async function FigmaPage() {
  const session = await auth()
  if (!session) return null

  let files: Awaited<ReturnType<typeof getTeamFiles>> = []
  let error = ""

  try {
    files = await getTeamFiles()
  } catch (e) {
    error = e instanceof Error ? e.message : "ไม่สามารถเชื่อมต่อ Figma ได้"
  }

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center shadow-md shadow-pink-500/20">
              <svg width="20" height="20" viewBox="0 0 38 57" fill="white">
                <path d="M19 28.5a9.5 9.5 0 1 1 19 0 9.5 9.5 0 0 1-19 0z" />
                <path d="M0 47.5A9.5 9.5 0 0 1 9.5 38H19v9.5a9.5 9.5 0 0 1-19 0z" />
                <path d="M19 0v19h9.5a9.5 9.5 0 0 0 0-19H19z" />
                <path d="M0 9.5A9.5 9.5 0 0 0 9.5 19H19V0H9.5A9.5 9.5 0 0 0 0 9.5z" />
                <path d="M0 28.5A9.5 9.5 0 0 0 9.5 38H19V19H9.5A9.5 9.5 0 0 0 0 28.5z" />
              </svg>
            </div>
            <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">Figma Designs</h1>
          </div>
          <p className="text-sm text-gray-400 dark:text-gray-500 ml-[52px]">ดีไซน์จาก Figma ของคุณ — กดเพื่อดูหน้าแต่ละหน้า</p>
        </div>
        <Link
          href="/dashboard"
          className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
        >
          ← กลับ Dashboard
        </Link>
      </div>

      {error ? (
        <div className="rounded-2xl border border-red-200 dark:border-red-500/20 bg-red-50 dark:bg-red-500/5 p-6 text-center">
          <p className="text-sm text-red-600 dark:text-red-400 font-medium">{error}</p>
          <p className="text-xs text-red-400 dark:text-red-500 mt-1">ตรวจสอบ FIGMA_API_TOKEN และ FIGMA_TEAM_ID ใน .env</p>
        </div>
      ) : (
        <FigmaGallery initialFiles={files} />
      )}
    </div>
  )
}
