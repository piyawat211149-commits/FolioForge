"use client"
import { useEffect, useState } from "react"
import { useLang } from "./language-provider"

const TOUR_KEY = "ff_tour_done"

const STEPS = [
  { tourId: "nav-projects", titleKey: "tour.1.title", bodyKey: "tour.1.body" },
  { tourId: "nav-ai", titleKey: "tour.2.title", bodyKey: "tour.2.body" },
  { tourId: "nav-portfolio", titleKey: "tour.3.title", bodyKey: "tour.3.body" },
  { tourId: "nav-profile", titleKey: "tour.4.title", bodyKey: "tour.4.body" },
] as const

interface Rect { top: number; left: number; width: number; height: number }

export function OnboardingTour() {
  const { t } = useLang()
  const [step, setStep] = useState(-1) // -1 = not started, -2 = done
  const [rect, setRect] = useState<Rect | null>(null)

  useEffect(() => {
    const done = localStorage.getItem(TOUR_KEY)
    if (!done) {
      setTimeout(() => setStep(0), 800)
    }
  }, [])

  useEffect(() => {
    if (step < 0 || step >= STEPS.length) return
    const el = document.querySelector(`[data-tour="${STEPS[step].tourId}"]`)
    if (!el) return
    const r = el.getBoundingClientRect()
    setRect({ top: r.top, left: r.left, width: r.width, height: r.height })
  }, [step])

  function finish() {
    localStorage.setItem(TOUR_KEY, "1")
    setStep(-2)
    setRect(null)
  }

  function next() {
    if (step >= STEPS.length - 1) { finish(); return }
    setStep(s => s + 1)
  }

  if (step < 0 || step >= STEPS.length) return null

  const current = STEPS[step]
  const isLast = step === STEPS.length - 1

  // Tooltip position: default right of element
  const PAD = 12
  const tooltipLeft = rect ? rect.left + rect.width + PAD : 0
  const tooltipTop = rect ? rect.top + rect.height / 2 : 0

  return (
    <>
      {/* Dim overlay */}
      <div className="fixed inset-0 z-[1000]" style={{ background: "rgba(0,0,0,0.45)" }} />

      {/* Highlight cutout */}
      {rect && (
        <div
          className="fixed z-[1001] rounded-xl tour-highlight"
          style={{
            top: rect.top - 4,
            left: rect.left - 6,
            width: rect.width + 12,
            height: rect.height + 8,
            border: "2px solid #6366f1",
            background: "rgba(255,255,255,0.08)",
            pointerEvents: "none",
          }}
        />
      )}

      {/* Tooltip */}
      <div
        className="fixed z-[1002] bg-white rounded-2xl shadow-2xl p-5 w-64"
        style={{
          top: Math.max(12, tooltipTop - 80),
          left: Math.min(tooltipLeft, window.innerWidth - 280),
        }}
      >
        <div className="flex items-center justify-between mb-1">
          <p className="text-xs text-indigo-500 font-bold tracking-wide uppercase">
            {step + 1} / {STEPS.length}
          </p>
          <button onClick={finish} className="text-xs text-gray-300 hover:text-gray-600 transition-colors">
            {t("tour.skip")}
          </button>
        </div>
        <h3 className="text-sm font-bold text-gray-900 mb-1.5">{t(current.titleKey)}</h3>
        <p className="text-xs text-gray-500 leading-relaxed mb-4">{t(current.bodyKey)}</p>
        <button
          onClick={next}
          className="w-full bg-indigo-600 text-white text-xs font-bold py-2.5 rounded-xl hover:bg-indigo-700 transition-colors"
        >
          {isLast ? t("tour.done") : t("tour.next")}
        </button>
      </div>
    </>
  )
}
