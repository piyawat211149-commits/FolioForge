"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"

interface ProjectFile {
  id: string; url: string; filename: string; type: string
}

interface InitialData {
  id?: string; title?: string; description?: string; tags?: string[]
  externalUrl?: string; isPublic?: boolean; date?: string; files?: ProjectFile[]
}

export function ProjectForm({ initialData }: { initialData?: InitialData }) {
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

  const inputCls = "w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
  const labelCls = "block text-xs font-semibold tracking-wide text-gray-500 mb-1.5 uppercase"

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
                  <div className="w-20 h-20 relative border border-gray-200 rounded-xl overflow-hidden">
                    <Image src={f.url} alt={f.filename} fill className="object-cover" />
                  </div>
                ) : (
                  <div className="w-20 h-20 border border-gray-200 rounded-xl flex items-center justify-center bg-gray-50 px-2">
                    <span className="text-xs text-gray-400 text-center leading-tight truncate w-full">📄 {f.filename}</span>
                  </div>
                )}
                <button type="button" onClick={() => removeFile(f.id)}
                  className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-white border border-gray-200 rounded-full text-gray-400 hover:text-red-500 text-xs hidden group-hover:flex items-center justify-center shadow-sm">
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
        <label className="cursor-pointer inline-flex items-center gap-2 border border-dashed border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-400 hover:text-gray-700 hover:border-gray-300 transition-colors">
          {uploading ? "กำลังอัปโหลด..." : "+ อัปโหลดไฟล์"}
          <input type="file" multiple accept="image/*,application/pdf" className="hidden" onChange={handleFileUpload} />
        </label>
        <p className="text-xs text-gray-300 mt-2">JPG, PNG, GIF, WEBP, PDF — สูงสุด 10MB ต่อไฟล์</p>
      </div>

      {/* Public toggle */}
      <div className="flex items-center gap-3">
        <label className="relative inline-flex items-center cursor-pointer">
          <input type="checkbox" name="isPublic" checked={form.isPublic} onChange={handleChange} className="sr-only peer" />
          <div className="w-10 h-6 bg-gray-200 peer-checked:bg-indigo-500 rounded-full transition-colors relative">
            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.isPublic ? "translate-x-5" : "translate-x-1"}`} />
          </div>
        </label>
        <span className="text-sm text-gray-500">
          {form.isPublic ? "สาธารณะ — แสดงในพอร์ตโฟลิโอ" : "ส่วนตัว — มองเห็นเฉพาะคุณ"}
        </span>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3 text-sm text-red-600">{error}</div>
      )}

      <div className="flex items-center gap-4 pt-2">
        <button type="submit" disabled={saving || uploading}
          className="bg-gray-900 text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-black transition-colors disabled:opacity-50">
          {saving ? "กำลังบันทึก..." : isEdit ? "บันทึกการเปลี่ยนแปลง" : "เพิ่มโปรเจกต์"}
        </button>
        <button type="button" onClick={() => router.back()} className="text-sm text-gray-400 hover:text-gray-700 transition-colors">
          ยกเลิก
        </button>
      </div>
    </form>
  )
}
