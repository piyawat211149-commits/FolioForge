"use client"
import Link from "next/link"
import Image from "next/image"
import { useState, useEffect, useRef } from "react"
import { ParticleBackground } from "@/components/particle-background"
import { LanguageToggle } from "@/components/language-toggle"
import { getFacultyTheme, type FacultyTheme } from "@/lib/faculty-themes"

interface PageItem { id: string; title: string; slug: string; content: PageContent }
interface PageImage { url: string; filename: string }
interface PageContent {
  heading?: string
  body?: string
  highlights?: string[]
  extra?: string
  images?: PageImage[]
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
  const [lightbox, setLightbox] = useState<string | null>(null)
  const [theme, setThemeState] = useState(user.theme || "minimal")
  const isDark = theme === "dark"

  function setTheme(t: string) {
    setThemeState(t)
    try { localStorage.setItem("ff-portfolio-theme", t) } catch {}
  }

  const headerView = useInView()
  const contentView = useInView()
  const navView = useInView()

  useEffect(() => {
    setMounted(true)
    try {
      const saved = localStorage.getItem("ff-portfolio-theme")
      if (saved && THEMES.includes(saved)) setThemeState(saved)
    } catch {}
  }, [])

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

      {/* Lightbox */}
      {lightbox && (
        <div
          style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(0,0,0,0.9)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "zoom-out", padding: 24 }}
          onClick={() => setLightbox(null)}
        >
          <button
            onClick={() => setLightbox(null)}
            style={{ position: "absolute", top: 20, right: 20, width: 40, height: 40, borderRadius: "50%", background: "rgba(255,255,255,0.1)", border: "none", color: "white", fontSize: "1.2rem", cursor: "pointer" }}
          >
            ✕
          </button>
          <img src={lightbox} alt="" style={{ maxWidth: "90%", maxHeight: "90%", objectFit: "contain", borderRadius: 12 }} />
        </div>
      )}

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
          .mp-aurora,.mp-particles{display:none!important}
          .mp-screen-content{display:none!important}
          .print-all-pages{display:block!important}
          .print-all-pages .print-page{page-break-after:always}
          .print-all-pages .print-page:last-child{page-break-after:auto}
          body{background:white!important;color:black!important}
          *{-webkit-print-color-adjust:exact!important;print-color-adjust:exact!important}
        }
        .print-all-pages{display:none}
      `}</style>

      {/* Aurora background */}
      <div className="mp-aurora" style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
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
      <div className="mp-particles" style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}>
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

            {/* Canva buttons */}
            <p style={{ fontSize: "0.65rem", fontWeight: 700, color: textSub, textTransform: "uppercase", letterSpacing: "0.15em", marginTop: 16, marginBottom: 8 }}>
              แก้ไขใน Canva
            </p>
            {[
              { icon: "📄", label: "Portfolio Document", url: "https://www.canva.com/design/DAHNOj5J-OU/edit" },
              { icon: "📝", label: "Portfolio แบบ 2", url: "https://www.canva.com/design/DAHNOtMrrd0/edit" },
              { icon: "🎤", label: "Presentation 10 สไลด์", url: "https://www.canva.com/design/DAHNOkLwRFE/edit" },
            ].map((item) => (
              <a
                key={item.label}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "flex", alignItems: "center", gap: 10, width: "100%",
                  fontSize: "0.75rem", padding: "9px 12px", borderRadius: 10, cursor: "pointer",
                  fontWeight: 600, transition: "all 0.25s", border: "none", textDecoration: "none",
                  marginBottom: 4,
                  background: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)",
                  color: text,
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = accentSoft
                  e.currentTarget.style.color = accent
                  e.currentTarget.style.transform = "translateY(-1px)"
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)"
                  e.currentTarget.style.color = text
                  e.currentTarget.style.transform = "translateY(0)"
                }}
              >
                <span>{item.icon}</span>
                <span style={{ flex: 1 }}>{item.label}</span>
                <span style={{ fontSize: "0.65rem", opacity: 0.5 }}>↗</span>
              </a>
            ))}
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
      <main className="mp-screen-content" style={{ position: "relative", zIndex: 10, maxWidth: 800, margin: "0 auto", padding: "64px 24px 96px" }}>

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

        {/* Page content — section-specific layouts */}
        <div
          ref={contentView.ref}
          className={`mp-fade-up ${mounted && contentView.inView ? "in" : ""}`}
        >
          {(() => {
            const slug = currentSlug
            const heading = currentContent.heading || ""
            const body = currentContent.body || ""
            const highlights = currentContent.highlights || []
            const extra = currentContent.extra || ""
            const paragraphs = body.split(/\n\n+/).filter(Boolean)
            const pageIcon = slug.includes("cover") ? "📋"
              : slug.includes("intro") || slug.includes("sop") ? "✦"
              : slug.includes("personal") || slug.includes("about") ? "👤"
              : slug.includes("edu") ? "🎓"
              : slug.includes("activ") ? "🏆"
              : slug.includes("project") || slug.includes("work") ? "💼"
              : slug.includes("certif") || slug.includes("award") || slug.includes("achiev") ? "🏅"
              : slug.includes("skill") || slug.includes("capab") ? "⚡"
              : slug.includes("goal") || slug.includes("future") || slug.includes("inspir") ? "🎯"
              : slug.includes("thank") || slug.includes("contact") ? "🙏"
              : "📄"

            const cardStyle: React.CSSProperties = {
              borderRadius: 20, border: `1px solid ${border}`, background: cardBg,
              backdropFilter: "blur(12px)",
              boxShadow: isDark ? "0 2px 24px rgba(0,0,0,0.25)" : "0 2px 24px rgba(0,0,0,0.03)",
            }

            return (
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

                {/* Section header */}
                <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 4 }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "1.2rem", background: accentSoft, border: `1px solid ${border}`,
                  }}>
                    {pageIcon}
                  </div>
                  <div style={{ flex: 1 }}>
                    {heading && (
                      <h2
                        className="mp-gradient-text"
                        style={{
                          fontSize: "clamp(1.3rem, 3.5vw, 2rem)", fontWeight: 800,
                          letterSpacing: "-0.03em", lineHeight: 1.2, margin: 0,
                          background: gradientText,
                        }}>
                        {heading}
                      </h2>
                    )}
                  </div>
                </div>

                {/* Body text */}
                {paragraphs.length > 0 && (
                  <div style={{ ...cardStyle, padding: "32px 32px" }}>
                    {paragraphs.map((p, i) => (
                      <p key={i} style={{ color: i === 0 ? text : textSub, lineHeight: 1.9, fontSize: i === 0 ? "1rem" : "0.95rem", margin: i === 0 ? 0 : "16px 0 0" }}>
                        {p}
                      </p>
                    ))}
                  </div>
                )}

                {/* Images gallery */}
                {currentContent.images && currentContent.images.length > 0 && (
                  <div style={{
                    display: "grid",
                    gridTemplateColumns: currentContent.images.length === 1 ? "1fr" : "repeat(auto-fit, minmax(200px, 1fr))",
                    gap: 10, marginBottom: 16,
                  }}>
                    {currentContent.images.map((img, i) => (
                      <div
                        key={i}
                        style={{
                          ...cardStyle,
                          position: "relative", overflow: "hidden", cursor: "pointer",
                          aspectRatio: currentContent.images!.length === 1 ? "16/9" : "4/3",
                        }}
                        onClick={() => setLightbox(img.url)}
                      >
                        <Image
                          src={img.url}
                          alt={img.filename}
                          fill
                          style={{ objectFit: "cover" }}
                        />
                      </div>
                    ))}
                  </div>
                )}

                {/* Highlights — as numbered feature cards */}
                {highlights.length > 0 && (
                  <div style={{
                    display: "grid",
                    gridTemplateColumns: highlights.length <= 3 ? "repeat(auto-fit, minmax(200px, 1fr))" : "repeat(auto-fit, minmax(180px, 1fr))",
                    gap: 12,
                  }}>
                    {highlights.map((h, i) => (
                      <div
                        key={i}
                        style={{
                          ...cardStyle,
                          padding: "20px 20px",
                          display: "flex", alignItems: "flex-start", gap: 14,
                          transition: "all 0.3s",
                          animation: `fade-in-up 0.5s cubic-bezier(.22,1,.36,1) ${i * 0.08}s both`,
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.transform = "translateY(-3px)"
                          e.currentTarget.style.boxShadow = `0 8px 24px ${isDark ? "rgba(0,0,0,0.4)" : "rgba(0,0,0,0.06)"}`
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.transform = "translateY(0)"
                          e.currentTarget.style.boxShadow = isDark ? "0 2px 24px rgba(0,0,0,0.25)" : "0 2px 24px rgba(0,0,0,0.03)"
                        }}
                      >
                        <div style={{
                          width: 32, height: 32, borderRadius: 10, flexShrink: 0,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: "0.7rem", fontWeight: 800,
                          background: accentSoft, color: accent,
                          border: `1px solid ${border}`,
                        }}>
                          {String(i + 1).padStart(2, "0")}
                        </div>
                        <p style={{ fontSize: "0.8rem", fontWeight: 600, color: text, margin: 0, lineHeight: 1.5 }}>
                          {h}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Extra — styled quote block */}
                {extra && (
                  <div style={{
                    ...cardStyle,
                    padding: "28px 32px",
                    display: "flex", gap: 16, alignItems: "flex-start",
                    borderLeft: `3px solid ${accent}`,
                    borderRadius: "0 20px 20px 0",
                  }}>
                    <span style={{ fontSize: "2rem", lineHeight: 1, color: accent, opacity: 0.5, flexShrink: 0, marginTop: -4 }}>"</span>
                    <p style={{ color: textSub, lineHeight: 1.8, fontSize: "0.9rem", fontStyle: "italic", margin: 0 }}>
                      {extra}
                    </p>
                  </div>
                )}

              </div>
            )
          })()}
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
      <div className="print-all-pages" style={{ background: "#ffffff", color: "#111", position: "relative", zIndex: 100 }}>
        {/* Cover / Header */}
        <div style={{ padding: "56px 48px 40px", borderBottom: `3px solid ${ft.accentDark}`, position: "relative" }}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 6, background: ft.gradient }} />
          <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 16 }}>
            {user.avatarUrl && (
              <div style={{ width: 64, height: 64, borderRadius: "50%", overflow: "hidden", border: `3px solid ${ft.accentDark}`, flexShrink: 0 }}>
                <Image src={user.avatarUrl} alt={user.name} width={64} height={64} style={{ objectFit: "cover", width: "100%", height: "100%" }} />
              </div>
            )}
            <div>
              <h1 style={{ fontSize: "2rem", fontWeight: 800, letterSpacing: "-0.03em", margin: 0, color: ft.accentDark }}>{user.name}</h1>
              {user.school && <p style={{ fontSize: "0.9rem", color: "#666", margin: "4px 0 0" }}>{user.school}</p>}
            </div>
          </div>
          {user.bio && <p style={{ fontSize: "0.9rem", color: "#555", lineHeight: 1.7, maxWidth: 600, margin: 0 }}>{user.bio}</p>}
        </div>

        {/* All pages */}
        {pages.map((pg) => {
          const c = pg.content
          const pIcon = pg.slug.includes("intro") || pg.slug.includes("sop") ? "✦"
            : pg.slug.includes("edu") ? "🎓" : pg.slug.includes("activ") ? "🏆"
            : pg.slug.includes("achiev") || pg.slug.includes("certif") ? "🏅"
            : pg.slug.includes("skill") ? "⚡" : pg.slug.includes("goal") ? "🎯" : "📄"
          const bodyParagraphs = (c.body || "").split(/\n\n+/).filter(Boolean)

          return (
            <div key={pg.id} className="print-page" style={{ padding: "40px 48px" }}>
              {/* Page section header */}
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                <span style={{ fontSize: "1.2rem" }}>{pIcon}</span>
                {c.heading && (
                  <h2 style={{ fontSize: "1.4rem", fontWeight: 800, letterSpacing: "-0.02em", margin: 0, color: ft.accentDark }}>
                    {c.heading}
                  </h2>
                )}
              </div>
              <div style={{ height: 2, background: ft.gradient, marginBottom: 20, borderRadius: 1 }} />

              {/* Body paragraphs */}
              {bodyParagraphs.map((p, i) => (
                <p key={i} style={{ fontSize: "0.88rem", color: i === 0 ? "#333" : "#555", lineHeight: 1.85, margin: i === 0 ? "0 0 12px" : "12px 0 0" }}>
                  {p}
                </p>
              ))}

              {/* Images in print */}
              {c.images?.length ? (
                <div style={{ marginTop: 16, display: "grid", gridTemplateColumns: c.images.length === 1 ? "1fr" : "1fr 1fr", gap: 8 }}>
                  {c.images.map((img: PageImage, idx: number) => (
                    <div key={idx} style={{ borderRadius: 8, overflow: "hidden", border: "1px solid #e5e7eb" }}>
                      <Image src={img.url} alt={img.filename} width={400} height={250} style={{ width: "100%", height: "auto", objectFit: "cover", display: "block" }} />
                    </div>
                  ))}
                </div>
              ) : null}

              {/* Highlights as numbered list */}
              {c.highlights?.length ? (
                <div style={{ marginTop: 20, display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 24px" }}>
                  {c.highlights.map((h: string, i: number) => (
                    <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8, padding: "6px 0" }}>
                      <span style={{ width: 22, height: 22, borderRadius: 6, background: ft.accentSoft, color: ft.accentDark, fontSize: "0.65rem", fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, border: `1px solid ${ft.accentDark}20` }}>
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span style={{ fontSize: "0.82rem", fontWeight: 500, color: "#374151", lineHeight: 1.4 }}>{h}</span>
                    </div>
                  ))}
                </div>
              ) : null}

              {/* Extra quote */}
              {c.extra && (
                <div style={{ marginTop: 20, fontSize: "0.82rem", color: "#555", lineHeight: 1.7, borderLeft: `3px solid ${ft.accentDark}`, padding: "10px 16px", background: `${ft.accentSoft}`, borderRadius: "0 8px 8px 0" }}>
                  {c.extra}
                </div>
              )}
            </div>
          )
        })}

        {/* Print footer */}
        <div style={{ textAlign: "center", padding: "20px 48px", borderTop: `2px solid ${ft.accentDark}`, fontSize: "0.7rem", color: "#9ca3af" }}>
          Built with <span style={{ fontWeight: 700, color: ft.accentDark }}>FolioForge</span>
        </div>
      </div>
    </div>
  )
}
