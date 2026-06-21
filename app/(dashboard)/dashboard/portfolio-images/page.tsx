"use client"
import { useState, useEffect, useRef } from "react"
import { useTheme } from "@/components/theme-provider"
import Image from "next/image"
import Link from "next/link"

interface PageImage { url: string; filename: string }
interface PortfolioPage {
  id: string; title: string; slug: string; images: PageImage[]
}

const PAGE_ICONS: Record<string, string> = {
  cover: "📋", "introduction-sop": "✦", "personal-info": "👤",
  education: "🎓", activities: "🏆", projects: "💼",
  certificates: "🏅", skills: "⚡", goals: "🎯", "thank-you": "🙏",
}

function getIcon(slug: string): string {
  for (const [key, icon] of Object.entries(PAGE_ICONS)) {
    if (slug.includes(key)) return icon
  }
  return "📄"
}

export default function PortfolioImagesPage() {
  const { dark } = useTheme()
  const [pages, setPages] = useState<PortfolioPage[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState<string | null>(null)

  useEffect(() => { fetchPages() }, [])

  async function fetchPages() {
    setLoading(true)
    const res = await fetch("/api/portfolio-pages")
    if (!res.ok) { setLoading(false); return }
    const data = await res.json()
    const mapped = data.map((p: { id: string; title: string; slug: string; content: string }) => {
      const content = JSON.parse(p.content || "{}")
      return { id: p.id, title: p.title, slug: p.slug, images: content.images || [] }
    })
    setPages(mapped)
    setLoading(false)
  }

  async function handleUpload(pageSlug: string, files: FileList) {
    setUploading(pageSlug)
    for (const file of Array.from(files)) {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("pageSlug", pageSlug)
      await fetch("/api/portfolio-images/upload", { method: "POST", body: formData })
    }
    await fetchPages()
    setUploading(null)
  }

  async function handleDelete(pageSlug: string, imageUrl: string) {
    await fetch("/api/portfolio-images", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pageSlug, imageUrl }),
    })
    await fetchPages()
  }

  const cardCls = `rounded-2xl border p-5 transition-colors ${dark ? "bg-white/[0.03] border-white/5" : "bg-white border-gray-100"}`

  if (loading) return (
    <div className="p-6 lg:p-8 max-w-3xl mx-auto">
      <p className={dark ? "text-gray-500" : "text-gray-400"}>กำลังโหลด...</p>
    </div>
  )

  if (pages.length === 0) return (
    <div className="p-6 lg:p-8 max-w-3xl mx-auto text-center py-20">
      <p className={`text-lg font-bold mb-2 ${dark ? "text-white" : "text-gray-900"}`}>ยังไม่มีพอร์ตโฟลิโอ</p>
      <p className={`text-sm mb-6 ${dark ? "text-gray-500" : "text-gray-400"}`}>สร้างพอร์ตโฟลิโอด้วย AI ก่อน แล้วค่อยมาเพิ่มรูปภาพ</p>
      <Link href="/dashboard/ai-builder" className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-6 py-3 rounded-xl text-sm font-bold">
        สร้างพอร์ตโฟลิโอ →
      </Link>
    </div>
  )

  return (
    <div className="p-6 lg:p-8 max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className={`text-2xl font-extrabold ${dark ? "text-white" : "text-gray-900"}`}>
          จัดการรูปภาพพอร์ตโฟลิโอ
        </h1>
        <p className={`text-sm mt-1 ${dark ? "text-gray-500" : "text-gray-400"}`}>
          อัพโหลดรูปภาพลงในแต่ละหน้า เช่น เกียรติบัตร รูปกิจกรรม ผลงาน
        </p>
      </div>

      <div className="space-y-4">
        {pages.map((page) => (
          <PageImageSection
            key={page.id}
            page={page}
            dark={dark}
            cardCls={cardCls}
            uploading={uploading === page.slug}
            onUpload={(files) => handleUpload(page.slug, files)}
            onDelete={(url) => handleDelete(page.slug, url)}
          />
        ))}
      </div>
    </div>
  )
}

function PageImageSection({
  page, dark, cardCls, uploading, onUpload, onDelete,
}: {
  page: PortfolioPage; dark: boolean; cardCls: string
  uploading: boolean
  onUpload: (files: FileList) => void
  onDelete: (url: string) => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <div className={cardCls}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-lg">{getIcon(page.slug)}</span>
          <div>
            <p className={`text-sm font-bold ${dark ? "text-white" : "text-gray-900"}`}>{page.title}</p>
            <p className={`text-xs ${dark ? "text-gray-600" : "text-gray-400"}`}>{page.images.length} รูป</p>
          </div>
        </div>
        <div>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => e.target.files && onUpload(e.target.files)}
          />
          <button
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className={`text-xs px-4 py-2 rounded-xl font-bold transition-all ${
              dark
                ? "bg-indigo-500/15 text-indigo-400 hover:bg-indigo-500/25"
                : "bg-indigo-50 text-indigo-600 hover:bg-indigo-100"
            } disabled:opacity-40`}
          >
            {uploading ? "กำลังอัพ..." : "+ เพิ่มรูป"}
          </button>
        </div>
      </div>

      {/* Images grid */}
      {page.images.length > 0 ? (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          {page.images.map((img, i) => (
            <div key={i} className="relative group aspect-square rounded-xl overflow-hidden">
              <Image
                src={img.url}
                alt={img.filename}
                fill
                className="object-cover"
              />
              <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center ${
                dark ? "bg-black/60" : "bg-black/40"
              }`}>
                <button
                  onClick={() => onDelete(img.url)}
                  className="w-8 h-8 rounded-full bg-red-500 text-white text-xs font-bold flex items-center justify-center hover:bg-red-600 transition-colors"
                >
                  ✕
                </button>
              </div>
              <p className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-[8px] px-2 py-1 truncate">
                {img.filename}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div
          onClick={() => inputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl py-8 text-center cursor-pointer transition-colors ${
            dark
              ? "border-white/10 hover:border-white/20 text-gray-600"
              : "border-gray-200 hover:border-gray-300 text-gray-400"
          }`}
        >
          <p className="text-2xl mb-2">📷</p>
          <p className="text-xs font-medium">คลิกเพื่ออัพโหลดรูปภาพ</p>
          <p className="text-xs mt-1 opacity-60">JPG, PNG, GIF, WebP (ไม่เกิน 10MB)</p>
        </div>
      )}
    </div>
  )
}
