"use client"
import Link from "next/link"
import { useState, useEffect, useRef } from "react"
import { IntroAnimation } from "@/components/intro-animation"
import { ParticleBackground } from "@/components/particle-background"
import { LanguageToggle } from "@/components/language-toggle"
import { useLang } from "@/components/language-provider"

const DEMO_WORDS = ["พอร์ตโฟลิโอ", "ผลงาน", "ตัวตน", "อนาคต"]

function useScrollY() {
  const [scrollY, setScrollY] = useState(0)
  useEffect(() => {
    const handler = () => setScrollY(window.scrollY)
    window.addEventListener("scroll", handler, { passive: true })
    return () => window.removeEventListener("scroll", handler)
  }, [])
  return scrollY
}

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true) },
      { threshold }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold])
  return { ref, inView }
}

export function LandingClient({ isLoggedIn = false }: { isLoggedIn?: boolean }) {
  const { t } = useLang()
  const [wordIdx, setWordIdx] = useState(0)
  const [visible, setVisible] = useState(true)
  const scrollY = useScrollY()

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

  const howItWorks = useInView()
  const featuresSection = useInView()
  const ctaSection = useInView()

  const features = [
    { icon: "🤖", title: "AI เขียนให้ทั้งหมด", desc: "Gemini AI เขียนเนื้อหาพอร์ตโฟลิโอระดับมืออาชีพ จากข้อมูลที่คุณให้", color: "bg-violet-50 border-violet-100", iconBg: "bg-violet-100 text-violet-600" },
    { icon: "📄", title: "สูงสุด 20 หน้า", desc: "กำหนดเองว่าจะมีกี่หน้า แต่ละหน้ามีเนื้อหาอะไร ยืดหยุ่นสุดๆ", color: "bg-blue-50 border-blue-100", iconBg: "bg-blue-100 text-blue-600" },
    { icon: "🇹🇭", title: "ภาษาไทย & อังกฤษ", desc: "สลับภาษาได้ทันที เหมาะทั้งพอร์ตไทยและส่ง AdCom ต่างประเทศ", color: "bg-green-50 border-green-100", iconBg: "bg-green-100 text-green-600" },
    { icon: "📥", title: "ดาวน์โหลด PDF", desc: "Export เป็น PDF คุณภาพสูงได้ทุกเมื่อ พร้อมส่งอาจารย์หรือสมัครงาน", color: "bg-orange-50 border-orange-100", iconBg: "bg-orange-100 text-orange-600" },
    { icon: "🎨", title: "ธีมสวยพร้อมใช้", desc: "เลือกธีมหลายแบบ ปรับสีสันให้เข้ากับตัวตนของคุณ", color: "bg-pink-50 border-pink-100", iconBg: "bg-pink-100 text-pink-600" },
    { icon: "🔗", title: "ลิงก์ส่วนตัว", desc: "ได้ URL พอร์ตโฟลิโอส่วนตัว folioforge.dev/username แชร์ได้เลย", color: "bg-indigo-50 border-indigo-100", iconBg: "bg-indigo-100 text-indigo-600" },
  ]

  return (
    <>
      <style>{`
        @keyframes aurora-1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(60px, -40px) scale(1.1); }
          66% { transform: translate(-30px, 20px) scale(0.95); }
        }
        @keyframes aurora-2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(-50px, 30px) scale(1.05); }
          66% { transform: translate(40px, -20px) scale(1.1); }
        }
        @keyframes aurora-3 {
          0%, 100% { transform: translate(0, 0) scale(1.05); }
          50% { transform: translate(30px, 40px) scale(0.95); }
        }
        @keyframes float-1 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-22px) rotate(6deg); }
        }
        @keyframes float-2 {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-16px) rotate(-4deg); }
        }
        @keyframes pulse-ring {
          0% { transform: scale(1); opacity: 0.4; }
          100% { transform: scale(1.6); opacity: 0; }
        }
        .fade-up {
          opacity: 0;
          transform: translateY(36px);
          transition: opacity 0.75s cubic-bezier(0.22,1,0.36,1), transform 0.75s cubic-bezier(0.22,1,0.36,1);
        }
        .fade-up.in-view {
          opacity: 1;
          transform: translateY(0);
        }
        .delay-1 { transition-delay: 0.08s; }
        .delay-2 { transition-delay: 0.18s; }
        .delay-3 { transition-delay: 0.30s; }
        .delay-4 { transition-delay: 0.44s; }
        .delay-5 { transition-delay: 0.58s; }
        .delay-6 { transition-delay: 0.72s; }
      `}</style>

      <IntroAnimation />
      <main className="min-h-screen bg-white text-gray-900 flex flex-col relative overflow-x-hidden">

        {/* ─── NAV ─── */}
        <nav className="sticky top-0 z-50 flex items-center justify-between px-8 py-4 border-b border-gray-100 bg-white/80 backdrop-blur-md">
          <span className="text-xl font-extrabold tracking-tight text-gray-900">FolioForge</span>
          <div className="flex items-center gap-4">
            <LanguageToggle />
            {isLoggedIn ? (
              <Link href="/dashboard" className="text-sm bg-gray-900 text-white px-5 py-2.5 font-semibold hover:bg-black transition-colors rounded-lg shadow-sm">
                ไปยัง Dashboard →
              </Link>
            ) : (
              <>
                <Link href="/login" className="text-sm text-gray-500 hover:text-gray-900 transition-colors font-medium">
                  {t("landing.login")}
                </Link>
                <Link href="/register" className="text-sm bg-indigo-600 text-white px-5 py-2.5 font-semibold hover:bg-indigo-700 transition-colors rounded-lg shadow-sm">
                  {t("landing.cta")}
                </Link>
              </>
            )}
          </div>
        </nav>

        {/* ─── HERO ─── */}
        <section className="relative overflow-hidden min-h-[92vh] flex items-center">
          {/* Animated aurora blobs */}
          <div className="absolute inset-0 pointer-events-none z-0">
            <div
              className="absolute top-[-25%] left-[-12%] w-[700px] h-[700px] rounded-full bg-indigo-200/35 blur-[120px]"
              style={{ animation: "aurora-1 14s ease-in-out infinite" }}
            />
            <div
              className="absolute bottom-[-15%] right-[-12%] w-[600px] h-[600px] rounded-full bg-violet-200/35 blur-[110px]"
              style={{ animation: "aurora-2 18s ease-in-out infinite" }}
            />
            <div
              className="absolute top-[30%] right-[25%] w-[350px] h-[350px] rounded-full bg-pink-100/30 blur-[90px]"
              style={{ animation: "aurora-3 11s ease-in-out infinite" }}
            />
          </div>

          {/* Particles */}
          <div className="absolute inset-0 z-0">
            <ParticleBackground dark={false} />
          </div>

          {/* Floating parallax orbs */}
          <div
            className="absolute top-[12%] right-[7%] w-24 h-24 rounded-3xl bg-gradient-to-br from-indigo-400 to-violet-500 opacity-15 blur-md"
            style={{ transform: `translateY(${scrollY * 0.18}px)`, animation: "float-1 7s ease-in-out infinite" }}
          />
          <div
            className="absolute top-[60%] left-[4%] w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-400 to-rose-500 opacity-20 blur-sm"
            style={{ transform: `translateY(${scrollY * -0.12}px)`, animation: "float-2 9s ease-in-out infinite" }}
          />
          <div
            className="absolute bottom-[18%] right-[14%] w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 opacity-25 blur-sm"
            style={{ transform: `translateY(${scrollY * 0.09}px)`, animation: "float-1 8s ease-in-out infinite 1.5s" }}
          />
          <div
            className="absolute top-[40%] left-[12%] w-6 h-6 rounded-lg bg-gradient-to-br from-emerald-400 to-teal-500 opacity-30"
            style={{ transform: `translateY(${scrollY * -0.07}px)`, animation: "float-2 6s ease-in-out infinite 0.5s" }}
          />

          <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 py-36 max-w-5xl mx-auto w-full">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 text-xs font-bold tracking-widest rounded-full mb-8 border border-indigo-100 uppercase">
              ✨ AI-Powered · ฟรี 100%
            </div>

            {/* Headline */}
            <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight leading-[1.05] mb-6 text-gray-900">
              สร้าง{" "}
              <span
                className="bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 bg-clip-text text-transparent"
                style={{ opacity: visible ? 1 : 0, transition: "opacity 0.3s ease" }}
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
                className="group inline-flex items-center gap-2 bg-gray-900 text-white px-8 py-4 font-bold text-sm hover:bg-black transition-all rounded-xl shadow-lg shadow-gray-900/15 hover:shadow-xl hover:shadow-gray-900/25 hover:-translate-y-0.5"
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
            <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6 text-sm text-gray-400">
              <span className="flex items-center gap-1.5"><span className="text-green-500">✓</span> ไม่ต้องใช้บัตรเครดิต</span>
              <span className="hidden sm:block text-gray-200">|</span>
              <span className="flex items-center gap-1.5"><span className="text-green-500">✓</span> ใช้งานได้ทันที</span>
              <span className="hidden sm:block text-gray-200">|</span>
              <span className="flex items-center gap-1.5"><span className="text-green-500">✓</span> ฟรีตลอด</span>
            </div>
          </div>

          {/* Scroll indicator */}
          <div
            className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-gray-300 transition-opacity duration-300"
            style={{ opacity: Math.max(0, 1 - scrollY / 120) }}
          >
            <span className="text-[10px] tracking-[0.2em] uppercase font-semibold">เลื่อนลง</span>
            <div className="w-px h-10 bg-gradient-to-b from-gray-300 to-transparent" />
          </div>
        </section>

        {/* ─── HOW IT WORKS ─── */}
        <section className="relative py-32 px-6 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div
              className="absolute -top-40 -left-40 w-[550px] h-[550px] rounded-full bg-indigo-100/50 blur-[130px]"
              style={{ animation: "aurora-2 20s ease-in-out infinite", transform: `translateY(${scrollY * 0.04}px)` }}
            />
            <div
              className="absolute -bottom-40 -right-40 w-[450px] h-[450px] rounded-full bg-violet-100/50 blur-[110px]"
              style={{ animation: "aurora-1 16s ease-in-out infinite", transform: `translateY(${scrollY * -0.03}px)` }}
            />
          </div>

          <div ref={howItWorks.ref} className="relative max-w-5xl mx-auto">
            <div className={`text-center mb-20 fade-up ${howItWorks.inView ? "in-view" : ""}`}>
              <span className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-600 text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full border border-indigo-100 mb-5">
                ✦ วิธีการทำงาน
              </span>
              <h2 className="text-3xl sm:text-5xl font-extrabold text-gray-900 leading-tight">
                พอร์ตโฟลิโอพร้อมใน
                <br className="hidden sm:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600"> 3 ขั้นตอน</span>
              </h2>
              <p className="text-gray-400 mt-4 text-base max-w-sm mx-auto">ง่ายกว่าที่คิด เร็วกว่าที่คาด</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 relative">
              <div className="hidden sm:block absolute top-10 left-1/3 right-1/3 h-px border-t-2 border-dashed border-indigo-200 z-0" />
              {[
                {
                  step: "01", icon: "✍️",
                  title: "บอกข้อมูลตัวเอง",
                  desc: "กรอกชื่อ โรงเรียน และแนะนำตัวสั้นๆ ใช้เวลาแค่ 2 นาที",
                  color: "from-orange-50 to-amber-50", border: "border-orange-100",
                  badge: "bg-orange-100 text-orange-600", delay: "delay-1",
                },
                {
                  step: "02", icon: "✦",
                  title: "AI สร้างให้อัตโนมัติ",
                  desc: "AI เขียนเนื้อหาและจัดโครงสร้างพอร์ตโฟลิโอระดับมืออาชีพให้ทันที",
                  color: "from-indigo-50 to-violet-50", border: "border-indigo-100",
                  badge: "bg-indigo-100 text-indigo-600", delay: "delay-2",
                },
                {
                  step: "03", icon: "🌐",
                  title: "แชร์ให้โลกรู้จัก",
                  desc: "รับลิงก์พอร์ตโฟลิโอส่วนตัวพร้อมดาวน์โหลด PDF ได้เลย",
                  color: "from-emerald-50 to-teal-50", border: "border-emerald-100",
                  badge: "bg-emerald-100 text-emerald-600", delay: "delay-3",
                },
              ].map((s, i) => (
                <div
                  key={i}
                  className={`relative z-10 rounded-3xl border ${s.border} bg-gradient-to-br ${s.color} p-8 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 fade-up ${s.delay} ${howItWorks.inView ? "in-view" : ""}`}
                >
                  <div className="flex items-start justify-between mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center text-2xl">
                      {s.icon}
                    </div>
                    <span className={`text-xs font-black tracking-widest px-2.5 py-1 rounded-full ${s.badge}`}>{s.step}</span>
                  </div>
                  <h3 className="text-lg font-extrabold text-gray-900 mb-2">{s.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>

            <div className={`text-center mt-14 fade-up delay-4 ${howItWorks.inView ? "in-view" : ""}`}>
              <Link
                href="/register"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-8 py-4 font-bold text-sm hover:opacity-90 hover:-translate-y-0.5 transition-all rounded-2xl shadow-lg shadow-indigo-500/25"
              >
                เริ่มต้นฟรี — ใช้เวลาแค่ 2 นาที →
              </Link>
            </div>
          </div>
        </section>

        {/* ─── FEATURES ─── */}
        <section className="relative py-28 px-6 overflow-hidden">
          <div className="absolute inset-0 bg-gray-50/60 pointer-events-none" />
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div
              className="absolute -top-20 -right-20 w-[500px] h-[500px] rounded-full bg-pink-100/40 blur-[110px]"
              style={{ transform: `translateY(${(scrollY - 800) * 0.06}px)` }}
            />
            <div
              className="absolute -bottom-20 -left-20 w-[400px] h-[400px] rounded-full bg-blue-100/40 blur-[90px]"
              style={{ transform: `translateY(${(scrollY - 800) * -0.05}px)` }}
            />
          </div>

          <div ref={featuresSection.ref} className="max-w-5xl mx-auto relative">
            <div className={`text-center mb-16 fade-up ${featuresSection.inView ? "in-view" : ""}`}>
              <p className="text-indigo-600 text-xs font-bold tracking-widest uppercase mb-3">ฟีเจอร์</p>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
                ทุกอย่างที่นักเรียนต้องการ
              </h2>
              <p className="text-gray-500 mt-3 max-w-lg mx-auto">
                ครบจบในที่เดียว ตั้งแต่สร้างเนื้อหาจนถึงแชร์ให้คนอื่นดู
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {features.map((f, i) => {
                const delays = ["delay-1", "delay-2", "delay-3", "delay-4", "delay-5", "delay-6"]
                return (
                  <div
                    key={f.title}
                    className={`rounded-2xl border p-6 ${f.color} hover:shadow-lg hover:-translate-y-1.5 transition-all duration-300 fade-up ${delays[i] ?? ""} ${featuresSection.inView ? "in-view" : ""}`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg mb-4 ${f.iconBg}`}>{f.icon}</div>
                    <h3 className="text-sm font-bold text-gray-900 mb-1.5">{f.title}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* ─── FINAL CTA ─── */}
        <section className="relative py-28 px-6 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-violet-50" />
            <div
              className="absolute top-0 left-1/4 w-[600px] h-[400px] rounded-full bg-indigo-200/25 blur-[120px]"
              style={{ animation: "aurora-3 13s ease-in-out infinite", transform: `translateY(${(scrollY - 1600) * 0.04}px)` }}
            />
            <div
              className="absolute bottom-0 right-1/4 w-[400px] h-[300px] rounded-full bg-violet-200/25 blur-[100px]"
              style={{ animation: "aurora-1 17s ease-in-out infinite", transform: `translateY(${(scrollY - 1600) * -0.03}px)` }}
            />
          </div>

          <div ref={ctaSection.ref} className="max-w-2xl mx-auto text-center relative">
            <div className={`fade-up ${ctaSection.inView ? "in-view" : ""}`}>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-50 text-indigo-600 text-xs font-bold tracking-widest rounded-full border border-indigo-100 mb-6 uppercase">
                🚀 เริ่มต้นวันนี้
              </div>
              <h2 className="text-3xl sm:text-5xl font-extrabold text-gray-900 leading-tight mb-5">
                พร้อมสร้างพอร์ตโฟลิโอ
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">แล้วหรือยัง?</span>
              </h2>
              <p className="text-gray-500 mb-10 text-base leading-relaxed max-w-sm mx-auto">
                เริ่มต้นได้ภายใน 2 นาที ไม่ต้องมีความรู้ด้านออกแบบ AI ทำให้ทุกอย่าง
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href="/register"
                  className="group inline-flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-9 py-4 font-bold text-sm hover:opacity-90 hover:-translate-y-0.5 transition-all rounded-2xl shadow-xl shadow-indigo-500/30"
                >
                  <span>Get Started ฟรี</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </Link>
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center gap-2 border border-gray-200 text-gray-600 px-9 py-4 font-medium text-sm hover:bg-gray-50 transition-all rounded-2xl"
                >
                  {t("landing.login")}
                </Link>
              </div>
              <p className="text-gray-400 text-xs mt-5">ไม่ต้องใช้บัตรเครดิต · ยกเลิกเมื่อไหร่ก็ได้</p>
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
