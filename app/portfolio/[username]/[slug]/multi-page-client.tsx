"use client"
import Link from "next/link"
import Image from "next/image"
import { useState, useEffect, useRef } from "react"
import { ParticleBackground } from "@/components/particle-background"
import { LanguageToggle } from "@/components/language-toggle"
import { getFacultyTheme, type FacultyTheme } from "@/lib/faculty-themes"

interface PageItem { id: string; title: string; slug: string; content: PageContent }
interface PageContent {
  heading?: string
  body?: string
  highlights?: string[]
  extra?: string
  _facultyTheme?: string
}
interface User { name: string; username: string; avatarUrl: string; bio: string; school: string; theme: string }

interface Props {
  user: User
  pages: PageItem[]
  currentSlug: string
  currentContent: PageContent
}

function useInView(threshold = 0.1) {
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

const THEMES = ["minimal", "dark", "classic"]
const THEME_LABELS: Record<string, string> = { minimal: "Minimal", dark: "Dark", classic: "Classic" }

export function MultiPagePortfolioClient({ user, pages, currentSlug, currentContent }: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [theme, setTheme] = useState(user.theme || "minimal")
  const isDark = theme === "dark"

  const headerView = useInView()
  const contentView = useInView()
  const navView = useInView()

  useEffect(() => { setMounted(true) }, [])

  const ftId = pages[0]?.content?._facultyTheme || "default"
  const ft: FacultyTheme = getFacultyTheme(ftId)

  const bg = isDark ? "#07070f" : "#ffffff"
  const text = isDark ? "#f0f0f0" : "#111111"
  const textSub = isDark ? "#9ca3af" : "#6b7280"
  const border = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)"
  const cardBg = isDark ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.8)"
  const accent = isDark ? ft.accent : ft.accentDark
  const accentSoft = isDark ? ft.accentSoftDark : ft.accentSoft
  const gradientText = isDark ? ft.gradientDark : ft.gradient
  const sidebarBg = isDark ? "rgba(7,7,15,0.92)" : "rgba(255,255,255,0.92)"

  function handlePrintAll() {
    window.print()
  }

  return (
    <div style={{ minHeight: "100vh", background: bg, color: text, fontFamily: "var(--font-geist-sans, sans-serif)", position: "relative", overflow: "hidden" }}>

      <style>{`
        @keyframes aurora-1{0%,100%{transform:translate(0,0) scale(1)}33%{transform:translate(60px,-40px) scale(1.1)}66%{transform:translate(-30px,20px) scale(0.95)}}
        @keyframes aurora-2{0%,100%{transform:translate(0,0) scale(1)}33%{transform:translate(-50px,30px) scale(1.05)}66%{transform:translate(40px,-20px) scale(1.1)}}
        @keyframes aurora-3{0%,100%{transform:translate(0,0) scale(1.05)}50%{transform:translate(30px,40px) scale(0.95)}}
        @keyframes fade-in-up{from{opacity:0;transform:translateY(40px)}to{opacity:1;transform:translateY(0)}}
        @keyframes float-avatar{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
        @keyframes slide-in-left{from{transform:translateX(-100%);opacity:0}to{transform:translateX(0);opacity:1}}
        .mp-fade-up{opacity:0;transform:translateY(32px);transition:opacity .7s cubic-bezier(.22,1,.36,1),transform .7s cubic-bezier(.22,1,.36,1)}
        .mp-fade-up.in{opacity:1;transform:translateY(0)}
        .mp-gradient-text{-webkit-background-clip:text!important;background-clip:text!important;-webkit-text-fill-color:transparent;color:transparent}
        @media print{
          .no-print{display:none!important}
          .print-all-pages{display:block!important}
          .print-all-pages .print-page{page-break-after:always}
          .print-all-pages .print-page:last-child{page-break-after:auto}
          body{background:white!important;color:black!important}
        }
        .print-all-pages{display:none}
      `}</style>

      {/* Aurora background */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
        {isDark ? (
          <>
            <div style={{ position: "absolute", top: "-20%", left: "-10%", width: 700, height: 700, borderRadius: "50%", background: "rgba(99,102,241,0.12)", filter: "blur(140px)", animation: "aurora-1 16s ease-in-out infinite" }} />
            <div style={{ position: "absolute", top: "35%", right: "-15%", width: 600, height: 600, borderRadius: "50%", background: "rgba(139,92,246,0.10)", filter: "blur(130px)", animation: "aurora-2 20s ease-in-out infinite" }} />
            <div style={{ position: "absolute", bottom: "-10%", left: "15%", width: 500, height: 500, borderRadius: "50%", background: "rgba(79,70,229,0.08)", filter: "blur(120px)", animation: "aurora-3 14s ease-in-out infinite" }} />
          </>
        ) : (
          <>
            <div style={{ position: "absolute", top: "-20%", left: "-10%", width: 700, height: 700, borderRadius: "50%", background: "rgba(199,210,254,0.40)", filter: "blur(130px)", animation: "aurora-1 16s ease-in-out infinite" }} />
            <div style={{ position: "absolute", top: "35%", right: "-15%", width: 600, height: 600, borderRadius: "50%", background: "rgba(196,181,253,0.35)", filter: "blur(120px)", animation: "aurora-2 20s ease-in-out infinite" }} />
            <div style={{ position: "absolute", bottom: "-10%", left: "15%", width: 500, height: 500, borderRadius: "50%", background: "rgba(224,231,255,0.40)", filter: "blur(110px)", animation: "aurora-3 14s ease-in-out infinite" }} />
          </>
        )}
      </div>

      {/* Particle background */}
      <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}>
        <ParticleBackground dark={isDark} />
      </div>

      {/* Sidebar overlay (mobile) */}
      {sidebarOpen && (
        <div
          className="no-print"
          style={{ position: "fixed", inset: 0, zIndex: 60, background: "rgba(0,0,0,0.5)" }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className="no-print"
        style={{
          position: "fixed", top: 0, left: 0, bottom: 0, zIndex: 70,
          width: 280,
          background: sidebarBg,
          backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)",
          borderRight: `1px solid ${border}`,
          transform: sidebarOpen ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.35s cubic-bezier(.22,1,.36,1)",
          display: "flex", flexDirection: "column",
          overflowY: "auto",
        }}
      >
        {/* Sidebar header */}
        <div style={{ padding: "20px 20px 16px", borderBottom: `1px solid ${border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {user.avatarUrl && (
              <div style={{ width: 36, height: 36, borderRadius: "50%", overflow: "hidden", flexShrink: 0, border: `1.5px solid ${border}` }}>
                <Image src={user.avatarUrl} alt={user.name} width={36} height={36} style={{ objectFit: "cover", width: "100%", height: "100%" }} />
              </div>
            )}
            <div>
              <p style={{ fontSize: "0.85rem", fontWeight: 800, color: text, margin: 0, letterSpacing: "-0.02em" }}>{user.name}</p>
              <p style={{ fontSize: "0.7rem", color: textSub, margin: 0 }}>@{user.username}</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            style={{ background: "none", border: "none", color: textSub, cursor: "pointer", fontSize: "1.1rem", padding: 4, borderRadius: 8, transition: "color 0.2s" }}
            onMouseEnter={e => (e.currentTarget.style.color = text)}
            onMouseLeave={e => (e.currentTarget.style.color = textSub)}
          >
            ✕
          </button>
        </div>

        {/* Page navigation */}
        <div style={{ flex: 1, padding: "16px 12px" }}>
          <p style={{ fontSize: "0.65rem", fontWeight: 700, color: textSub, textTransform: "uppercase", letterSpacing: "0.15em", padding: "0 8px", marginBottom: 8 }}>
            Pages
          </p>
          <nav style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {pages.map((pg, i) => (
              <Link
                key={pg.slug}
                href={`/portfolio/${user.username}/${pg.slug}`}
                onClick={() => setSidebarOpen(false)}
                style={{
                  padding: "10px 14px", borderRadius: 10,
                  fontSize: "0.8125rem", fontWeight: 600,
                  textDecoration: "none", transition: "all 0.2s",
                  display: "flex", alignItems: "center", gap: 10,
                  background: pg.slug === currentSlug
                    ? (isDark ? "rgba(129,140,248,0.15)" : "rgba(99,102,241,0.08)")
                    : "transparent",
                  color: pg.slug === currentSlug ? accent : textSub,
                }}
                onMouseEnter={e => {
                  if (pg.slug !== currentSlug) e.currentTarget.style.background = isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.02)"
                }}
                onMouseLeave={e => {
                  if (pg.slug !== currentSlug) e.currentTarget.style.background = "transparent"
                }}
              >
                <span style={{
                  width: 22, height: 22, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "0.65rem", fontWeight: 800, flexShrink: 0,
                  background: pg.slug === currentSlug ? accentSoft : "transparent",
                  color: pg.slug === currentSlug ? accent : textSub,
                }}>
                  {i + 1}
                </span>
                {pg.title}
              </Link>
            ))}
          </nav>
        </div>

        {/* Sidebar bottom: theme + actions */}
        <div style={{ padding: "16px 12px", borderTop: `1px solid ${border}` }}>
          {/* Theme selector */}
          <p style={{ fontSize: "0.65rem", fontWeight: 700, color: textSub, textTransform: "uppercase", letterSpacing: "0.15em", padding: "0 8px", marginBottom: 8 }}>
            Theme
          </p>
          <div style={{ display: "flex", gap: 4, marginBottom: 16, padding: "0 4px" }}>
            {THEMES.map((t) => (
              <button
                key={t}
                onClick={() => setTheme(t)}
                style={{
                  flex: 1, fontSize: "0.7rem", padding: "7px 0", borderRadius: 8, border: "none", cursor: "pointer",
                  fontWeight: 600, transition: "all 0.25s",
                  background: theme === t
                    ? (isDark ? "rgba(129,140,248,0.2)" : "rgba(99,102,241,0.1)")
                    : (isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)"),
                  color: theme === t ? accent : textSub,
                  boxShadow: theme === t ? `0 2px 8px ${isDark ? "rgba(129,140,248,0.15)" : "rgba(99,102,241,0.08)"}` : "none",
                }}
              >
                {THEME_LABELS[t]}
              </button>
            ))}
          </div>

          {/* Actions */}
          <div style={{ display: "flex", flexDirection: "column", gap: 6, padding: "0 4px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <LanguageToggle />
            </div>
            <button
              onClick={handlePrintAll}
              style={{
                width: "100%", fontSize: "0.75rem", padding: "10px 0", borderRadius: 10, cursor: "pointer",
                fontWeight: 700, transition: "all 0.25s", border: "none",
                background: isDark
                  ? "linear-gradient(135deg, rgba(99,102,241,0.2), rgba(139,92,246,0.2))"
                  : "linear-gradient(135deg, rgba(99,102,241,0.1), rgba(139,92,246,0.1))",
                color: accent,
              }}
              onMouseEnter={e => (e.currentTarget.style.transform = "translateY(-1px)")}
              onMouseLeave={e => (e.currentTarget.style.transform = "translateY(0)")}
            >
              PDF ทุกหน้า ↓
            </button>
          </div>

          {/* FolioForge link */}
          <div style={{ marginTop: 16, padding: "0 8px" }}>
            <Link
              href="/"
              style={{ fontSize: "0.7rem", fontWeight: 700, color: textSub, textDecoration: "none", opacity: 0.6, transition: "opacity 0.2s" }}
              onMouseEnter={e => (e.currentTarget.style.opacity = "1")}
              onMouseLeave={e => (e.currentTarget.style.opacity = "0.6")}
            >
              FolioForge
            </Link>
          </div>
        </div>
      </aside>

      {/* Sidebar toggle button (floating) */}
      <button
        className="no-print"
        onClick={() => setSidebarOpen(true)}
        style={{
          position: "fixed", top: 16, left: 16, zIndex: 55,
          width: 42, height: 42, borderRadius: 12,
          background: sidebarBg,
          backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)",
          border: `1px solid ${border}`,
          color: text, cursor: "pointer",
          display: sidebarOpen ? "none" : "flex", alignItems: "center", justifyContent: "center",
          fontSize: "1rem",
          boxShadow: isDark ? "0 4px 16px rgba(0,0,0,0.4)" : "0 4px 16px rgba(0,0,0,0.08)",
          transition: "all 0.25s",
        }}
        onMouseEnter={e => {
          e.currentTarget.style.background = accentSoft
          e.currentTarget.style.color = accent
          e.currentTarget.style.transform = "scale(1.08)"
        }}
        onMouseLeave={e => {
          e.currentTarget.style.background = sidebarBg
          e.currentTarget.style.color = text
          e.currentTarget.style.transform = "scale(1)"
        }}
      >
        ☰
      </button>

      {/* Main content (screen view - current page only) */}
      <main className="no-print" style={{ position: "relative", zIndex: 10, maxWidth: 800, margin: "0 auto", padding: "64px 24px 96px" }}>

        {/* User header on first page */}
        {pages[0]?.slug === currentSlug && (
          <div
            ref={headerView.ref}
            className={`mp-fade-up ${mounted && headerView.inView ? "in" : ""}`}
            style={{ marginBottom: 64 }}
          >
            <div style={{ display: "flex", alignItems: "flex-end", gap: 20, marginBottom: 24 }}>
              {user.avatarUrl && (
                <div style={{
                  width: 88, height: 88, borderRadius: "50%", overflow: "hidden", flexShrink: 0,
                  border: `2px solid ${border}`,
                  boxShadow: `0 8px 32px ${isDark ? "rgba(129,140,248,0.15)" : "rgba(99,102,241,0.12)"}`,
                  animation: "float-avatar 4s ease-in-out infinite",
                }}>
                  <Image src={user.avatarUrl} alt={user.name} width={88} height={88} style={{ objectFit: "cover", width: "100%", height: "100%" }} />
                </div>
              )}
              <div>
                <h1
                  className="mp-gradient-text"
                  style={{
                    fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 800,
                    letterSpacing: "-0.04em", lineHeight: 1.1, margin: 0,
                    background: gradientText,
                  }}>
                  {user.name}
                </h1>
                {user.school && (
                  <p style={{ margin: "10px 0 0", color: textSub, fontSize: "0.9rem", fontWeight: 500 }}>{user.school}</p>
                )}
              </div>
            </div>
            {user.bio && (
              <p style={{ color: textSub, lineHeight: 1.8, maxWidth: 640, margin: 0, fontSize: "1rem" }}>{user.bio}</p>
            )}
            <div style={{
              height: 1, margin: "40px 0 0",
              background: isDark
                ? "linear-gradient(90deg, transparent, rgba(129,140,248,0.3), transparent)"
                : "linear-gradient(90deg, transparent, rgba(99,102,241,0.2), transparent)",
            }} />
          </div>
        )}

        {/* Page content card */}
        <div
          ref={contentView.ref}
          className={`mp-fade-up ${mounted && contentView.inView ? "in" : ""}`}
          style={{
            borderRadius: 24, overflow: "hidden",
            border: `1px solid ${border}`,
            background: cardBg,
            backdropFilter: "blur(12px)",
            padding: "40px 36px",
            boxShadow: isDark ? "0 4px 32px rgba(0,0,0,0.3)" : "0 4px 32px rgba(0,0,0,0.04)",
          }}
        >
          {currentContent.heading && (
            <h2
              className="mp-gradient-text"
              style={{
                fontSize: "clamp(1.5rem, 4vw, 2.5rem)", fontWeight: 800,
                letterSpacing: "-0.03em", marginBottom: 28, lineHeight: 1.15,
                background: gradientText,
              }}>
              {currentContent.heading}
            </h2>
          )}

          {currentContent.body && (
            <div style={{ color: textSub, lineHeight: 1.9, fontSize: "1rem", marginBottom: 32, whiteSpace: "pre-wrap" }}>
              {currentContent.body}
            </div>
          )}

          {currentContent.highlights?.length ? (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 32 }}>
              {currentContent.highlights.map((h: string, i: number) => (
                <span key={i} style={{
                  padding: "8px 20px", borderRadius: 100,
                  border: `1px solid ${border}`,
                  fontSize: "0.8125rem", fontWeight: 600,
                  color: accent, background: accentSoft,
                  transition: "all 0.25s",
                  animation: `fade-in-up 0.5s cubic-bezier(.22,1,.36,1) ${i * 0.06}s both`,
                }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = "translateY(-3px)"
                    e.currentTarget.style.boxShadow = `0 4px 12px ${isDark ? "rgba(129,140,248,0.15)" : "rgba(99,102,241,0.1)"}`
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = "translateY(0)"
                    e.currentTarget.style.boxShadow = "none"
                  }}
                >
                  {h}
                </span>
              ))}
            </div>
          ) : null}

          {currentContent.extra && (
            <div style={{
              color: textSub, lineHeight: 1.8, fontSize: "0.9375rem",
              borderLeft: `3px solid ${accent}`,
              margin: "32px 0 0",
              background: accentSoft,
              padding: "20px 24px", borderRadius: "0 16px 16px 0",
            }}>
              {currentContent.extra}
            </div>
          )}
        </div>

        {/* Page navigation */}
        <div
          ref={navView.ref}
          className={`mp-fade-up ${mounted && navView.inView ? "in" : ""}`}
          style={{ display: "flex", justifyContent: "space-between", marginTop: 48, gap: 16 }}
        >
          {(() => {
            const idx = pages.findIndex(p => p.slug === currentSlug)
            const prev = idx > 0 ? pages[idx - 1] : null
            const next = idx < pages.length - 1 ? pages[idx + 1] : null
            return (
              <>
                {prev ? (
                  <Link
                    href={`/portfolio/${user.username}/${prev.slug}`}
                    style={{
                      flex: 1, display: "flex", flexDirection: "column", gap: 6,
                      padding: "20px 24px", borderRadius: 16,
                      border: `1px solid ${border}`,
                      background: cardBg, backdropFilter: "blur(10px)",
                      textDecoration: "none", transition: "all 0.3s",
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.transform = "translateY(-3px)"
                      e.currentTarget.style.boxShadow = `0 8px 24px ${isDark ? "rgba(129,140,248,0.12)" : "rgba(99,102,241,0.08)"}`
                      e.currentTarget.style.borderColor = accent
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.transform = "translateY(0)"
                      e.currentTarget.style.boxShadow = "none"
                      e.currentTarget.style.borderColor = border
                    }}
                  >
                    <span style={{ fontSize: "0.7rem", fontWeight: 600, color: textSub, textTransform: "uppercase", letterSpacing: "0.1em" }}>← ก่อนหน้า</span>
                    <span style={{ fontSize: "0.9rem", fontWeight: 700, color: text }}>{prev.title}</span>
                  </Link>
                ) : <span style={{ flex: 1 }} />}
                {next ? (
                  <Link
                    href={`/portfolio/${user.username}/${next.slug}`}
                    style={{
                      flex: 1, display: "flex", flexDirection: "column", gap: 6, textAlign: "right",
                      padding: "20px 24px", borderRadius: 16,
                      border: `1px solid ${border}`,
                      background: cardBg, backdropFilter: "blur(10px)",
                      textDecoration: "none", transition: "all 0.3s",
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.transform = "translateY(-3px)"
                      e.currentTarget.style.boxShadow = `0 8px 24px ${isDark ? "rgba(129,140,248,0.12)" : "rgba(99,102,241,0.08)"}`
                      e.currentTarget.style.borderColor = accent
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.transform = "translateY(0)"
                      e.currentTarget.style.boxShadow = "none"
                      e.currentTarget.style.borderColor = border
                    }}
                  >
                    <span style={{ fontSize: "0.7rem", fontWeight: 600, color: textSub, textTransform: "uppercase", letterSpacing: "0.1em" }}>ถัดไป →</span>
                    <span style={{ fontSize: "0.9rem", fontWeight: 700, color: text }}>{next.title}</span>
                  </Link>
                ) : <span style={{ flex: 1 }} />}
              </>
            )
          })()}
        </div>

        {/* Footer */}
        <div style={{ marginTop: 80, textAlign: "center" }}>
          <div style={{
            height: 1, marginBottom: 32,
            background: isDark
              ? "linear-gradient(90deg, transparent, rgba(129,140,248,0.3), transparent)"
              : "linear-gradient(90deg, transparent, rgba(99,102,241,0.2), transparent)",
          }} />
          <p style={{ color: textSub, fontSize: "0.75rem" }}>
            Built with{" "}
            <Link
              href="/"
              style={{ color: accent, textDecoration: "none", fontWeight: 600, transition: "opacity 0.2s" }}
              onMouseEnter={e => (e.currentTarget.style.opacity = "0.7")}
              onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
            >
              FolioForge
            </Link>
          </p>
        </div>
      </main>

      {/* ── Print view: ALL pages rendered ── */}
      <div className="print-all-pages" style={{ background: "#fff", color: "#111" }}>
        {/* Header */}
        <div style={{ padding: "48px 48px 32px", borderBottom: "1px solid #e5e7eb" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 12 }}>
            {user.avatarUrl && (
              <div style={{ width: 56, height: 56, borderRadius: "50%", overflow: "hidden", border: "2px solid #e5e7eb", flexShrink: 0 }}>
                <Image src={user.avatarUrl} alt={user.name} width={56} height={56} style={{ objectFit: "cover", width: "100%", height: "100%" }} />
              </div>
            )}
            <div>
              <h1 style={{ fontSize: "1.75rem", fontWeight: 800, letterSpacing: "-0.03em", margin: 0, color: "#111" }}>{user.name}</h1>
              {user.school && <p style={{ fontSize: "0.85rem", color: "#666", margin: "4px 0 0" }}>{user.school}</p>}
            </div>
          </div>
          {user.bio && <p style={{ fontSize: "0.9rem", color: "#555", lineHeight: 1.7, maxWidth: 600, margin: 0 }}>{user.bio}</p>}
        </div>

        {/* All pages */}
        {pages.map((pg) => {
          const c = pg.content
          return (
            <div key={pg.id} className="print-page" style={{ padding: "40px 48px" }}>
              {c.heading && (
                <h2 style={{ fontSize: "1.5rem", fontWeight: 800, letterSpacing: "-0.02em", marginBottom: 16, color: "#111", borderBottom: "2px solid #6366f1", paddingBottom: 8, display: "inline-block" }}>
                  {c.heading}
                </h2>
              )}
              {c.body && (
                <div style={{ fontSize: "0.9rem", color: "#444", lineHeight: 1.8, marginBottom: 20, whiteSpace: "pre-wrap" }}>
                  {c.body}
                </div>
              )}
              {c.highlights?.length ? (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 20 }}>
                  {c.highlights.map((h, i) => (
                    <span key={i} style={{ padding: "4px 14px", borderRadius: 100, border: "1px solid #d1d5db", fontSize: "0.8rem", fontWeight: 500, color: "#374151" }}>
                      {h}
                    </span>
                  ))}
                </div>
              ) : null}
              {c.extra && (
                <div style={{ fontSize: "0.85rem", color: "#555", lineHeight: 1.7, borderLeft: "3px solid #6366f1", paddingLeft: 16, background: "#f5f3ff", padding: "12px 16px", borderRadius: "0 8px 8px 0" }}>
                  {c.extra}
                </div>
              )}
            </div>
          )
        })}

        {/* Print footer */}
        <div style={{ textAlign: "center", padding: "24px 48px", borderTop: "1px solid #e5e7eb", fontSize: "0.7rem", color: "#9ca3af" }}>
          Built with FolioForge
        </div>
      </div>
    </div>
  )
}
