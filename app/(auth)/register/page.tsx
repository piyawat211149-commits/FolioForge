"use client"
import { useState } from "react"
import Link from "next/link"

export default function RegisterPage() {
  const [form, setForm] = useState({ name: "", username: "", email: "", password: "" })
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)
    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
    const data = await res.json()
    setLoading(false)
    if (!res.ok) setError(data.error || "เกิดข้อผิดพลาด กรุณาลองใหม่")
    else setSuccess(true)
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white p-6">
        <div className="w-full max-w-sm text-center">
          <div className="w-20 h-20 rounded-3xl bg-indigo-50 flex items-center justify-center text-4xl mx-auto mb-6">✉️</div>
          <h1 className="text-2xl font-extrabold text-gray-900 mb-3">ตรวจสอบอีเมลของคุณ</h1>
          <p className="text-gray-400 text-sm leading-relaxed mb-8">
            เราส่งลิงก์ยืนยันไปที่{" "}
            <strong className="text-gray-700">{form.email}</strong> แล้ว
            กรุณากดลิงก์ในอีเมลเพื่อเปิดใช้งานบัญชี
          </p>
          <Link href="/login" className="text-sm text-indigo-600 font-bold hover:text-indigo-700">
            กลับไปหน้าเข้าสู่ระบบ →
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gray-900 flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-600/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

        <div className="relative z-10">
          <Link href="/" className="text-white font-extrabold text-xl tracking-tight">FolioForge</Link>
        </div>

        <div className="relative z-10 space-y-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-500/20 text-indigo-300 text-xs font-bold tracking-widest rounded-full mb-4 border border-indigo-500/20 uppercase">
              ✨ ฟรี 100%
            </div>
            <h2 className="text-3xl font-extrabold text-white leading-tight mb-3">
              สร้างพอร์ตโฟลิโอ<br />ที่โดดเด่นใน 2 นาที
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed">
              AI จะเขียนเนื้อหา จัดหน้า และออกแบบพอร์ตโฟลิโอระดับมืออาชีพให้ทันที
            </p>
          </div>

          <div className="space-y-3">
            {[
              "ไม่ต้องมีความรู้ด้านออกแบบ",
              "AI เขียนเนื้อหาให้ทั้งหมด",
              "ได้ลิงก์พอร์ตโฟลิโอส่วนตัวทันที",
              "Export PDF คุณภาพสูง",
            ].map((f) => (
              <div key={f} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center flex-shrink-0">
                  <span className="text-green-400 text-[10px]">✓</span>
                </div>
                <span className="text-gray-300 text-sm">{f}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10">
          <p className="text-gray-600 text-xs">ไม่ต้องใช้บัตรเครดิต · ยกเลิกเมื่อไหร่ก็ได้</p>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white overflow-y-auto">
        <div className="w-full max-w-sm py-8">
          <Link href="/" className="lg:hidden block text-gray-900 font-extrabold text-lg mb-8">FolioForge</Link>

          <h1 className="text-2xl font-extrabold text-gray-900 mb-1">สร้างบัญชีฟรี</h1>
          <p className="text-gray-400 text-sm mb-8">ไม่ต้องใช้บัตรเครดิต · ใช้งานได้ทันที</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { name: "name", label: "ชื่อ-นามสกุล", type: "text", placeholder: "สมชาย ใจดี" },
              { name: "username", label: "ชื่อผู้ใช้", type: "text", placeholder: "somchai99" },
              { name: "email", label: "อีเมล", type: "email", placeholder: "you@example.com" },
              { name: "password", label: "รหัสผ่าน", type: "password", placeholder: "อย่างน้อย 8 ตัวอักษร" },
            ].map((field) => (
              <div key={field.name}>
                <label className="block text-xs font-bold tracking-widest text-gray-500 mb-2 uppercase">
                  {field.label}
                </label>
                <input
                  name={field.name}
                  type={field.type}
                  value={form[field.name as keyof typeof form]}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  placeholder={field.placeholder}
                />
              </div>
            ))}

            {error && (
              <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3 text-sm text-red-600">{error}</div>
            )}

            <button
              type="submit" disabled={loading}
              className="w-full bg-gray-900 text-white py-3.5 rounded-xl text-sm font-bold hover:bg-black transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />กำลังสร้างบัญชี...</>
              ) : "สร้างบัญชีฟรี →"}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-100 text-center">
            <p className="text-sm text-gray-400">
              มีบัญชีแล้ว?{" "}
              <Link href="/login" className="text-indigo-600 font-bold hover:text-indigo-700">เข้าสู่ระบบ</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
