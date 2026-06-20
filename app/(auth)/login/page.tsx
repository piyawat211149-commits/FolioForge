"use client"
import { useState, Suspense } from "react"
import { signIn } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { useTheme } from "@/components/theme-provider"

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
      <style>{`
        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes float-up {
          0%, 100% { transform: translateY(0) scale(1); opacity: 0.15; }
          50% { transform: translateY(-30px) scale(1.1); opacity: 0.25; }
        }
        @keyframes slide-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes glow-pulse {
          0%, 100% { box-shadow: 0 0 20px rgba(99,102,241,0.1); }
          50% { box-shadow: 0 0 40px rgba(99,102,241,0.2); }
        }
        .animate-gradient { animation: gradient-shift 8s ease infinite; background-size: 200% 200%; }
        .animate-slide-in { animation: slide-in 0.6s ease-out forwards; }
        .animate-slide-in-d1 { animation: slide-in 0.6s ease-out 0.1s forwards; opacity: 0; }
        .animate-slide-in-d2 { animation: slide-in 0.6s ease-out 0.2s forwards; opacity: 0; }
        .animate-slide-in-d3 { animation: slide-in 0.6s ease-out 0.3s forwards; opacity: 0; }
        .animate-glow { animation: glow-pulse 3s ease-in-out infinite; }
        .input-focus { transition: all 0.3s ease; }
        .input-focus:focus { transform: translateY(-1px); box-shadow: 0 4px 20px rgba(99,102,241,0.15); }
      `}</style>

      {/* Left panel — animated background */}
      <div className="hidden lg:flex lg:w-1/2 bg-gray-900 flex-col justify-between p-12 relative overflow-hidden">
        {/* Animated gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/30 via-violet-600/20 to-purple-600/30 animate-gradient" />

        {/* Floating orbs */}
        <div className="absolute top-20 right-20 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl" style={{ animation: "float-up 6s ease-in-out infinite" }} />
        <div className="absolute bottom-20 left-10 w-56 h-56 bg-violet-500/20 rounded-full blur-3xl" style={{ animation: "float-up 8s ease-in-out 2s infinite" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" style={{ animation: "float-up 10s ease-in-out 1s infinite" }} />

        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />

        <div className="relative z-10 animate-slide-in">
          <Link href="/" className="text-white font-extrabold text-xl tracking-tight">FolioForge</Link>
        </div>

        <div className="relative z-10 space-y-8">
          <div className="animate-slide-in-d1">
            <h2 className="text-4xl font-extrabold text-white leading-tight mb-4">
              พอร์ตโฟลิโอ<br />
              <span className="bg-gradient-to-r from-indigo-300 via-violet-300 to-purple-300 bg-clip-text text-transparent">ระดับมืออาชีพ</span>
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
              บอกข้อมูลตัวเอง AI จะเขียนเนื้อหา จัดหน้า และออกแบบให้ทันที ใน 2 นาที
            </p>
          </div>

          <div className="space-y-3 animate-slide-in-d2">
            {[
              { icon: "🤖", text: "AI เขียนเนื้อหาพอร์ตโฟลิโอให้ทั้งหมด", color: "from-indigo-500/20 to-indigo-500/5" },
              { icon: "📄", text: "กำหนดเองได้ สูงสุด 20 หน้า", color: "from-violet-500/20 to-violet-500/5" },
              { icon: "🌐", text: "รองรับภาษาไทยและอังกฤษ", color: "from-purple-500/20 to-purple-500/5" },
              { icon: "📥", text: "Export PDF คุณภาพสูง", color: "from-pink-500/20 to-pink-500/5" },
            ].map((f) => (
              <div key={f.text} className="flex items-center gap-3 group">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${f.color} border border-white/5 flex items-center justify-center text-sm flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                  {f.icon}
                </div>
                <span className="text-gray-300 text-sm group-hover:text-white transition-colors duration-300">{f.text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 animate-slide-in-d3">
          <div className="flex items-center gap-3 p-4 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm hover:bg-white/10 transition-colors duration-300">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center text-lg flex-shrink-0 shadow-lg shadow-indigo-500/20">🎓</div>
            <div>
              <p className="text-white text-xs font-semibold">&ldquo;ใช้งานง่ายมาก AI เขียนให้หมดเลย&rdquo;</p>
              <p className="text-gray-500 text-xs mt-0.5">นักเรียน ม.6 · โรงเรียนสาธิต</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white dark:bg-[#0a0a14] relative overflow-hidden transition-colors duration-300">
        {/* Subtle background */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-50 dark:bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-60" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-violet-50 dark:bg-violet-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 opacity-60" />

        <div className="w-full max-w-sm relative z-10">
          {/* Mobile logo */}
          <Link href="/" className="lg:hidden block text-gray-900 dark:text-white font-extrabold text-lg mb-8">FolioForge</Link>

          {verified && (
            <div className="mb-6 p-4 rounded-xl bg-green-50 dark:bg-green-500/10 border border-green-100 dark:border-green-500/20 text-sm text-green-700 dark:text-green-400 font-medium animate-slide-in">
              ✓ ยืนยันอีเมลสำเร็จ! เข้าสู่ระบบได้เลย
            </div>
          )}

          <div className="animate-slide-in">
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-1">ยินดีต้อนรับกลับ</h1>
            <p className="text-gray-400 dark:text-gray-500 text-sm mb-8">เข้าสู่ระบบ FolioForge ของคุณ</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="animate-slide-in-d1">
              <label className="block text-xs font-bold tracking-widest text-gray-500 dark:text-gray-400 mb-2 uppercase">อีเมล</label>
              <input
                type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                className="input-focus w-full border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3.5 text-sm text-gray-900 dark:text-white placeholder-gray-300 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-white/5 transition-colors"
                placeholder="you@example.com"
              />
            </div>
            <div className="animate-slide-in-d2">
              <label className="block text-xs font-bold tracking-widest text-gray-500 dark:text-gray-400 mb-2 uppercase">รหัสผ่าน</label>
              <input
                type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
                className="input-focus w-full border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3.5 text-sm text-gray-900 dark:text-white placeholder-gray-300 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-white/5 transition-colors"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 rounded-xl px-4 py-3 text-sm text-red-600 dark:text-red-400 animate-slide-in">{error}</div>
            )}

            <div className="animate-slide-in-d3">
              <button
                type="submit" disabled={loading}
                className="animate-glow w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white py-3.5 rounded-xl text-sm font-bold transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30 hover:-translate-y-0.5 duration-300"
              >
                {loading ? (
                  <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />กำลังเข้าสู่ระบบ...</>
                ) : "เข้าสู่ระบบ →"}
              </button>
            </div>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-100 dark:border-white/5 text-center animate-slide-in-d3">
            <p className="text-sm text-gray-400 dark:text-gray-500">
              ยังไม่มีบัญชี?{" "}
              <Link href="/register" className="text-indigo-600 dark:text-indigo-400 font-bold hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors">สมัครสมาชิกฟรี</Link>
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
