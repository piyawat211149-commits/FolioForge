"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
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
      // Get username
      const profileRes = await fetch("/api/profile")
      const profile = await profileRes.json()
      setUsername(profile.username)

      // Generate AI content
      const genRes = await fetch("/api/ai-generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ basicInfo: basic, pages, lang: basic.lang }),
      })
      const genData = await genRes.json()
      if (!genRes.ok) { setError(genData.error || "AI generation failed"); setGenerating(false); return }

      // Clear existing pages then save new ones
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
    <div className="p-8 max-w-lg mx-auto text-center mt-16">
      <div className="text-6xl mb-6">🎉</div>
      <h2 className="text-2xl font-bold text-gray-900 mb-3">{t("ai.done")}</h2>
      <p className="text-gray-500 text-sm mb-8">พอร์ตโฟลิโอของคุณพร้อมแล้ว กดดูได้เลยครับ</p>
      <div className="flex gap-3 justify-center">
        <a
          href={`/portfolio/${username}`}
          target="_blank"
          className="bg-gray-900 text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-black transition-colors"
        >
          {t("ai.viewPortfolio")}
        </a>
        <button
          onClick={() => router.push("/dashboard")}
          className="border border-gray-200 text-gray-600 px-6 py-3 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors"
        >
          กลับหน้าหลัก
        </button>
      </div>
    </div>
  )

  return (
    <div className="p-8 max-w-2xl mx-auto">
      {/* Header */}
      <h1 className="text-2xl font-bold text-gray-900 mb-1">{t("ai.title")}</h1>
      <p className="text-gray-500 text-sm mb-8">{t("ai.sub")}</p>

      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-10">
        {STEPS.map((label, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
              step > i + 1 ? "bg-green-500 text-white" :
              step === i + 1 ? "bg-gray-900 text-white" :
              "bg-gray-100 text-gray-400"
            }`}>
              {step > i + 1 ? "✓" : i + 1}
            </div>
            <span className={`text-xs font-medium hidden sm:block ${step === i + 1 ? "text-gray-900" : "text-gray-400"}`}>
              {label}
            </span>
            {i < STEPS.length - 1 && <div className={`h-px w-6 ${step > i + 1 ? "bg-green-400" : "bg-gray-200"}`} />}
          </div>
        ))}
      </div>

      {/* Step 1: Basic Info */}
      {step === 1 && (
        <div className="space-y-5">
          {[
            { key: "name", label: t("ai.name"), placeholder: "เช่น สมชาย ใจดี" },
            { key: "school", label: t("ai.school"), placeholder: "เช่น โรงเรียนสาธิต มหาวิทยาลัยเกษตรศาสตร์" },
            { key: "grade", label: t("ai.grade"), placeholder: "เช่น ม.6 หรือ ปี 2" },
          ].map(f => (
            <div key={f.key}>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">{f.label}</label>
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
            <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">{t("ai.bio")}</label>
            <textarea
              value={basic.bio}
              onChange={e => setBasic(b => ({ ...b, bio: e.target.value }))}
              placeholder={t("ai.bioPlaceholder")}
              rows={3}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">{t("ai.lang")}</label>
            <div className="flex gap-3">
              {(["th", "en"] as const).map(l => (
                <button
                  key={l}
                  type="button"
                  onClick={() => setBasic(b => ({ ...b, lang: l }))}
                  className={`flex-1 py-3 rounded-xl text-sm font-semibold border-2 transition-all ${
                    basic.lang === l ? "border-indigo-600 bg-indigo-50 text-indigo-700" : "border-gray-100 text-gray-400 hover:border-gray-200"
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
              className="bg-gray-900 text-white px-8 py-3 rounded-xl text-sm font-semibold hover:bg-black transition-colors disabled:opacity-40"
            >
              {t("ai.next")}
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Define pages */}
      {step === 2 && (
        <div className="space-y-4">
          <p className="text-xs text-gray-400">{t("ai.pageLimit")}</p>
          {pages.map((pg, i) => (
            <div key={i} className="flex items-center gap-3 bg-white rounded-xl border border-gray-100 p-3 shadow-sm">
              <div className="w-7 h-7 rounded-lg bg-gray-50 flex items-center justify-center text-xs font-bold text-gray-400 flex-shrink-0">
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
                <button onClick={() => removePage(i)} className="text-gray-300 hover:text-red-400 text-xs transition-colors px-2">
                  {t("ai.removePage")}
                </button>
              )}
            </div>
          ))}
          {pages.length < MAX_PAGES && (
            <button
              onClick={addPage}
              className="w-full py-3 rounded-xl border border-dashed border-gray-200 text-sm text-gray-400 hover:text-gray-600 hover:border-gray-300 transition-all"
            >
              {t("ai.addPage")}
            </button>
          )}
          <div className="flex justify-between pt-2">
            <button onClick={() => setStep(1)} className="text-sm text-gray-400 hover:text-gray-700 transition-colors">{t("ai.back")}</button>
            <button
              onClick={() => setStep(3)}
              disabled={pages.some(p => !p.name.trim())}
              className="bg-gray-900 text-white px-8 py-3 rounded-xl text-sm font-semibold hover:bg-black transition-colors disabled:opacity-40"
            >
              {t("ai.next")}
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Fill details */}
      {step === 3 && (
        <div className="space-y-6">
          {pages.map((pg, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 rounded-lg bg-indigo-50 flex items-center justify-center text-xs font-bold text-indigo-600">
                  {i + 1}
                </div>
                <h3 className="text-sm font-bold text-gray-900">{pg.name}</h3>
              </div>
              <textarea
                value={pg.notes}
                onChange={e => updatePage(i, "notes", e.target.value)}
                placeholder={t("ai.pageNotesPlaceholder")}
                rows={3}
                className="w-full border border-gray-100 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all resize-none bg-gray-50"
              />
            </div>
          ))}
          <div className="flex justify-between pt-2">
            <button onClick={() => setStep(2)} className="text-sm text-gray-400 hover:text-gray-700 transition-colors">{t("ai.back")}</button>
            <button
              onClick={() => setStep(4)}
              className="bg-gray-900 text-white px-8 py-3 rounded-xl text-sm font-semibold hover:bg-black transition-colors"
            >
              {t("ai.next")}
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Generate */}
      {step === 4 && (
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-indigo-50 to-violet-50 rounded-2xl border border-indigo-100 p-6">
            <h3 className="text-sm font-bold text-gray-900 mb-3">สรุปข้อมูล</h3>
            <div className="space-y-1.5 text-xs text-gray-600">
              <p><span className="font-semibold">ชื่อ:</span> {basic.name}</p>
              {basic.school && <p><span className="font-semibold">โรงเรียน:</span> {basic.school}</p>}
              {basic.grade && <p><span className="font-semibold">ชั้นปี:</span> {basic.grade}</p>}
              <p><span className="font-semibold">ภาษา:</span> {basic.lang === "th" ? "ภาษาไทย" : "English"}</p>
              <p className="mt-2"><span className="font-semibold">หน้าทั้งหมด {pages.length} หน้า:</span> {pages.map(p => p.name).join(" · ")}</p>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-100 rounded-xl p-4 text-sm text-red-600">{error}</div>
          )}

          <div className="flex justify-between pt-2">
            <button onClick={() => setStep(3)} className="text-sm text-gray-400 hover:text-gray-700 transition-colors">{t("ai.back")}</button>
            <button
              onClick={generate}
              disabled={generating}
              className="bg-indigo-600 text-white px-8 py-3 rounded-xl text-sm font-bold hover:bg-indigo-700 transition-colors disabled:opacity-60 flex items-center gap-2"
            >
              {generating ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {t("ai.generating")}
                </>
              ) : t("ai.generate")}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
