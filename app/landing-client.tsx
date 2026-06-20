"use client"
import Link from "next/link"
import { useState, useEffect } from "react"
import { IntroAnimation } from "@/components/intro-animation"
import { ParticleBackground } from "@/components/particle-background"
import { LanguageToggle } from "@/components/language-toggle"
import { useLang } from "@/components/language-provider"

const DEMO_WORDS = ["พอร์ตโฟลิโอ", "ผลงาน", "ตัวตน", "อนาคต"]

export function LandingClient({ isLoggedIn = false }: { isLoggedIn?: boolean }) {
  const { t } = useLang()
  const [wordIdx, setWordIdx] = useState(0)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false)
      setTimeout(() => {
        setWordIdx(i => (i + 1) % DEMO_WORDS.length)
        setVisible(true)
      }, 300)
    }, 2200)
    return () => clearInterval(interval)
  }, [])

  const steps = [
    { num: "01", icon: "✍️", title: "บอกข้อมูลตัวเอง", desc: "กรอกชื่อ โรงเรียน และแนะนำตัวสั้นๆ ใช้เวลาแค่ 2 นาที" },
    { num: "02", icon: "🤖", title: "AI สร้างให้อัตโนมัติ", desc: "AI เขียนเนื้อหาและจัดโครงสร้างพอร์ตโฟลิโอให้ทันที" },
    { num: "03", icon: "🌐", title: "แชร์ให้โลกรู้จัก", desc: "ได้ลิงก์พอร์ตโฟลิโอส่วนตัว พร้อม PDF ดาวน์โหลด" },
  ]

  const features = [
    {
      icon: "🤖",
      title: "AI เขียนให้ทั้งหมด",
      desc: "Gemini AI เขียนเนื้อหาพอร์ตโฟลิโอระดับมืออาชีพ จากข้อมูลที่คุณให้",
      color: "bg-violet-50 border-violet-100",
      iconBg: "bg-violet-100 text-violet-600",
    },
    {
      icon: "📄",
      title: "สูงสุด 20 หน้า",
      desc: "กำหนดเองว่าจะมีกี่หน้า แต่ละหน้ามีเนื้อหาอะไร ยืดหยุ่นสุดๆ",
      color: "bg-blue-50 border-blue-100",
      iconBg: "bg-blue-100 text-blue-600",
    },
    {
      icon: "🇹🇭",
      title: "ภาษาไทย & อังกฤษ",
      desc: "สลับภาษาได้ทันที เหมาะทั้งพอร์ตไทยและส่ง AdCom ต่างประเทศ",
      color: "bg-green-50 border-green-100",
      iconBg: "bg-green-100 text-green-600",
    },
    {
      icon: "📥",
      title: "ดาวน์โหลด PDF",
      desc: "Export เป็น PDF คุณภาพสูงได้ทุกเมื่อ พร้อมส่งอาจารย์หรือสมัครงาน",
      color: "bg-orange-50 border-orange-100",
      iconBg: "bg-orange-100 text-orange-600",
    },
    {
      icon: "🎨",
      title: "ธีมสวยพร้อมใช้",
      desc: "เลือกธีมหลายแบบ ปรับสีสันให้เข้ากับตัวตนของคุณ",
      color: "bg-pink-50 border-pink-100",
      iconBg: "bg-pink-100 text-pink-600",
    },
    {
      icon: "🔗",
      title: "ลิงก์ส่วนตัว",
      desc: "ได้ URL พอร์ตโฟลิโอส่วนตัว folioforge.dev/username แชร์ได้เลย",
      color: "bg-indigo-50 border-indigo-100",
      iconBg: "bg-indigo-100 text-indigo-600",
    },
  ]

  return (
    <>
      <IntroAnimation />
      <main className="min-h-screen bg-white text-gray-900 flex flex-col relative">

        {/* ─── NAV ─── */}
        <nav className="sticky top-0 z-50 flex items-center justify-between px-8 py-4 border-b border-gray-100 bg-white/80 backdrop-blur-md">
          <span className="text-xl font-extrabold tracking-tight text-gray-900">FolioForge</span>
          <div className="flex items-center gap-4">
            <LanguageToggle />
            {isLoggedIn ? (
              <Link
                href="/dashboard"
                className="text-sm bg-gray-900 text-white px-5 py-2.5 font-semibold hover:bg-black transition-colors rounded-lg shadow-sm"
              >
                ไปยัง Dashboard →
              </Link>
            ) : (
              <>
                <Link href="/login" className="text-sm text-gray-500 hover:text-gray-900 transition-colors font-medium">
                  {t("landing.login")}
                </Link>
                <Link
                  href="/register"
                  className="text-sm bg-indigo-600 text-white px-5 py-2.5 font-semibold hover:bg-indigo-700 transition-colors rounded-lg shadow-sm"
                >
                  {t("landing.cta")}
                </Link>
              </>
            )}
          </div>
        </nav>

        {/* ─── HERO ─── */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 z-0 pointer-events-none">
            <ParticleBackground dark={false} />
          </div>
          <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 py-32 max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 text-xs font-bold tracking-widest rounded-full mb-8 border border-indigo-100 uppercase">
              ✨ AI-Powered · ฟรี 100%
            </div>

            {/* Headline */}
            <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight leading-[1.05] mb-4 text-gray-900">
              สร้าง{" "}
              <span
                className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent transition-opacity duration-300"
                style={{ opacity: visible ? 1 : 0 }}
              >
                {DEMO_WORDS[wordIdx]}
              </span>
              <br />
              ที่โดดเด่นด้วย AI
            </h1>

            <p className="text-gray-500 text-lg max-w-xl leading-relaxed mb-10">
              แค่บอกข้อมูลตัวเอง AI จะเขียน จัดหน้า และออกแบบพอร์ตโฟลิโอระดับมืออาชีพให้ทันที ไม่ต้องเขียนเองแม้แต่บรรทัดเดียว
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mb-16">
              <Link
                href="/register"
                className="group inline-flex items-center gap-2 bg-gray-900 text-white px-8 py-4 font-bold text-sm hover:bg-black transition-all rounded-xl shadow-lg shadow-gray-900/15 hover:shadow-xl hover:shadow-gray-900/20 hover:-translate-y-0.5"
              >
                <span>เริ่มสร้างพอร์ตโฟลิโอ</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 border border-gray-200 text-gray-600 px-8 py-4 font-medium text-sm hover:bg-gray-50 hover:border-gray-300 transition-all rounded-xl"
              >
                {t("landing.login")}
              </Link>
            </div>

            {/* Social proof */}
            <div className="flex items-center gap-6 text-sm text-gray-400">
              <span className="flex items-center gap-1.5">
                <span className="text-green-500">✓</span> ไม่ต้องใช้บัตรเครดิต
              </span>
              <span className="text-gray-200">|</span>
              <span className="flex items-center gap-1.5">
                <span className="text-green-500">✓</span> ใช้งานได้ทันที
              </span>
              <span className="text-gray-200">|</span>
              <span className="flex items-center gap-1.5">
                <span className="text-green-500">✓</span> ฟรีตลอด
              </span>
            </div>
          </div>
        </section>

        {/* ─── HOW IT WORKS ─── */}
        <section className="bg-gray-50 border-y border-gray-100 py-24 px-6">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <p className="text-indigo-600 text-xs font-bold tracking-widest uppercase mb-3">วิธีการทำงาน</p>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
                3 ขั้นตอน พอร์ตโฟลิโอพร้อม
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              {steps.map((s, i) => (
                <div key={s.num} className="relative flex flex-col items-center text-center">
                  {/* connector line */}
                  {i < steps.length - 1 && (
                    <div className="hidden sm:block absolute top-10 left-[58%] w-[84%] h-px bg-gradient-to-r from-gray-200 to-gray-100" />
                  )}
                  <div className="relative z-10 w-20 h-20 rounded-2xl bg-white border border-gray-200 shadow-sm flex items-center justify-center text-3xl mb-5">
                    {s.icon}
                    <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-indigo-600 text-white text-[10px] font-bold flex items-center justify-center">
                      {i + 1}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-gray-900 mb-2">{s.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
            <div className="text-center mt-14">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 bg-indigo-600 text-white px-8 py-4 font-bold text-sm hover:bg-indigo-700 transition-all rounded-xl shadow-md shadow-indigo-500/20"
              >
                Get Started — ฟรี 100% →
              </Link>
            </div>
          </div>
        </section>

        {/* ─── FEATURES ─── */}
        <section className="py-24 px-6">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <p className="text-indigo-600 text-xs font-bold tracking-widest uppercase mb-3">ฟีเจอร์</p>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
                ทุกอย่างที่นักเรียนต้องการ
              </h2>
              <p className="text-gray-500 mt-3 max-w-lg mx-auto">
                ครบจบในที่เดียว ตั้งแต่สร้างเนื้อหาจนถึงแชร์ให้คนอื่นดู
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {features.map((f) => (
                <div key={f.title} className={`rounded-2xl border p-6 ${f.color} hover:shadow-md transition-shadow`}>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg mb-4 ${f.iconBg}`}>
                    {f.icon}
                  </div>
                  <h3 className="text-sm font-bold text-gray-900 mb-1.5">{f.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── FINAL CTA ─── */}
        <section className="py-24 px-6">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-gradient-to-br from-indigo-600 to-violet-600 rounded-3xl p-12 shadow-2xl shadow-indigo-500/20">
              <div className="text-4xl mb-5">🚀</div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">
                พร้อมสร้างพอร์ตโฟลิโอแล้วหรือยัง?
              </h2>
              <p className="text-indigo-200 mb-8 text-sm leading-relaxed">
                เริ่มต้นได้ภายใน 2 นาที ไม่ต้องมีความรู้ด้านออกแบบ AI ทำให้ทุกอย่าง
              </p>
              <Link
                href="/register"
                className="inline-flex items-center gap-2 bg-white text-indigo-700 px-8 py-4 font-bold text-sm hover:bg-indigo-50 transition-all rounded-xl shadow-lg"
              >
                Get Started ฟรี →
              </Link>
              <p className="text-indigo-300 text-xs mt-4">ไม่ต้องใช้บัตรเครดิต · ยกเลิกเมื่อไหร่ก็ได้</p>
            </div>
          </div>
        </section>

        {/* ─── FOOTER ─── */}
        <footer className="border-t border-gray-100 py-8 px-8">
          <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-sm font-bold text-gray-900">FolioForge</span>
            <p className="text-xs text-gray-400">© 2026 FolioForge · สร้างพอร์ตโฟลิโอที่โดดเด่นด้วย AI</p>
            <div className="flex gap-4 text-xs text-gray-400">
              <Link href="/login" className="hover:text-gray-700 transition-colors">เข้าสู่ระบบ</Link>
              <Link href="/register" className="hover:text-gray-700 transition-colors">สมัครใช้งาน</Link>
            </div>
          </div>
        </footer>

      </main>
    </>
  )
}
