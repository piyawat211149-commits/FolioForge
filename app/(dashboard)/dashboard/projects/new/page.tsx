import { ProjectForm } from "@/app/(dashboard)/project-form"
import Link from "next/link"

export default function NewProjectPage() {
  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-8">
        <Link href="/dashboard" className="text-xs text-gray-400 hover:text-gray-700 transition-colors font-medium mb-4 inline-flex items-center gap-1">
          ← กลับ
        </Link>
        <h1 className="text-2xl font-extrabold text-gray-900 mb-1">เพิ่มโปรเจกต์ใหม่</h1>
        <p className="text-sm text-gray-400">เพิ่มผลงานลงในพอร์ตโฟลิโอของคุณ</p>
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <ProjectForm />
      </div>
    </div>
  )
}
