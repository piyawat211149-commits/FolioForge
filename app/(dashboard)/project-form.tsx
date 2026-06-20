"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { useTheme } from "@/components/theme-provider"

interface ProjectFile {
  id: string; url: string; filename: string; type: string
}

interface InitialData {
  id?: string; title?: string; description?: string; tags?: string[]
  externalUrl?: string; isPublic?: boolean; date?: string; files?: ProjectFile[]
}

export function ProjectForm({ initialData }: { initialData?: InitialData }) {
  const { dark } = useTheme()
  const router = useRouter()
  const isEdit = !!initialData?.id

  const [form, setForm] = useState({
    title: initialData?.title || "",
    description: initialData?.description || "",
    tags: initialData?.tags?.join(", ") || "",
    externalUrl: initialData?.externalUrl || "",
    isPublic: initialData?.isPublic !== false,
    date: initialData?.date || "",
  })
  const [files, setFiles] = useState<ProjectFile[]>(initialData?.files || [])
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value, type } = e.target
    setForm((p) => ({ ...p, [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value }))
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(e.target.files || [])
    if (!selected.length) return
    setUploading(true)
    const fd = new FormData()
    selected.forEach((f) => fd.append("files", f))
    const res = await fetch("/api/upload", { method: "POST", body: fd })
    const data = await res.json()
    if (data.files) setFiles((prev) => [...prev, ...data.files])
    setUploading(false)
    e.target.value = ""
  }

  async function removeFile(fileId: string) {
    await fetch("/api/upload", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ fileId }) })
    setFiles((prev) => prev.filter((f) => f.id !== fileId))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setSaving(true)
    const tags = form.tags.split(",").map((t) => t.trim()).filter(Boolean)
    const payload = { ...form, tags, fileIds: files.map((f) => f.id) }
    const url = isEdit ? `/api/projects/${initialData!.id}` : "/api/projects"
    const res = await fetch(url, { method: isEdit ? "PATCH" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) })
    const data = await res.json()
    setSaving(false)
    if (!res.ok) {
      setError(data.error || "เกิดข้อผิดพลาด กรุณาลองใหม่")
    } else {
      if (!isEdit && data.id && files.length) {
        await Promise.all(files.map((f) =>
          fetch("/api/upload", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ fileId: f.id, projectId: data.id }) }).catch(() => {})
        ))
      }
      router.push("/dashboard")
      router.refresh()
    }
  }

  const inputCls = `w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${dark ? "border-white/10 bg-white/5 text-white placeholder-gray-500" : "border-gray-200 bg-white text-gray-900 placeholder-gray-300"}`
  const labelCls = `block text-xs font-semibold tracking-wide mb-1.5 uppercase ${dark ? "text-gray-400" : "text-gray-500"}`

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className={labelCls}>ชื่อโปรเจกต์ *</label>
        <input name="title" value={form.title} onChange={handleChange} required
          className={inputCls}
          placeholder="เช่น งานวิจัยวิทยาศาสตร์ ม.6" />
      </div>

      <div>
        <label className={labelCls}>รายละเอียด *</label>
        <textarea name="description" value={form.description} onChange={handleChange} required rows={5}
          className={`${inputCls} resize-none`}
          placeholder="อธิบายสิ่งที่คุณทำ สิ่งที่ได้เรียนรู้ และทำไมมันสำคัญ..." />
      </div>

      <div>
        <label className={labelCls}>แท็ก / หมวดหมู่</label>
        <input name="tags" value={form.tags} onChange={handleChange}
          className={inputCls}
          placeholder="วิจัย, ชีววิทยา, การเขียน  (คั่นด้วยจุลภาค)" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>วันที่</label>
          <input name="date" type="date" value={form.date} onChange={handleChange}
            className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>ลิงก์ภายนอก</label>
          <input name="externalUrl" type="url" value={form.externalUrl} onChange={handleChange}
            className={inputCls}
            placeholder="https://github.com/..." />
        </div>
      </div>

      {/* Files */}
      <div>
        <label className={labelCls}>ไฟล์ (รูปภาพ & PDF)</label>
        {files.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-3">
            {files.map((f) => (
              <div key={f.id} className="relative group">
                {f.type === "image" ? (
                  <div className={`w-20 h-20 relative border rounded-xl overflow-hidden ${dark ? "border-white/10" : "border-gray-200"}`}>
                    <Image src={f.url} alt={f.filename} fill className="object-cover" />
                  </div>
                ) : (
                  <div className={`w-20 h-20 border rounded-xl flex items-center justify-center px-2 ${dark ? "border-white/10 bg-white/5" : "border-gray-200 bg-gray-50"}`}>
                    <span className={`text-xs text-center leading-tight truncate w-full ${dark ? "text-gray-400" : "text-gray-400"}`}>📄 {f.filename}</span>
                  </div>
                )}
                <button type="button" onClick={() => removeFile(f.id)}
                  className={`absolute -top-1.5 -right-1.5 w-5 h-5 border rounded-full text-xs hidden group-hover:flex items-center justify-center shadow-sm ${
                    dark ? "bg-gray-800 border-white/10 text-gray-400 hover:text-red-400" : "bg-white border-gray-200 text-gray-400 hover:text-red-500"
                  }`}>
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
        <label className={`cursor-pointer inline-flex items-center gap-2 border border-dashed rounded-xl px-4 py-2.5 text-sm transition-colors ${
          dark ? "border-white/10 text-gray-500 hover:text-gray-300 hover:border-white/20" : "border-gray-200 text-gray-400 hover:text-gray-700 hover:border-gray-300"
        }`}>
          {uploading ? "กำลังอัปโหลด..." : "+ อัปโหลดไฟล์"}
          <input type="file" multiple accept="image/*,application/pdf" className="hidden" onChange={handleFileUpload} />
        </label>
        <p className={`text-xs mt-2 ${dark ? "text-gray-600" : "text-gray-300"}`}>JPG, PNG, GIF, WEBP, PDF — สูงสุด 10MB ต่อไฟล์</p>
      </div>

      {/* Public toggle */}
      <div className="flex items-center gap-3">
        <label className="relative inline-flex items-center cursor-pointer">
          <input type="checkbox" name="isPublic" checked={form.isPublic} onChange={handleChange} className="sr-only peer" />
          <div className={`w-10 h-6 rounded-full transition-colors relative ${form.isPublic ? "bg-indigo-500" : dark ? "bg-white/10" : "bg-gray-200"}`}>
            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.isPublic ? "translate-x-5" : "translate-x-1"}`} />
          </div>
        </label>
        <span className={`text-sm ${dark ? "text-gray-400" : "text-gray-500"}`}>
          {form.isPublic ? "สาธารณะ — แสดงในพอร์ตโฟลิโอ" : "ส่วนตัว — มองเห็นเฉพาะคุณ"}
        </span>
      </div>

      {error && (
        <div className={`rounded-xl px-4 py-3 text-sm ${dark ? "bg-red-500/10 border border-red-500/20 text-red-400" : "bg-red-50 border border-red-100 text-red-600"}`}>{error}</div>
      )}

      <div className="flex items-center gap-4 pt-2">
        <button type="submit" disabled={saving || uploading}
          className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white px-6 py-3 rounded-xl text-sm font-bold transition-all disabled:opacity-50 shadow-lg shadow-indigo-500/20 hover:-translate-y-0.5 duration-300">
          {saving ? "กำลังบันทึก..." : isEdit ? "บันทึกการเปลี่ยนแปลง" : "เพิ่มโปรเจกต์"}
        </button>
        <button type="button" onClick={() => router.back()} className={`text-sm transition-colors ${dark ? "text-gray-500 hover:text-gray-300" : "text-gray-400 hover:text-gray-700"}`}>
          ยกเลิก
        </button>
      </div>
    </form>
  )
}
