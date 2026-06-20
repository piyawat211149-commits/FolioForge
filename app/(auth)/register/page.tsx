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
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#0a0a14] p-6 transition-colors duration-300">
        <style>{`
          @keyframes check-pop { 0% { transform: scale(0) rotate(-45deg); opacity: 0; } 50% { transform: scale(1.2) rotate(0deg); } 100% { transform: scale(1) rotate(0deg); opacity: 1; } }
          @keyframes fade-up { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
          .anim-check { animation: check-pop 0.6s cubic-bezier(0.34,1.56,0.64,1) forwards; }
          .anim-fade { animation: fade-up 0.5s ease-out 0.3s forwards; opacity: 0; }
          .anim-fade-d2 { animation: fade-up 0.5s ease-out 0.5s forwards; opacity: 0; }
        `}</style>
        <div className="w-full max-w-sm text-center">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-4xl mx-auto mb-6 shadow-xl shadow-indigo-500/25 anim-check">✉️</div>
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-3 anim-fade">ตรวจสอบอีเมลของคุณ</h1>
          <p className="text-gray-400 dark:text-gray-500 text-sm leading-relaxed mb-8 anim-fade">
            เราส่งลิงก์ยืนยันไปที่{" "}
            <strong className="text-gray-700 dark:text-gray-300">{form.email}</strong> แล้ว
            กรุณากดลิงก์ในอีเมลเพื่อเปิดใช้งานบัญชี
          </p>
          <Link href="/login" className="text-sm text-indigo-600 dark:text-indigo-400 font-bold hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors anim-fade-d2 inline-block">
            กลับไปหน้าเข้าสู่ระบบ →
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex">
      <style>{`
        @keyframes gradient-shift { 0%, 100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } }
        @keyframes float-orb { 0%, 100% { transform: translateY(0) scale(1); opacity: 0.15; } 50% { transform: translateY(-30px) scale(1.1); opacity: 0.25; } }
        @keyframes slide-in { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes glow-pulse { 0%, 100% { box-shadow: 0 0 20px rgba(99,102,241,0.1); } 50% { box-shadow: 0 0 40px rgba(99,102,241,0.2); } }
        @keyframes count-up { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        .animate-gradient { animation: gradient-shift 8s ease infinite; background-size: 200% 200%; }
        .animate-slide-in { animation: slide-in 0.6s ease-out forwards; }
        .slide-d1 { animation: slide-in 0.6s ease-out 0.1s forwards; opacity: 0; }
        .slide-d2 { animation: slide-in 0.6s ease-out 0.2s forwards; opacity: 0; }
        .slide-d3 { animation: slide-in 0.6s ease-out 0.3s forwards; opacity: 0; }
        .slide-d4 { animation: slide-in 0.6s ease-out 0.4s forwards; opacity: 0; }
        .slide-d5 { animation: slide-in 0.6s ease-out 0.5s forwards; opacity: 0; }
        .animate-glow { animation: glow-pulse 3s ease-in-out infinite; }
        .input-float { transition: all 0.3s ease; }
        .input-float:focus { transform: translateY(-1px); box-shadow: 0 4px 20px rgba(99,102,241,0.15); }
      `}</style>

      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gray-900 flex-col justify-between p-12 relative overflow-hidden">
        {/* Animated gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-violet-600/30 via-indigo-600/20 to-purple-600/30 animate-gradient" />

        {/* Floating orbs */}
        <div className="absolute top-16 right-16 w-72 h-72 bg-violet-500/20 rounded-full blur-3xl" style={{ animation: "float-orb 7s ease-in-out infinite" }} />
        <div className="absolute bottom-24 left-8 w-56 h-56 bg-indigo-500/20 rounded-full blur-3xl" style={{ animation: "float-orb 9s ease-in-out 2s infinite" }} />
        <div className="absolute top-1/2 left-1/3 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" style={{ animation: "float-orb 11s ease-in-out 1s infinite" }} />

        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />

        <div className="relative z-10 animate-slide-in">
          <Link href="/" className="text-white font-extrabold text-xl tracking-tight">FolioForge</Link>
        </div>

        <div className="relative z-10 space-y-7">
          <div className="slide-d1">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-500/20 text-indigo-300 text-xs font-bold tracking-widest rounded-full mb-4 border border-indigo-500/20 uppercase backdrop-blur-sm">
              ✨ ฟรี 100%
            </div>
            <h2 className="text-4xl font-extrabold text-white leading-tight mb-4">
              สร้างพอร์ตโฟลิโอ<br />
              <span className="bg-gradient-to-r from-violet-300 via-indigo-300 to-purple-300 bg-clip-text text-transparent">ที่โดดเด่นใน 2 นาที</span>
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
              AI จะเขียนเนื้อหา จัดหน้า และออกแบบพอร์ตโฟลิโอระดับมืออาชีพให้ทันที
            </p>
          </div>

          <div className="space-y-3 slide-d2">
            {[
              { text: "ไม่ต้องมีความรู้ด้านออกแบบ", color: "from-green-500/20 to-emerald-500/10" },
              { text: "AI เขียนเนื้อหาให้ทั้งหมด", color: "from-indigo-500/20 to-blue-500/10" },
              { text: "ได้ลิงก์พอร์ตโฟลิโอส่วนตัวทันที", color: "from-violet-500/20 to-purple-500/10" },
              { text: "Export PDF คุณภาพสูง", color: "from-pink-500/20 to-rose-500/10" },
            ].map((f) => (
              <div key={f.text} className="flex items-center gap-3 group">
                <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${f.color} border border-white/5 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                  <span className="text-green-400 text-xs font-bold">✓</span>
                </div>
                <span className="text-gray-300 text-sm group-hover:text-white transition-colors duration-300">{f.text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 slide-d3">
          <p className="text-gray-600 text-xs">ไม่ต้องใช้บัตรเครดิต · ยกเลิกเมื่อไหร่ก็ได้</p>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white dark:bg-[#0a0a14] overflow-y-auto relative transition-colors duration-300">
        {/* Subtle background orbs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-violet-50 dark:bg-violet-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-60" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-50 dark:bg-indigo-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 opacity-60" />

        <div className="w-full max-w-sm py-8 relative z-10">
          <Link href="/" className="lg:hidden block text-gray-900 dark:text-white font-extrabold text-lg mb-8">FolioForge</Link>

          <div className="animate-slide-in">
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-1">สร้างบัญชีฟรี</h1>
            <p className="text-gray-400 dark:text-gray-500 text-sm mb-8">ไม่ต้องใช้บัตรเครดิต · ใช้งานได้ทันที</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              { name: "name", label: "ชื่อ-นามสกุล", type: "text", placeholder: "สมชาย ใจดี", delay: "slide-d1" },
              { name: "username", label: "ชื่อผู้ใช้", type: "text", placeholder: "somchai99", delay: "slide-d2" },
              { name: "email", label: "อีเมล", type: "email", placeholder: "you@example.com", delay: "slide-d3" },
              { name: "password", label: "รหัสผ่าน", type: "password", placeholder: "อย่างน้อย 8 ตัวอักษร", delay: "slide-d4" },
            ].map((field) => (
              <div key={field.name} className={field.delay}>
                <label className="block text-xs font-bold tracking-widest text-gray-500 dark:text-gray-400 mb-2 uppercase">
                  {field.label}
                </label>
                <input
                  name={field.name}
                  type={field.type}
                  value={form[field.name as keyof typeof form]}
                  onChange={handleChange}
                  required
                  className="input-float w-full border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3.5 text-sm text-gray-900 dark:text-white placeholder-gray-300 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-white/5 transition-colors"
                  placeholder={field.placeholder}
                />
              </div>
            ))}

            {error && (
              <div className="bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 rounded-xl px-4 py-3 text-sm text-red-600 dark:text-red-400 animate-slide-in">{error}</div>
            )}

            <div className="slide-d5">
              <button
                type="submit" disabled={loading}
                className="animate-glow w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white py-3.5 rounded-xl text-sm font-bold transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30 hover:-translate-y-0.5 duration-300"
              >
                {loading ? (
                  <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />กำลังสร้างบัญชี...</>
                ) : "สร้างบัญชีฟรี →"}
              </button>
            </div>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-100 dark:border-white/5 text-center slide-d5">
            <p className="text-sm text-gray-400 dark:text-gray-500">
              มีบัญชีแล้ว?{" "}
              <Link href="/login" className="text-indigo-600 dark:text-indigo-400 font-bold hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors">เข้าสู่ระบบ</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
