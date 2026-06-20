"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useLang } from "@/components/language-provider"

interface PageDef { name: string; notes: string }
interface BasicInfo { name: string; school: string; grade: string; bio: string; lang: "th" | "en" }

const MAX_PAGES = 20

export default function AIBuilderPage() {
  const { t } = useLang()
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

  if (done) return (
    <div className="p-8 flex items-center justify-center min-h-[80vh]">
      <div className="max-w-md w-full text-center">
        {/* Celebration */}
        <div className="relative mb-8">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-5xl mx-auto shadow-2xl shadow-indigo-500/30">
            🎉
          </div>
          <div className="absolute -top-1 -right-1 left-0 flex justify-center gap-1 text-xl select-none pointer-events-none">
            <span>✨</span><span style={{ marginLeft: 80 }}>⭐</span>
          </div>
        </div>

        <h2 className="text-3xl font-extrabold text-gray-900 mb-3">พอร์ตโฟลิโอพร้อมแล้ว!</h2>
        <p className="text-gray-400 text-sm mb-2">AI สร้างเนื้อหาทั้งหมด <span className="font-bold text-gray-600">{pages.length} หน้า</span> ให้คุณแล้ว</p>
        <p className="text-gray-400 text-sm mb-10">คุณสามารถกดดูหรือแชร์ได้ทันทีเลย</p>

        <div className="bg-gray-50 rounded-2xl p-4 mb-8 text-left">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">หน้าที่สร้าง</p>
          <div className="space-y-2">
            {pages.map((pg, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-green-600 text-[10px]">✓</span>
                </div>
                <span className="text-sm text-gray-700 font-medium">{pg.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <a
            href={`/portfolio/${username}`}
            target="_blank"
            className="inline-flex items-center justify-center gap-2 bg-gray-900 text-white px-6 py-4 rounded-xl text-sm font-bold hover:bg-black transition-colors shadow-lg shadow-gray-900/10"
          >
            ดูพอร์ตโฟลิโอ ↗
          </a>
          <button
            onClick={() => router.push("/dashboard")}
            className="border border-gray-200 text-gray-500 px-6 py-3 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            กลับหน้าหลัก
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-gray-900 mb-1">{t("ai.title")}</h1>
        <p className="text-gray-400 text-sm">{t("ai.sub")}</p>
      </div>

      {/* Step indicator */}
      <div className="mb-10">
        <div className="flex items-center gap-0">
          {STEPS.map((label, i) => (
            <div key={i} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center gap-1.5">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  step > i + 1 ? "bg-green-500 text-white shadow-sm shadow-green-500/30" :
                  step === i + 1 ? "bg-gray-900 text-white shadow-sm" :
                  "bg-gray-100 text-gray-400"
                }`}>
                  {step > i + 1 ? "✓" : i + 1}
                </div>
                <span className={`text-[10px] font-semibold hidden sm:block text-center leading-tight max-w-[60px] ${step === i + 1 ? "text-gray-900" : "text-gray-300"}`}>
                  {label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`flex-1 h-px mx-2 mb-4 transition-colors ${step > i + 1 ? "bg-green-400" : "bg-gray-100"}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step 1: Basic Info */}
      {step === 1 && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">
          <p className="text-xs font-bold tracking-widest text-gray-400 uppercase">ข้อมูลพื้นฐาน</p>
          {[
            { key: "name", label: t("ai.name"), placeholder: "เช่น สมชาย ใจดี" },
            { key: "school", label: t("ai.school"), placeholder: "เช่น โรงเรียนสาธิต มหาวิทยาลัยเกษตรศาสตร์" },
            { key: "grade", label: t("ai.grade"), placeholder: "เช่น ม.6 หรือ ปี 2" },
          ].map(f => (
            <div key={f.key}>
              <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">{f.label}</label>
              <input
                type="text"
                value={basic[f.key as keyof BasicInfo]}
                onChange={e => setBasic(b => ({ ...b, [f.key]: e.target.value }))}
                placeholder={f.placeholder}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
            </div>
          ))}
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">{t("ai.bio")}</label>
            <textarea
              value={basic.bio}
              onChange={e => setBasic(b => ({ ...b, bio: e.target.value }))}
              placeholder={t("ai.bioPlaceholder")}
              rows={3}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">{t("ai.lang")}</label>
            <div className="flex gap-3">
              {(["th", "en"] as const).map(l => (
                <button
                  key={l}
                  type="button"
                  onClick={() => setBasic(b => ({ ...b, lang: l }))}
                  className={`flex-1 py-3 rounded-xl text-sm font-bold border-2 transition-all ${
                    basic.lang === l ? "border-indigo-500 bg-indigo-50 text-indigo-700" : "border-gray-100 text-gray-400 hover:border-gray-200"
                  }`}
                >
                  {l === "th" ? "🇹🇭 ภาษาไทย" : "🇬🇧 English"}
                </button>
              ))}
            </div>
          </div>
          <div className="flex justify-end pt-2">
            <button
              onClick={() => setStep(2)}
              disabled={!basic.name.trim()}
              className="bg-gray-900 text-white px-8 py-3 rounded-xl text-sm font-bold hover:bg-black transition-colors disabled:opacity-40"
            >
              {t("ai.next")} →
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Define pages */}
      {step === 2 && (
        <div className="space-y-4">
          <p className="text-xs text-gray-400 bg-indigo-50 border border-indigo-100 rounded-xl px-4 py-2.5">
            💡 {t("ai.pageLimit")}
          </p>
          {pages.map((pg, i) => (
            <div key={i} className="flex items-center gap-3 bg-white rounded-xl border border-gray-100 p-3.5 shadow-sm hover:border-gray-200 transition-colors">
              <div className="w-7 h-7 rounded-lg bg-indigo-50 flex items-center justify-center text-xs font-bold text-indigo-500 flex-shrink-0">
                {i + 1}
              </div>
              <input
                type="text"
                value={pg.name}
                onChange={e => updatePage(i, "name", e.target.value)}
                placeholder={t("ai.pageName")}
                className="flex-1 text-sm text-gray-900 placeholder-gray-300 focus:outline-none bg-transparent"
              />
              {pages.length > 1 && (
                <button onClick={() => removePage(i)} className="text-gray-200 hover:text-red-400 text-lg transition-colors leading-none px-1">
                  ×
                </button>
              )}
            </div>
          ))}
          {pages.length < MAX_PAGES && (
            <button
              onClick={addPage}
              className="w-full py-3.5 rounded-xl border-2 border-dashed border-gray-100 text-sm text-gray-400 hover:text-gray-600 hover:border-gray-200 transition-all"
            >
              + {t("ai.addPage")}
            </button>
          )}
          <div className="flex justify-between pt-2">
            <button onClick={() => setStep(1)} className="text-sm text-gray-400 hover:text-gray-700 transition-colors">← {t("ai.back")}</button>
            <button
              onClick={() => setStep(3)}
              disabled={pages.some(p => !p.name.trim())}
              className="bg-gray-900 text-white px-8 py-3 rounded-xl text-sm font-bold hover:bg-black transition-colors disabled:opacity-40"
            >
              {t("ai.next")} →
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Fill details */}
      {step === 3 && (
        <div className="space-y-4">
          <p className="text-xs text-gray-400 bg-amber-50 border border-amber-100 rounded-xl px-4 py-2.5">
            ✍️ ใส่รายละเอียดแต่ละหน้า ยิ่งละเอียด AI จะเขียนได้ดีขึ้น (หรือข้ามได้)
          </p>
          {pages.map((pg, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 rounded-lg bg-indigo-50 flex items-center justify-center text-xs font-bold text-indigo-500">
                  {i + 1}
                </div>
                <h3 className="text-sm font-bold text-gray-900">{pg.name}</h3>
              </div>
              <textarea
                value={pg.notes}
                className="w-full border border-gray-100 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all resize-none bg-gray-50"
              />
            </div>
          ))}
          <div className="flex justify-between pt-2">
            <button onClick={() => setStep(2)} className="text-sm text-gray-400 hover:text-gray-700 transition-colors">{"<-"} {t("ai.back")}</button>
            <button
              onClick={() => setStep(4)}
              className="bg-gray-900 text-white px-8 py-3 rounded-xl text-sm font-bold hover:bg-black transition-colors"
            >
              {t("ai.next")} {"->"}
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Review and Generate */}
      {step === 4 && (
        <div className="space-y-5">
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <p className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-5">ตรวจสอบก่อนสร้าง</p>
            <div className="grid grid-cols-2 gap-4 mb-5 text-sm">
              <div>
                <p className="text-xs text-gray-400 mb-1">ชื่อ</p>
                <p className="font-semibold text-gray-900">{basic.name}</p>
              </div>
              {basic.school && (
                <div>
                  <p className="text-xs text-gray-400 mb-1">โรงเรียน</p>
                  <p className="font-semibold text-gray-900">{basic.school}</p>
                </div>
              )}
              {basic.grade && (
                <div>
                  <p className="text-xs text-gray-400 mb-1">ชั้นปี</p>
                  <p className="font-semibold text-gray-900">{basic.grade}</p>
                </div>
              )}
              <div>
                <p className="text-xs text-gray-400 mb-1">ภาษา</p>
                <p className="font-semibold text-gray-900">{basic.lang === "th" ? "Thai" : "English"}</p>
              </div>
            </div>
            <div className="border-t border-gray-50 pt-4">
              <p className="text-xs text-gray-400 mb-3">{pages.length} หน้าที่จะสร้าง</p>
              <div className="flex flex-wrap gap-2">
                {pages.map((p, i) => (
                  <span key={i} className="text-xs px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg font-medium">{p.name}</span>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-3 text-xs text-amber-700">
            การสร้างใหม่จะแทนที่พอร์ตโฟลิโอ AI เดิมทั้งหมด
          </div>

          {error && (
            <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3 text-sm text-red-600">{error}</div>
          )}

          <div className="flex justify-between pt-2">
            <button onClick={() => setStep(3)} className="text-sm text-gray-400 hover:text-gray-700 transition-colors">{"<-"} {t("ai.back")}</button>
            <button
              onClick={generate}
              disabled={generating}
              className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-8 py-3.5 rounded-xl text-sm font-bold hover:from-indigo-700 hover:to-violet-700 transition-all disabled:opacity-60 flex items-center gap-2 shadow-lg shadow-indigo-500/20"
            >
              {generating ? (
                <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />{t("ai.generating")}</>
              ) : <>{t("ai.generate")}</>}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
