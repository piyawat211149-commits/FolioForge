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
    const h = () => setScrollY(window.scrollY)
    window.addEventListener("scroll", h, { passive: true })
    return () => window.removeEventListener("scroll", h)
  }, [])
  return scrollY
}

function useInView(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setInView(true) },
      { threshold }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])
  return { ref, inView }
}

export function LandingClient({ isLoggedIn = false }: { isLoggedIn?: boolean }) {
  const { t } = useLang()
  const [wordIdx, setWordIdx] = useState(0)
  const [visible, setVisible] = useState(true)
  const [dark, setDark] = useState(false)
  const scrollY = useScrollY()

  useEffect(() => {
    const saved = localStorage.getItem("ff-theme")
    if (saved === "dark") setDark(true)
  }, [])

  function toggleDark() {
    setDark(d => {
      localStorage.setItem("ff-theme", !d ? "dark" : "light")
      return !d
    })
  }

  useEffect(() => {
    const id = setInterval(() => {
      setVisible(false)
      setTimeout(() => {
        setWordIdx(i => (i + 1) % DEMO_WORDS.length)
        setVisible(true)
      }, 300)
    }, 2200)
    return () => clearInterval(id)
  }, [])

  const howItWorks = useInView()
  const feats = useInView()
  const cta = useInView()

  // ── theme tokens ──────────────────────────────────────
  const bg = dark ? "bg-[#07070f]" : "bg-white"
  const text = dark ? "text-gray-100" : "text-gray-900"
  const sub = dark ? "text-gray-400" : "text-gray-500"
  const navBg = dark ? "bg-[#07070f]/85 border-white/8" : "bg-white/85 border-gray-100"
  const cardBg = dark ? "bg-white/5 border-white/8" : "bg-white border-gray-100"
  const mutedText = dark ? "text-gray-500" : "text-gray-400"

  const features = [
    { icon: "🤖", title: "AI เขียนให้ทั้งหมด", desc: "Gemini AI เขียนเนื้อหาพอร์ตโฟลิโอระดับมืออาชีพจากข้อมูลที่คุณให้", light: "bg-violet-50 border-violet-100", dark_: "bg-violet-500/8 border-violet-500/15", iLight: "bg-violet-100 text-violet-600", iDark: "bg-violet-500/15 text-violet-400" },
    { icon: "📄", title: "สูงสุด 20 หน้า", desc: "กำหนดเองว่าจะมีกี่หน้า แต่ละหน้ามีเนื้อหาอะไร ยืดหยุ่นสุดๆ", light: "bg-blue-50 border-blue-100", dark_: "bg-blue-500/8 border-blue-500/15", iLight: "bg-blue-100 text-blue-600", iDark: "bg-blue-500/15 text-blue-400" },
    { icon: "🇹🇭", title: "ภาษาไทย & อังกฤษ", desc: "สลับภาษาได้ทันที เหมาะทั้งพอร์ตไทยและส่ง AdCom ต่างประเทศ", light: "bg-green-50 border-green-100", dark_: "bg-green-500/8 border-green-500/15", iLight: "bg-green-100 text-green-600", iDark: "bg-green-500/15 text-green-400" },
    { icon: "📥", title: "ดาวน์โหลด PDF", desc: "Export เป็น PDF คุณภาพสูงได้ทุกเมื่อ พร้อมส่งอาจารย์หรือสมัครงาน", light: "bg-orange-50 border-orange-100", dark_: "bg-orange-500/8 border-orange-500/15", iLight: "bg-orange-100 text-orange-600", iDark: "bg-orange-500/15 text-orange-400" },
    { icon: "🎨", title: "ธีมสวยพร้อมใช้", desc: "เลือกธีมหลายแบบ ปรับสีสันให้เข้ากับตัวตนของคุณ", light: "bg-pink-50 border-pink-100", dark_: "bg-pink-500/8 border-pink-500/15", iLight: "bg-pink-100 text-pink-600", iDark: "bg-pink-500/15 text-pink-400" },
    { icon: "🔗", title: "ลิงก์ส่วนตัว", desc: "ได้ URL พอร์ตโฟลิโอส่วนตัว folioforge.dev/username แชร์ได้เลย", light: "bg-indigo-50 border-indigo-100", dark_: "bg-indigo-500/8 border-indigo-500/15", iLight: "bg-indigo-100 text-indigo-600", iDark: "bg-indigo-500/15 text-indigo-400" },
  ]

  return (
    <>
      <style>{`
        @keyframes aurora-1 {
          0%,100%{transform:translate(0,0) scale(1)}
          33%{transform:translate(60px,-40px) scale(1.1)}
          66%{transform:translate(-30px,20px) scale(0.95)}
        }
        @keyframes aurora-2 {
          0%,100%{transform:translate(0,0) scale(1)}
          33%{transform:translate(-50px,30px) scale(1.05)}
          66%{transform:translate(40px,-20px) scale(1.1)}
        }
        @keyframes aurora-3 {
          0%,100%{transform:translate(0,0) scale(1.05)}
          50%{transform:translate(30px,40px) scale(0.95)}
        }
        @keyframes float-a {
          0%,100%{transform:translateY(0) rotate(0deg)}
          50%{transform:translateY(-20px) rotate(5deg)}
        }
        @keyframes float-b {
          0%,100%{transform:translateY(0) rotate(0deg)}
          50%{transform:translateY(-14px) rotate(-4deg)}
        }
        .fade-up{opacity:0;transform:translateY(32px);transition:opacity .75s cubic-bezier(.22,1,.36,1),transform .75s cubic-bezier(.22,1,.36,1)}
        .fade-up.in{opacity:1;transform:translateY(0)}
        .d1{transition-delay:.08s}.d2{transition-delay:.18s}.d3{transition-delay:.30s}
        .d4{transition-delay:.44s}.d5{transition-delay:.58s}.d6{transition-delay:.72s}
      `}</style>

      <IntroAnimation />

      {/* ── Single page wrapper — one background, no section breaks ── */}
      <div className={`${bg} ${text} min-h-screen transition-colors duration-500`}>

        {/* ══ Global ambient layer — spans entire page ══ */}
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          {dark ? (
            <>
              <div className="absolute top-[-20%] left-[-10%] w-[700px] h-[700px] rounded-full bg-indigo-500/12 blur-[140px]" style={{animation:"aurora-1 16s ease-in-out infinite"}} />
              <div className="absolute top-[35%] right-[-15%] w-[600px] h-[600px] rounded-full bg-violet-500/10 blur-[130px]" style={{animation:"aurora-2 20s ease-in-out infinite"}} />
              <div className="absolute bottom-[-10%] left-[15%] w-[500px] h-[500px] rounded-full bg-indigo-600/8 blur-[120px]" style={{animation:"aurora-3 14s ease-in-out infinite"}} />
              <div className="absolute top-[65%] right-[30%] w-[300px] h-[300px] rounded-full bg-purple-500/8 blur-[90px]" style={{animation:"aurora-1 18s ease-in-out infinite 3s"}} />
            </>
          ) : (
            <>
              <div className="absolute top-[-20%] left-[-10%] w-[700px] h-[700px] rounded-full bg-indigo-200/40 blur-[130px]" style={{animation:"aurora-1 16s ease-in-out infinite"}} />
              <div className="absolute top-[35%] right-[-15%] w-[600px] h-[600px] rounded-full bg-violet-200/35 blur-[120px]" style={{animation:"aurora-2 20s ease-in-out infinite"}} />
              <div className="absolute bottom-[-10%] left-[15%] w-[500px] h-[500px] rounded-full bg-indigo-100/40 blur-[110px]" style={{animation:"aurora-3 14s ease-in-out infinite"}} />
              <div className="absolute top-[65%] right-[30%] w-[300px] h-[300px] rounded-full bg-pink-100/35 blur-[90px]" style={{animation:"aurora-1 18s ease-in-out infinite 3s"}} />
            </>
          )}
        </div>

        {/* ─── NAV ─── */}
        <nav className={`sticky top-0 z-50 flex items-center justify-between px-8 py-4 border-b backdrop-blur-md transition-colors duration-500 ${navBg}`}>
          <span className={`text-xl font-extrabold tracking-tight ${text}`}>FolioForge</span>
          <div className="flex items-center gap-3">
            <LanguageToggle />

            {/* Dark / light toggle */}
            <button
              onClick={toggleDark}
              aria-label="Toggle theme"
              className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 ${dark ? "bg-white/8 hover:bg-white/12 text-gray-300" : "bg-gray-100 hover:bg-gray-200 text-gray-500"}`}
            >
              {dark ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 18a6 6 0 1 1 0-12 6 6 0 0 1 0 12zm0-2a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM11 1h2v3h-2V1zm0 19h2v3h-2v-3zM3.515 4.929l1.414-1.414L7.05 5.636 5.636 7.05 3.515 4.93zM16.95 18.364l1.414-1.414 2.121 2.121-1.414 1.414-2.121-2.121zm2.121-14.85l1.414 1.415-2.121 2.121-1.414-1.414 2.121-2.121zM5.636 16.95l1.414 1.414-2.121 2.121-1.414-1.414 2.121-2.121zM23 11v2h-3v-2h3zM1 11h3v2H1v-2z"/></svg>
              ) : (
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3a9 9 0 1 0 9 9c0-.46-.04-.92-.1-1.36a5.389 5.389 0 0 1-4.4 2.26 5.403 5.403 0 0 1-3.14-9.8c-.44-.06-.9-.1-1.36-.1z"/></svg>
              )}
            </button>

            {isLoggedIn ? (
              <Link href="/dashboard" className={`text-sm px-5 py-2.5 font-semibold rounded-lg shadow-sm transition-colors ${dark ? "bg-white text-gray-900 hover:bg-gray-100" : "bg-gray-900 text-white hover:bg-black"}`}>
                ไปยัง Dashboard →
              </Link>
            ) : (
              <>
                <Link href="/login" className={`text-sm font-medium transition-colors ${dark ? "text-gray-400 hover:text-gray-100" : "text-gray-500 hover:text-gray-900"}`}>
                  {t("landing.login")}
                </Link>
                <Link href="/register" className="text-sm bg-indigo-600 text-white px-5 py-2.5 font-semibold hover:bg-indigo-500 transition-colors rounded-lg shadow-sm">
                  {t("landing.cta")}
                </Link>
              </>
            )}
          </div>
        </nav>

        {/* ─── HERO ─── */}
        <section className="relative z-10 min-h-[92vh] flex items-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <ParticleBackground dark={dark} />
          </div>

          {/* Parallax floating shapes */}
          <div className="absolute top-[10%] right-[6%] w-20 h-20 rounded-3xl opacity-20 blur-sm"
            style={{background:"linear-gradient(135deg,#6366f1,#8b5cf6)",transform:`translateY(${scrollY*.16}px)`,animation:"float-a 7s ease-in-out infinite"}} />
          <div className="absolute top-[58%] left-[4%] w-12 h-12 rounded-2xl opacity-25 blur-sm"
            style={{background:"linear-gradient(135deg,#ec4899,#f43f5e)",transform:`translateY(${scrollY*-.11}px)`,animation:"float-b 9s ease-in-out infinite"}} />
          <div className="absolute bottom-[22%] right-[13%] w-8 h-8 rounded-xl opacity-30"
            style={{background:"linear-gradient(135deg,#f59e0b,#f97316)",transform:`translateY(${scrollY*.08}px)`,animation:"float-a 8s ease-in-out infinite 1.5s"}} />
          <div className="absolute top-[42%] left-[10%] w-5 h-5 rounded-lg opacity-40"
            style={{background:"linear-gradient(135deg,#10b981,#14b8a6)",transform:`translateY(${scrollY*-.06}px)`,animation:"float-b 6s ease-in-out infinite .5s"}} />

          <div className="relative z-10 flex flex-col items-center text-center px-6 py-36 max-w-5xl mx-auto w-full">
            <div className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-bold tracking-widest rounded-full mb-8 border uppercase ${dark ? "bg-indigo-500/10 text-indigo-400 border-indigo-500/20" : "bg-indigo-50 text-indigo-600 border-indigo-100"}`}>
              ✨ AI-Powered · ฟรี 100%
            </div>

            <h1 className={`text-5xl sm:text-7xl font-extrabold tracking-tight leading-[1.05] mb-6 ${text}`}>
              สร้าง{" "}
              <span
                className="bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500 bg-clip-text text-transparent"
                style={{opacity: visible ? 1 : 0, transition:"opacity .3s ease"}}
              >
                {DEMO_WORDS[wordIdx]}
              </span>
              <br />ที่โดดเด่นด้วย AI
            </h1>

            <p className={`text-lg max-w-xl leading-relaxed mb-10 ${sub}`}>
              แค่บอกข้อมูลตัวเอง AI จะเขียน จัดหน้า และออกแบบพอร์ตโฟลิโอระดับมืออาชีพให้ทันที ไม่ต้องเขียนเองแม้แต่บรรทัดเดียว
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mb-16">
              <Link href="/register"
                className={`group inline-flex items-center gap-2 px-8 py-4 font-bold text-sm rounded-xl shadow-lg hover:-translate-y-0.5 transition-all ${dark ? "bg-white text-gray-900 hover:bg-gray-100 shadow-white/10" : "bg-gray-900 text-white hover:bg-black shadow-gray-900/15 hover:shadow-gray-900/25"}`}>
                <span>เริ่มสร้างพอร์ตโฟลิโอ</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </Link>
              <Link href="/login"
                className={`inline-flex items-center gap-2 border px-8 py-4 font-medium text-sm hover:-translate-y-0.5 transition-all rounded-xl ${dark ? "border-white/10 text-gray-400 hover:bg-white/5" : "border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300"}`}>
                {t("landing.login")}
              </Link>
            </div>

            <div className={`flex flex-wrap justify-center items-center gap-4 sm:gap-6 text-sm ${mutedText}`}>
              <span className="flex items-center gap-1.5"><span className="text-green-500">✓</span> ไม่ต้องใช้บัตรเครดิต</span>
              <span className={`hidden sm:block ${dark ? "text-white/10" : "text-gray-200"}`}>|</span>
              <span className="flex items-center gap-1.5"><span className="text-green-500">✓</span> ใช้งานได้ทันที</span>
              <span className={`hidden sm:block ${dark ? "text-white/10" : "text-gray-200"}`}>|</span>
              <span className="flex items-center gap-1.5"><span className="text-green-500">✓</span> ฟรีตลอด</span>
            </div>
          </div>

          <div className={`absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 transition-opacity duration-300 ${mutedText}`}
            style={{opacity: Math.max(0, 1 - scrollY / 120)}}>
            <span className="text-[10px] tracking-[.2em] uppercase font-semibold">เลื่อนลง</span>
            <div className={`w-px h-10 bg-gradient-to-b ${dark ? "from-white/20" : "from-gray-300"} to-transparent`} />
          </div>
        </section>

        {/* ─── HOW IT WORKS ─── */}
        <section className="relative z-10 py-32 px-6">
          <div ref={howItWorks.ref} className="max-w-5xl mx-auto">
            <div className={`text-center mb-20 fade-up ${howItWorks.inView ? "in" : ""}`}>
              <span className={`inline-flex items-center gap-2 text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full border mb-5 ${dark ? "bg-indigo-500/10 text-indigo-400 border-indigo-500/20" : "bg-indigo-50 text-indigo-600 border-indigo-100"}`}>
                ✦ วิธีการทำงาน
              </span>
              <h2 className={`text-3xl sm:text-5xl font-extrabold leading-tight ${text}`}>
                พอร์ตโฟลิโอพร้อมใน<br className="hidden sm:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-violet-500"> 3 ขั้นตอน</span>
              </h2>
              <p className={`mt-4 text-base max-w-sm mx-auto ${mutedText}`}>ง่ายกว่าที่คิด เร็วกว่าที่คาด</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 relative">
              <div className={`hidden sm:block absolute top-10 left-1/3 right-1/3 h-px border-t-2 border-dashed z-0 ${dark ? "border-indigo-500/20" : "border-indigo-200"}`} />

              {[
                { step:"01", icon:"✍️", title:"บอกข้อมูลตัวเอง", desc:"กรอกชื่อ โรงเรียน และแนะนำตัวสั้นๆ ใช้เวลาแค่ 2 นาที",
                  lightCard:"from-orange-50 to-amber-50 border-orange-100", darkCard:"from-orange-500/8 to-amber-500/8 border-orange-500/15",
                  lightBadge:"bg-orange-100 text-orange-600", darkBadge:"bg-orange-500/15 text-orange-400", delay:"d1" },
                { step:"02", icon:"✦", title:"AI สร้างให้อัตโนมัติ", desc:"AI เขียนเนื้อหาและจัดโครงสร้างพอร์ตโฟลิโอระดับมืออาชีพให้ทันที",
                  lightCard:"from-indigo-50 to-violet-50 border-indigo-100", darkCard:"from-indigo-500/8 to-violet-500/8 border-indigo-500/15",
                  lightBadge:"bg-indigo-100 text-indigo-600", darkBadge:"bg-indigo-500/15 text-indigo-400", delay:"d2" },
                { step:"03", icon:"🌐", title:"แชร์ให้โลกรู้จัก", desc:"รับลิงก์พอร์ตโฟลิโอส่วนตัวพร้อมดาวน์โหลด PDF ได้เลย",
                  lightCard:"from-emerald-50 to-teal-50 border-emerald-100", darkCard:"from-emerald-500/8 to-teal-500/8 border-emerald-500/15",
                  lightBadge:"bg-emerald-100 text-emerald-600", darkBadge:"bg-emerald-500/15 text-emerald-400", delay:"d3" },
              ].map((s, i) => (
                <div key={i}
                  className={`relative z-10 rounded-3xl border bg-gradient-to-br p-8 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 fade-up ${s.delay} ${howItWorks.inView ? "in" : ""} ${dark ? s.darkCard : s.lightCard}`}>
                  <div className="flex items-start justify-between mb-6">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl ${dark ? "bg-white/8" : "bg-white shadow-sm"}`}>
                      {s.icon}
                    </div>
                    <span className={`text-xs font-black tracking-widest px-2.5 py-1 rounded-full ${dark ? s.darkBadge : s.lightBadge}`}>{s.step}</span>
                  </div>
                  <h3 className={`text-lg font-extrabold mb-2 ${text}`}>{s.title}</h3>
                  <p className={`text-sm leading-relaxed ${sub}`}>{s.desc}</p>
                </div>
              ))}
            </div>

            <div className={`text-center mt-14 fade-up d4 ${howItWorks.inView ? "in" : ""}`}>
              <Link href="/register"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-8 py-4 font-bold text-sm hover:opacity-90 hover:-translate-y-0.5 transition-all rounded-2xl shadow-lg shadow-indigo-500/25">
                เริ่มต้นฟรี — ใช้เวลาแค่ 2 นาที →
              </Link>
            </div>
          </div>
        </section>

        {/* subtle divider — gradient line, not a hard edge */}
        <div className={`relative z-10 mx-auto max-w-5xl px-6`}>
          <div className={`h-px w-full bg-gradient-to-r from-transparent ${dark ? "via-white/8" : "via-gray-200"} to-transparent`} />
        </div>

        {/* ─── FEATURES ─── */}
        <section className="relative z-10 py-28 px-6">
          <div ref={feats.ref} className="max-w-5xl mx-auto">
            <div className={`text-center mb-16 fade-up ${feats.inView ? "in" : ""}`}>
              <p className="text-indigo-500 text-xs font-bold tracking-widest uppercase mb-3">ฟีเจอร์</p>
              <h2 className={`text-3xl sm:text-4xl font-extrabold ${text}`}>ทุกอย่างที่นักเรียนต้องการ</h2>
              <p className={`mt-3 max-w-lg mx-auto ${sub}`}>ครบจบในที่เดียว ตั้งแต่สร้างเนื้อหาจนถึงแชร์ให้คนอื่นดู</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {features.map((f, i) => {
                const delays = ["d1","d2","d3","d4","d5","d6"]
                return (
                  <div key={f.title}
                    className={`rounded-2xl border p-6 hover:shadow-lg hover:-translate-y-1.5 transition-all duration-300 fade-up ${delays[i]??""} ${feats.inView ? "in" : ""} ${dark ? f.dark_ : f.light}`}>
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg mb-4 ${dark ? f.iDark : f.iLight}`}>{f.icon}</div>
                    <h3 className={`text-sm font-bold mb-1.5 ${text}`}>{f.title}</h3>
                    <p className={`text-sm leading-relaxed ${sub}`}>{f.desc}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* subtle divider */}
        <div className="relative z-10 mx-auto max-w-5xl px-6">
          <div className={`h-px w-full bg-gradient-to-r from-transparent ${dark ? "via-white/8" : "via-gray-200"} to-transparent`} />
        </div>

        {/* ─── FINAL CTA ─── */}
        <section className="relative z-10 py-28 px-6">
          <div ref={cta.ref} className="max-w-2xl mx-auto text-center">
            <div className={`fade-up ${cta.inView ? "in" : ""}`}>
              <div className={`inline-flex items-center gap-2 px-4 py-1.5 text-xs font-bold tracking-widest rounded-full border mb-6 uppercase ${dark ? "bg-indigo-500/10 text-indigo-400 border-indigo-500/20" : "bg-indigo-50 text-indigo-600 border-indigo-100"}`}>
                🚀 เริ่มต้นวันนี้
              </div>
              <h2 className={`text-3xl sm:text-5xl font-extrabold leading-tight mb-5 ${text}`}>
                พร้อมสร้างพอร์ตโฟลิโอ<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-violet-500">แล้วหรือยัง?</span>
              </h2>
              <p className={`mb-10 text-base leading-relaxed max-w-sm mx-auto ${sub}`}>
                เริ่มต้นได้ภายใน 2 นาที ไม่ต้องมีความรู้ด้านออกแบบ AI ทำให้ทุกอย่าง
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/register"
                  className="group inline-flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-9 py-4 font-bold text-sm hover:opacity-90 hover:-translate-y-0.5 transition-all rounded-2xl shadow-xl shadow-indigo-500/30">
                  <span>Get Started ฟรี</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </Link>
                <Link href="/login"
                  className={`inline-flex items-center justify-center gap-2 border px-9 py-4 font-medium text-sm transition-all rounded-2xl ${dark ? "border-white/10 text-gray-400 hover:bg-white/5" : "border-gray-200 text-gray-600 hover:bg-gray-50"}`}>
                  {t("landing.login")}
                </Link>
              </div>
              <p className={`text-xs mt-5 ${mutedText}`}>ไม่ต้องใช้บัตรเครดิต · ยกเลิกเมื่อไหร่ก็ได้</p>
            </div>
          </div>
        </section>

        {/* ─── FOOTER ─── */}
        <footer className={`relative z-10 border-t py-8 px-8 transition-colors duration-500 ${dark ? "border-white/8" : "border-gray-100"}`}>
          <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className={`text-sm font-bold ${text}`}>FolioForge</span>
            <p className={`text-xs ${mutedText}`}>© 2026 FolioForge · สร้างพอร์ตโฟลิโอที่โดดเด่นด้วย AI</p>
            <div className={`flex gap-4 text-xs ${mutedText}`}>
              <Link href="/login" className={`transition-colors ${dark ? "hover:text-gray-200" : "hover:text-gray-700"}`}>เข้าสู่ระบบ</Link>
              <Link href="/register" className={`transition-colors ${dark ? "hover:text-gray-200" : "hover:text-gray-700"}`}>สมัครใช้งาน</Link>
            </div>
          </div>
        </footer>

      </div>
    </>
  )
}
