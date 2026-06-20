"use client"
import { useState, Suspense } from "react"
import { signIn } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"

function LoginForm() {
  const router = useRouter()
  const params = useSearchParams()
  const verified = params.get("verified")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)
    const res = await signIn("credentials", { email, password, redirect: false })
    setLoading(false)
    if (res?.error === "EMAIL_NOT_VERIFIED") {
      setError("กรุณายืนยันอีเมลก่อนเข้าสู่ระบบ")
    } else if (res?.error) {
      setError("อีเมลหรือรหัสผ่านไม่ถูกต้อง")
    } else {
      router.push("/dashboard")
      router.refresh()
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gray-900 flex-col justify-between p-12 relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-violet-600/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

        <div className="relative z-10">
          <Link href="/" className="text-white font-extrabold text-xl tracking-tight">FolioForge</Link>
        </div>

        <div className="relative z-10 space-y-8">
          <div>
            <h2 className="text-3xl font-extrabold text-white leading-tight mb-3">
              พอร์ตโฟลิโอระดับมืออาชีพ<br />สร้างด้วย AI ใน 2 นาที
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed">
              บอกข้อมูลตัวเอง AI จะเขียนเนื้อหา จัดหน้า และออกแบบให้ทันที
            </p>
          </div>

          <div className="space-y-4">
            {[
              { icon: "🤖", text: "AI เขียนเนื้อหาพอร์ตโฟลิโอให้ทั้งหมด" },
              { icon: "📄", text: "กำหนดเองได้ สูงสุด 20 หน้า" },
              { icon: "🌐", text: "รองรับภาษาไทยและอังกฤษ" },
              { icon: "📥", text: "Export PDF คุณภาพสูง" },
            ].map((f) => (
              <div key={f.text} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-sm flex-shrink-0">
                  {f.icon}
                </div>
                <span className="text-gray-300 text-sm">{f.text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 p-4 bg-white/5 border border-white/10 rounded-2xl">
            <div className="w-10 h-10 rounded-full bg-indigo-500/30 flex items-center justify-center text-lg flex-shrink-0">🎓</div>
            <div>
              <p className="text-white text-xs font-semibold">"ใช้งานง่ายมาก AI เขียนให้หมดเลย"</p>
              <p className="text-gray-500 text-xs mt-0.5">นักเรียน ม.6 · โรงเรียนสาธิต</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right panel - form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <Link href="/" className="lg:hidden block text-gray-900 font-extrabold text-lg mb-8">FolioForge</Link>

          {verified && (
            <div className="mb-6 p-4 rounded-xl bg-green-50 border border-green-100 text-sm text-green-700 font-medium">
              ✓ ยืนยันอีเมลสำเร็จ! เข้าสู่ระบบได้เลย
            </div>
          )}

          <h1 className="text-2xl font-extrabold text-gray-900 mb-1">ยินดีต้อนรับกลับ</h1>
          <p className="text-gray-400 text-sm mb-8">เข้าสู่ระบบ FolioForge ของคุณ</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold tracking-widest text-gray-500 mb-2 uppercase">อีเมล</label>
              <input
                type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-xs font-bold tracking-widest text-gray-500 mb-2 uppercase">รหัสผ่าน</label>
              <input
                type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3 text-sm text-red-600">{error}</div>
            )}

            <button
              type="submit" disabled={loading}
              className="w-full bg-gray-900 text-white py-3.5 rounded-xl text-sm font-bold hover:bg-black transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />กำลังเข้าสู่ระบบ...</>
              ) : "เข้าสู่ระบบ →"}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-100 text-center">
            <p className="text-sm text-gray-400">
              ยังไม่มีบัญชี?{" "}
              <Link href="/register" className="text-indigo-600 font-bold hover:text-indigo-700">สมัครสมาชิกฟรี</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return <Suspense><LoginForm /></Suspense>
}
