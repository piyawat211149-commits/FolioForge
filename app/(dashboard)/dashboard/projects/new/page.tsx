import { ProjectForm } from "@/app/(dashboard)/project-form"
import Link from "next/link"

export default function NewProjectPage() {
  return (
    <div className="p-6 lg:p-8 max-w-2xl">
      <div className="mb-8">
        <Link href="/dashboard" className="text-xs text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors font-medium mb-4 inline-flex items-center gap-1">
          ← กลับ
        </Link>
        <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-1">เพิ่มโปรเจกต์ใหม่</h1>
        <p className="text-sm text-gray-400 dark:text-gray-500">เพิ่มผลงานลงในพอร์ตโฟลิโอของคุณ</p>
      </div>
      <div className="bg-white dark:bg-white/[0.03] rounded-2xl border border-gray-100 dark:border-white/5 p-6 transition-colors duration-300">
        <ProjectForm />
      </div>
    </div>
  )
}
