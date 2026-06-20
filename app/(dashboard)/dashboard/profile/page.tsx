"use client"
import { useEffect, useState } from "react"
import Image from "next/image"

interface Profile {
  name: string
  bio: string
  school: string
  gpa: string
  avatarUrl: string
  theme: string
  contactLinks: { linkedin?: string; github?: string; phone?: string; website?: string }
}

const THEMES = [
  { value: "minimal", label: "Minimal", desc: "Clean white", emoji: "☀️" },
  { value: "dark", label: "Dark", desc: "Black modern", emoji: "🌙" },
  { value: "classic", label: "Classic", desc: "Warm cream", emoji: "📜" },
]

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile>({
    name: "", bio: "", school: "", gpa: "", avatarUrl: "", theme: "minimal",
    contactLinks: {},
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [avatarUploading, setAvatarUploading] = useState(false)

  useEffect(() => {
    fetch("/api/profile")
      .then((r) => r.json())
      .then((data) => {
        setProfile({
          name: data.name || "",
          bio: data.bio || "",
          school: data.school || "",
          gpa: data.gpa || "",
          avatarUrl: data.avatarUrl || "",
          theme: data.theme || "minimal",
          contactLinks: data.contactLinks ? JSON.parse(data.contactLinks) : {},
        })
        setLoading(false)
      })
  }, [])

  async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setAvatarUploading(true)
    const fd = new FormData()
    fd.append("files", file)
    const res = await fetch("/api/upload", { method: "POST", body: fd })
    const data = await res.json()
    if (data.files?.[0]) setProfile((p) => ({ ...p, avatarUrl: data.files[0].url }))
    setAvatarUploading(false)
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profile),
    })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  if (loading) {
    return (
      <div className="p-8 max-w-2xl">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-100 rounded-xl w-32" />
          <div className="h-4 bg-gray-100 rounded-xl w-64" />
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-gray-900 mb-1">โปรไฟล์</h1>
        <p className="text-sm text-gray-400">ข้อมูลนี้จะแสดงบนพอร์ตโฟลิโอสาธารณะของคุณ</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">

        {/* Avatar section */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <p className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-4">รูปโปรไฟล์</p>
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-2xl overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-200">
              {profile.avatarUrl ? (
                <Image src={profile.avatarUrl} alt="Avatar" width={80} height={80} className="object-cover w-full h-full" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-300 text-3xl">◎</div>
              )}
            </div>
            <div>
              <label className="cursor-pointer inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-gray-900 border border-gray-200 rounded-xl px-4 py-2.5 transition-all hover:border-gray-400 hover:bg-gray-50">
                {avatarUploading ? (
                  <><span className="w-3.5 h-3.5 border-2 border-gray-300 border-t-gray-700 rounded-full animate-spin" />กำลังอัปโหลด...</>
                ) : "อัปโหลดรูปภาพ"}
                <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
              </label>
              <p className="text-xs text-gray-400 mt-2">PNG, JPG ขนาดไม่เกิน 2MB</p>
            </div>
          </div>
        </div>

        {/* Basic info */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">
          <p className="text-xs font-bold tracking-widest text-gray-400 uppercase">ข้อมูลพื้นฐาน</p>
          {[
            { key: "name", label: "ชื่อ-นามสกุล", placeholder: "สมชาย ใจดี", type: "text" },
            { key: "school", label: "โรงเรียน / มหาวิทยาลัย", placeholder: "โรงเรียนสาธิต มหาวิทยาลัยเกษตรศาสตร์", type: "text" },
            { key: "gpa", label: "เกรดเฉลี่ย (ไม่บังคับ)", placeholder: "3.9 / 4.0", type: "text" },
          ].map((f) => (
            <div key={f.key}>
              <label className="block text-xs font-bold tracking-widest text-gray-500 mb-2 uppercase">{f.label}</label>
              <input
                type={f.type}
                value={profile[f.key as keyof Profile] as string}
                onChange={(e) => setProfile((p) => ({ ...p, [f.key]: e.target.value }))}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                placeholder={f.placeholder}
              />
            </div>
          ))}
          <div>
            <label className="block text-xs font-bold tracking-widest text-gray-500 mb-2 uppercase">แนะนำตัวเอง</label>
            <textarea
              value={profile.bio}
              onChange={(e) => setProfile((p) => ({ ...p, bio: e.target.value }))}
              rows={4}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
              placeholder="เขียนแนะนำตัวเองสั้นๆ..."
            />
          </div>
        </div>

        {/* Contact */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
          <p className="text-xs font-bold tracking-widest text-gray-400 uppercase">ช่องทางติดต่อ</p>
          <div className="space-y-3">
            {[
              { key: "linkedin", placeholder: "https://linkedin.com/in/...", icon: "💼" },
              { key: "github", placeholder: "https://github.com/...", icon: "🐙" },
              { key: "website", placeholder: "https://yoursite.com", icon: "🌐" },
              { key: "phone", placeholder: "08x-xxx-xxxx", icon: "📱" },
            ].map((f) => (
              <div key={f.key} className="flex items-center gap-3">
                <span className="text-lg w-8 text-center flex-shrink-0">{f.icon}</span>
                <input
                  type="text"
                  value={profile.contactLinks[f.key as keyof typeof profile.contactLinks] || ""}
                  onChange={(e) => setProfile((p) => ({ ...p, contactLinks: { ...p.contactLinks, [f.key]: e.target.value } }))}
                  className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  placeholder={f.placeholder}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Theme */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <p className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-4">ธีมพอร์ตโฟลิโอ</p>
          <div className="grid grid-cols-3 gap-3">
            {THEMES.map((t) => (
              <button
                key={t.value}
                type="button"
                onClick={() => setProfile((p) => ({ ...p, theme: t.value }))}
                className={`border-2 rounded-2xl p-4 text-left transition-all ${
                  profile.theme === t.value
                    ? "border-indigo-500 bg-indigo-50"
                    : "border-gray-100 hover:border-gray-200 hover:bg-gray-50"
                }`}
              >
                <div className="text-2xl mb-2">{t.emoji}</div>
                <div className={`text-sm font-bold mb-0.5 ${profile.theme === t.value ? "text-indigo-700" : "text-gray-700"}`}>
                  {t.label}
                </div>
                <div className="text-xs text-gray-400">{t.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Save */}
        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={saving}
            className="bg-gray-900 text-white px-6 py-3 rounded-xl text-sm font-bold hover:bg-black transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {saving ? (
              <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />กำลังบันทึก...</>
            ) : "บันทึกการเปลี่ยนแปลง"}
          </button>
          {saved && (
            <span className="text-sm text-green-500 font-semibold flex items-center gap-1.5">
              <span className="w-4 h-4 rounded-full bg-green-100 flex items-center justify-center text-[10px]">✓</span>
              บันทึกแล้ว
            </span>
          )}
        </div>
      </form>
    </div>
  )
}
