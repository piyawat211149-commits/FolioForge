"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useLang } from "@/components/language-provider"
import { useTheme } from "@/components/theme-provider"

interface PageDef { name: string; notes: string }
interface BasicInfo { name: string; school: string; grade: string; bio: string; lang: "th" | "en" }

const MAX_PAGES = 20

const GEN_MESSAGES = [
  "กำลังวิเคราะห์ข้อมูลของคุณ...",
  "AI กำลังเขียนเนื้อหา...",
  "จัดโครงสร้างหน้าพอร์ตโฟลิโอ...",
  "ออกแบบเลย์เอาต์...",
  "ใส่รายละเอียดเพิ่มเติม...",
  "ตรวจสอบความถูกต้อง...",
  "เกือบเสร็จแล้ว...",
]

function GeneratingScreen({ pageCount }: { pageCount: number }) {
  const { dark } = useTheme()
  const [msgIdx, setMsgIdx] = useState(0)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setMsgIdx(i => (i + 1) % GEN_MESSAGES.length), 3000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    const id = setInterval(() => setProgress(p => Math.min(p + Math.random() * 3 + 0.5, 92)), 500)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      <style>{`
        @keyframes orb-float-1 { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(40px,-30px) scale(1.15); } }
        @keyframes orb-float-2 { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(-30px,40px) scale(1.1); } }
        @keyframes orb-float-3 { 0%,100% { transform: translate(0,0) scale(1.05); } 50% { transform: translate(20px,20px) scale(0.95); } }
        @keyframes cube-spin { from { transform: rotateX(0) rotateY(0); } to { transform: rotateX(360deg) rotateY(360deg); } }
        @keyframes glow-ring { 0%,100% { box-shadow: 0 0 30px rgba(99,102,241,0.3), 0 0 60px rgba(139,92,246,0.15); } 50% { box-shadow: 0 0 50px rgba(99,102,241,0.5), 0 0 100px rgba(139,92,246,0.25); } }
        @keyframes glow-ring-dark { 0%,100% { box-shadow: 0 0 40px rgba(99,102,241,0.4), 0 0 80px rgba(139,92,246,0.2), 0 0 120px rgba(168,85,247,0.1); } 50% { box-shadow: 0 0 60px rgba(99,102,241,0.6), 0 0 120px rgba(139,92,246,0.35), 0 0 180px rgba(168,85,247,0.15); } }
        @keyframes msg-fade { 0% { opacity:0; transform:translateY(8px); } 15% { opacity:1; transform:translateY(0); } 85% { opacity:1; transform:translateY(0); } 100% { opacity:0; transform:translateY(-8px); } }
        @keyframes dot-pulse { 0%,80%,100% { transform:scale(0.6); opacity:0.4; } 40% { transform:scale(1); opacity:1; } }
        @keyframes progress-glow { 0%,100% { filter: brightness(1); } 50% { filter: brightness(1.3); } }
        .gen-msg { animation: msg-fade 3s ease-in-out infinite; }
      `}</style>

      {/* Backdrop */}
      <div className={`absolute inset-0 ${dark ? "bg-[#07070f]/95" : "bg-white/90"} backdrop-blur-xl`} />

      {/* Floating orbs */}
      <div className={`absolute top-[20%] left-[15%] w-64 h-64 rounded-full blur-3xl ${dark ? "bg-indigo-500/20" : "bg-indigo-200/40"}`} style={{ animation: "orb-float-1 8s ease-in-out infinite" }} />
      <div className={`absolute bottom-[20%] right-[15%] w-56 h-56 rounded-full blur-3xl ${dark ? "bg-violet-500/20" : "bg-violet-200/40"}`} style={{ animation: "orb-float-2 10s ease-in-out 1s infinite" }} />
      <div className={`absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full blur-3xl ${dark ? "bg-purple-500/10" : "bg-purple-100/30"}`} style={{ animation: "orb-float-3 12s ease-in-out 2s infinite" }} />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-8 px-4">
        {/* Glowing cube */}
        <div className="relative">
          <div
            className={`w-24 h-24 rounded-3xl bg-gradient-to-br from-indigo-500 via-violet-500 to-purple-500 flex items-center justify-center ${dark ? "shadow-[0_0_60px_rgba(99,102,241,0.4),0_0_120px_rgba(139,92,246,0.2)]" : "shadow-[0_0_40px_rgba(99,102,241,0.3),0_0_80px_rgba(139,92,246,0.15)]"}`}
            style={{ animation: `${dark ? "glow-ring-dark" : "glow-ring"} 3s ease-in-out infinite` }}
          >
            <div style={{ animation: "cube-spin 6s linear infinite", transformStyle: "preserve-3d" }}>
              <span className="text-4xl block">✦</span>
            </div>
          </div>
          {/* Orbiting dots */}
          <div className="absolute inset-[-20px]" style={{ animation: "cube-spin 8s linear infinite reverse" }}>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-indigo-400" />
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-violet-400" />
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-purple-400" />
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-pink-400" />
          </div>
        </div>

        {/* Text */}
        <div className="text-center space-y-3">
          <h2 className={`text-2xl font-extrabold ${dark ? "text-white" : "text-gray-900"}`}>
            AI กำลังสร้างพอร์ตโฟลิโอ
          </h2>
          <p className={`text-sm ${dark ? "text-gray-400" : "text-gray-500"}`}>
            กำลังสร้าง {pageCount} หน้า · อาจใช้เวลา 30-60 วินาที
          </p>
        </div>

        {/* Animated message */}
        <div className="h-6 flex items-center">
          <p key={msgIdx} className={`gen-msg text-sm font-medium ${dark ? "text-indigo-300" : "text-indigo-600"}`}>
            {GEN_MESSAGES[msgIdx]}
          </p>
        </div>

        {/* Progress bar */}
        <div className="w-72 space-y-2">
          <div className={`h-2 rounded-full overflow-hidden ${dark ? "bg-white/5" : "bg-gray-100"}`}>
            <div
              className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500 transition-all duration-700 ease-out"
              style={{ width: `${progress}%`, animation: "progress-glow 2s ease-in-out infinite" }}
            />
          </div>
          <p className={`text-xs text-center font-medium ${dark ? "text-gray-500" : "text-gray-400"}`}>
            {Math.round(progress)}%
          </p>
        </div>

        {/* Bouncing dots */}
        <div className="flex gap-2">
          {[0, 1, 2].map(i => (
            <div
              key={i}
              className={`w-2.5 h-2.5 rounded-full ${dark ? "bg-indigo-400" : "bg-indigo-500"}`}
              style={{ animation: `dot-pulse 1.4s ease-in-out ${i * 0.2}s infinite` }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default function AIBuilderPage() {
  const { t } = useLang()
  const { dark } = useTheme()
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [basic, setBasic] = useState<BasicInfo>({ name: "", school: "", grade: "", bio: "", lang: "th" })
  const [pages, setPages] = useState<PageDef[]>([
    { name: "เกี่ยวกับฉัน", notes: "" },
    { name: "ทักษะ", notes: "" },
    { name: "ผลงาน", notes: "" },
    { name: "ติดต่อ", notes: "" },
  ])
  const [generating, setGenerating] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState("")
  const [username, setUsername] = useState("")

  function addPage() {
    if (pages.length >= MAX_PAGES) return
    setPages(p => [...p, { name: "", notes: "" }])
  }
  function removePage(i: number) {
    setPages(p => p.filter((_, idx) => idx !== i))
  }
  function updatePage(i: number, field: keyof PageDef, val: string) {
    setPages(p => p.map((pg, idx) => idx === i ? { ...pg, [field]: val } : pg))
  }

  async function generate() {
    setError("")
    setGenerating(true)
    try {
      const profileRes = await fetch("/api/profile")
      const profile = await profileRes.json()
      setUsername(profile.username)

      const genRes = await fetch("/api/ai-generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ basicInfo: basic, pages, lang: basic.lang }),
      })
      const genData = await genRes.json()
      if (!genRes.ok) { setError(genData.error || "AI generation failed"); setGenerating(false); return }

      await fetch("/api/portfolio-pages", { method: "DELETE" })
      await Promise.all(
        genData.pages.map((pg: { slug: string; title: string; content: object }, idx: number) =>
          fetch("/api/portfolio-pages", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title: pg.title, slug: pg.slug, content: pg.content, pageOrder: idx }),
          })
        )
      )
      setDone(true)
    } catch (e) {
      console.error(e)
      setError("เกิดข้อผิดพลาด กรุณาลองใหม่")
    } finally {
      setGenerating(false)
    }
  }

  const STEPS = [t("ai.step1"), t("ai.step2"), t("ai.step3"), t("ai.step4")]

  const cardCls = `rounded-2xl border p-6 transition-colors duration-300 ${dark ? "bg-white/[0.03] border-white/5" : "bg-white border-gray-100"}`
  const inputCls = `w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${dark ? "border-white/10 bg-white/5 text-white placeholder-gray-600" : "border-gray-200 bg-white text-gray-900 placeholder-gray-300"}`
  const labelCls = `block text-xs font-bold mb-2 uppercase tracking-wide ${dark ? "text-gray-400" : "text-gray-500"}`
  const btnPrimary = "bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white px-8 py-3 rounded-xl text-sm font-bold transition-all disabled:opacity-40 shadow-lg shadow-indigo-500/20 hover:shadow-xl hover:shadow-indigo-500/30 hover:-translate-y-0.5 duration-300"
  const btnBack = `text-sm transition-colors ${dark ? "text-gray-500 hover:text-gray-300" : "text-gray-400 hover:text-gray-700"}`

  if (generating) return <GeneratingScreen pageCount={pages.length} />

  if (done) return (
    <div className="p-8 flex items-center justify-center min-h-[80vh]">
      <style>{`
        @keyframes pop-in { 0% { transform: scale(0) rotate(-20deg); opacity:0; } 60% { transform: scale(1.15) rotate(5deg); } 100% { transform: scale(1) rotate(0); opacity:1; } }
        @keyframes confetti { 0% { transform: translateY(0) rotate(0); opacity:1; } 100% { transform: translateY(-60px) rotate(180deg); opacity:0; } }
        @keyframes fade-up-d { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        .pop-in { animation: pop-in 0.7s cubic-bezier(0.34,1.56,0.64,1) forwards; }
        .fade-d1 { animation: fade-up-d 0.5s ease-out 0.3s forwards; opacity:0; }
        .fade-d2 { animation: fade-up-d 0.5s ease-out 0.5s forwards; opacity:0; }
        .fade-d3 { animation: fade-up-d 0.5s ease-out 0.7s forwards; opacity:0; }
        .confetti { animation: confetti 1.5s ease-out forwards; }
      `}</style>
      <div className="max-w-md w-full text-center">
        <div className="relative mb-8">
          <div className={`w-24 h-24 rounded-3xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-5xl mx-auto pop-in ${dark ? "shadow-[0_0_50px_rgba(99,102,241,0.4)]" : "shadow-2xl shadow-indigo-500/30"}`}>
            🎉
          </div>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 flex gap-8 pointer-events-none select-none">
            <span className="confetti text-xl" style={{ animationDelay: "0.2s" }}>✨</span>
            <span className="confetti text-lg" style={{ animationDelay: "0.4s" }}>⭐</span>
            <span className="confetti text-xl" style={{ animationDelay: "0.6s" }}>🌟</span>
          </div>
        </div>

        <h2 className={`text-3xl font-extrabold mb-3 fade-d1 ${dark ? "text-white" : "text-gray-900"}`}>พอร์ตโฟลิโอพร้อมแล้ว!</h2>
        <p className={`text-sm mb-2 fade-d1 ${dark ? "text-gray-400" : "text-gray-400"}`}>
          AI สร้างเนื้อหาทั้งหมด <span className={`font-bold ${dark ? "text-gray-200" : "text-gray-600"}`}>{pages.length} หน้า</span> ให้คุณแล้ว
        </p>
        <p className={`text-sm mb-10 fade-d1 ${dark ? "text-gray-500" : "text-gray-400"}`}>คุณสามารถกดดูหรือแชร์ได้ทันทีเลย</p>

        <div className={`rounded-2xl p-4 mb-8 text-left fade-d2 ${dark ? "bg-white/[0.03] border border-white/5" : "bg-gray-50"}`}>
          <p className={`text-xs font-bold uppercase tracking-widest mb-3 ${dark ? "text-gray-500" : "text-gray-400"}`}>หน้าที่สร้าง</p>
          <div className="space-y-2">
            {pages.map((pg, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${dark ? "bg-green-500/15" : "bg-green-100"}`}>
                  <span className={`text-[10px] ${dark ? "text-green-400" : "text-green-600"}`}>✓</span>
                </div>
                <span className={`text-sm font-medium ${dark ? "text-gray-300" : "text-gray-700"}`}>{pg.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3 fade-d3">
          <a
            href={`/portfolio/${username}`}
            target="_blank"
            className={`inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl text-sm font-bold transition-all shadow-lg hover:-translate-y-0.5 duration-300 ${
              dark
                ? "bg-gradient-to-r from-indigo-500 to-violet-500 text-white shadow-indigo-500/25 hover:shadow-indigo-500/40"
                : "bg-gray-900 text-white shadow-gray-900/10 hover:bg-black"
            }`}
          >
            ดูพอร์ตโฟลิโอ ↗
          </a>
          <button
            onClick={() => router.push("/dashboard")}
            className={`border px-6 py-3 rounded-xl text-sm font-medium transition-colors ${dark ? "border-white/10 text-gray-400 hover:bg-white/5" : "border-gray-200 text-gray-500 hover:bg-gray-50"}`}
          >
            กลับหน้าหลัก
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="p-6 lg:p-8 max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className={`text-2xl font-extrabold mb-1 ${dark ? "text-white" : "text-gray-900"}`}>{t("ai.title")}</h1>
        <p className={`text-sm ${dark ? "text-gray-500" : "text-gray-400"}`}>{t("ai.sub")}</p>
      </div>

      {/* Step indicator */}
      <div className="mb-10">
        <div className="flex items-center gap-0">
          {STEPS.map((label, i) => (
            <div key={i} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center gap-1.5">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-500 ${
                  step > i + 1 ? "bg-gradient-to-br from-green-400 to-emerald-500 text-white shadow-md shadow-green-500/25" :
                  step === i + 1 ? "bg-gradient-to-br from-indigo-500 to-violet-500 text-white shadow-md shadow-indigo-500/25" :
                  dark ? "bg-white/5 text-gray-600" : "bg-gray-100 text-gray-400"
                }`}>
                  {step > i + 1 ? "✓" : i + 1}
                </div>
                <span className={`text-[10px] font-semibold hidden sm:block text-center leading-tight max-w-[60px] ${
                  step === i + 1 ? (dark ? "text-white" : "text-gray-900") : (dark ? "text-gray-600" : "text-gray-300")
                }`}>
                  {label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`flex-1 h-px mx-2 mb-4 transition-colors duration-500 ${
                  step > i + 1 ? "bg-green-400" : (dark ? "bg-white/5" : "bg-gray-100")
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step 1: Basic Info */}
      {step === 1 && (
        <div className={`${cardCls} space-y-5`}>
          <p className={`text-xs font-bold tracking-widest uppercase ${dark ? "text-gray-500" : "text-gray-400"}`}>ข้อมูลพื้นฐาน</p>
          {[
            { key: "name", label: t("ai.name"), placeholder: "เช่น สมชาย ใจดี" },
            { key: "school", label: t("ai.school"), placeholder: "เช่น โรงเรียนสาธิต มหาวิทยาลัยเกษตรศาสตร์" },
            { key: "grade", label: t("ai.grade"), placeholder: "เช่น ม.6 หรือ ปี 2" },
          ].map(f => (
            <div key={f.key}>
              <label className={labelCls}>{f.label}</label>
              <input
                type="text"
                value={basic[f.key as keyof BasicInfo]}
                onChange={e => setBasic(b => ({ ...b, [f.key]: e.target.value }))}
                placeholder={f.placeholder}
                className={inputCls}
              />
            </div>
          ))}
          <div>
            <label className={labelCls}>{t("ai.bio")}</label>
            <textarea
              value={basic.bio}
              onChange={e => setBasic(b => ({ ...b, bio: e.target.value }))}
              placeholder={t("ai.bioPlaceholder")}
              rows={3}
              className={`${inputCls} resize-none`}
            />
          </div>
          <div>
            <label className={labelCls}>{t("ai.lang")}</label>
            <div className="flex gap-3">
              {(["th", "en"] as const).map(l => (
                <button
                  key={l}
                  type="button"
                  onClick={() => setBasic(b => ({ ...b, lang: l }))}
                  className={`flex-1 py-3 rounded-xl text-sm font-bold border-2 transition-all duration-300 ${
                    basic.lang === l
                      ? "border-indigo-500 bg-indigo-500/10 text-indigo-500 shadow-md shadow-indigo-500/10"
                      : dark ? "border-white/5 text-gray-500 hover:border-white/10" : "border-gray-100 text-gray-400 hover:border-gray-200"
                  }`}
                >
                  {l === "th" ? "🇹🇭 ภาษาไทย" : "🇬🇧 English"}
                </button>
              ))}
            </div>
          </div>
          <div className="flex justify-end pt-2">
            <button onClick={() => setStep(2)} disabled={!basic.name.trim()} className={btnPrimary}>
              {t("ai.next")} →
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Define pages */}
      {step === 2 && (
        <div className="space-y-4">
          <div className={`text-xs rounded-xl px-4 py-2.5 ${dark ? "text-indigo-300 bg-indigo-500/10 border border-indigo-500/15" : "text-gray-400 bg-indigo-50 border border-indigo-100"}`}>
            💡 {t("ai.pageLimit")}
          </div>
          {pages.map((pg, i) => (
            <div key={i} className={`flex items-center gap-3 rounded-xl border p-3.5 transition-all duration-300 group hover:-translate-y-0.5 hover:shadow-md ${
              dark ? "bg-white/[0.03] border-white/5 hover:border-white/10 hover:shadow-indigo-500/5" : "bg-white border-gray-100 shadow-sm hover:border-gray-200"
            }`}>
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 ${dark ? "bg-indigo-500/15 text-indigo-400" : "bg-indigo-50 text-indigo-500"}`}>
                {i + 1}
              </div>
              <input
                type="text"
                value={pg.name}
                onChange={e => updatePage(i, "name", e.target.value)}
                placeholder={t("ai.pageName")}
                className={`flex-1 text-sm bg-transparent focus:outline-none ${dark ? "text-white placeholder-gray-600" : "text-gray-900 placeholder-gray-300"}`}
              />
              {pages.length > 1 && (
                <button onClick={() => removePage(i)} className={`text-lg transition-colors leading-none px-1 ${dark ? "text-gray-700 hover:text-red-400" : "text-gray-200 hover:text-red-400"}`}>
                  ×
                </button>
              )}
            </div>
          ))}
          {pages.length < MAX_PAGES && (
            <button
              onClick={addPage}
              className={`w-full py-3.5 rounded-xl border-2 border-dashed text-sm transition-all hover:-translate-y-0.5 duration-300 ${
                dark ? "border-white/5 text-gray-500 hover:text-gray-300 hover:border-white/10" : "border-gray-100 text-gray-400 hover:text-gray-600 hover:border-gray-200"
              }`}
            >
              + {t("ai.addPage")}
            </button>
          )}
          <div className="flex justify-between pt-2">
            <button onClick={() => setStep(1)} className={btnBack}>← {t("ai.back")}</button>
            <button onClick={() => setStep(3)} disabled={pages.some(p => !p.name.trim())} className={btnPrimary}>
              {t("ai.next")} →
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Fill details */}
      {step === 3 && (
        <div className="space-y-4">
          <div className={`text-xs rounded-xl px-4 py-2.5 ${dark ? "text-amber-300 bg-amber-500/10 border border-amber-500/15" : "text-gray-400 bg-amber-50 border border-amber-100"}`}>
            ✍️ ใส่รายละเอียดแต่ละหน้า ยิ่งละเอียด AI จะเขียนได้ดีขึ้น (หรือข้ามได้)
          </div>
          {pages.map((pg, i) => (
            <div key={i} className={`${cardCls} !p-5`}>
              <div className="flex items-center gap-2 mb-3">
                <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold ${dark ? "bg-indigo-500/15 text-indigo-400" : "bg-indigo-50 text-indigo-500"}`}>
                  {i + 1}
                </div>
                <h3 className={`text-sm font-bold ${dark ? "text-white" : "text-gray-900"}`}>{pg.name}</h3>
              </div>
              <textarea
                value={pg.notes}
                onChange={e => updatePage(i, "notes", e.target.value)}
                placeholder="เช่น ทักษะที่มี, ผลงานที่ทำ, ข้อมูลเพิ่มเติม..."
                rows={3}
                className={`${inputCls} resize-none ${dark ? "!bg-white/[0.02]" : "!bg-gray-50"}`}
              />
            </div>
          ))}
          <div className="flex justify-between pt-2">
            <button onClick={() => setStep(2)} className={btnBack}>← {t("ai.back")}</button>
            <button onClick={() => setStep(4)} className={btnPrimary}>
              {t("ai.next")} →
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Review and Generate */}
      {step === 4 && (
        <div className="space-y-5">
          <div className={cardCls}>
            <p className={`text-xs font-bold tracking-widest uppercase mb-5 ${dark ? "text-gray-500" : "text-gray-400"}`}>ตรวจสอบก่อนสร้าง</p>
            <div className="grid grid-cols-2 gap-4 mb-5 text-sm">
              <div>
                <p className={`text-xs mb-1 ${dark ? "text-gray-500" : "text-gray-400"}`}>ชื่อ</p>
                <p className={`font-semibold ${dark ? "text-white" : "text-gray-900"}`}>{basic.name}</p>
              </div>
              {basic.school && (
                <div>
                  <p className={`text-xs mb-1 ${dark ? "text-gray-500" : "text-gray-400"}`}>โรงเรียน</p>
                  <p className={`font-semibold ${dark ? "text-white" : "text-gray-900"}`}>{basic.school}</p>
                </div>
              )}
              {basic.grade && (
                <div>
                  <p className={`text-xs mb-1 ${dark ? "text-gray-500" : "text-gray-400"}`}>ชั้นปี</p>
                  <p className={`font-semibold ${dark ? "text-white" : "text-gray-900"}`}>{basic.grade}</p>
                </div>
              )}
              <div>
                <p className={`text-xs mb-1 ${dark ? "text-gray-500" : "text-gray-400"}`}>ภาษา</p>
                <p className={`font-semibold ${dark ? "text-white" : "text-gray-900"}`}>{basic.lang === "th" ? "🇹🇭 Thai" : "🇬🇧 English"}</p>
              </div>
            </div>
            <div className={`border-t pt-4 ${dark ? "border-white/5" : "border-gray-50"}`}>
              <p className={`text-xs mb-3 ${dark ? "text-gray-500" : "text-gray-400"}`}>{pages.length} หน้าที่จะสร้าง</p>
              <div className="flex flex-wrap gap-2">
                {pages.map((p, i) => (
                  <span key={i} className={`text-xs px-3 py-1.5 rounded-lg font-medium ${dark ? "bg-indigo-500/10 text-indigo-300 border border-indigo-500/15" : "bg-indigo-50 text-indigo-700"}`}>{p.name}</span>
                ))}
              </div>
            </div>
          </div>

          <div className={`rounded-xl px-4 py-3 text-xs ${dark ? "bg-amber-500/10 border border-amber-500/15 text-amber-300" : "bg-amber-50 border border-amber-100 text-amber-700"}`}>
            การสร้างใหม่จะแทนที่พอร์ตโฟลิโอ AI เดิมทั้งหมด
          </div>

          {error && (
            <div className={`rounded-xl px-4 py-3 text-sm ${dark ? "bg-red-500/10 border border-red-500/20 text-red-400" : "bg-red-50 border border-red-100 text-red-600"}`}>{error}</div>
          )}

          <div className="flex justify-between pt-2">
            <button onClick={() => setStep(3)} className={btnBack}>← {t("ai.back")}</button>
            <button onClick={generate} disabled={generating} className={btnPrimary}>
              {t("ai.generate")} ✦
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
