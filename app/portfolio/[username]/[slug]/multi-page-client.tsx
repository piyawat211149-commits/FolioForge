"use client"
import Link from "next/link"
import Image from "next/image"
import { useState, useEffect, useRef } from "react"
import { ParticleBackground } from "@/components/particle-background"
import { LanguageToggle } from "@/components/language-toggle"

interface PageItem { id: string; title: string; slug: string; content: PageContent }
interface PageContent {
  heading?: string
  body?: string
  highlights?: string[]
  extra?: string
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

export function MultiPagePortfolioClient({ user, pages, currentSlug, currentContent }: Props) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const isDark = user.theme === "dark"

  const headerView = useInView()
  const contentView = useInView()
  const navView = useInView()

  useEffect(() => { setMounted(true) }, [])

  const bg = isDark ? "#07070f" : "#ffffff"
  const text = isDark ? "#f0f0f0" : "#111111"
  const textSub = isDark ? "#9ca3af" : "#6b7280"
  const border = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)"
  const cardBg = isDark ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.8)"
  const accent = isDark ? "#818cf8" : "#6366f1"
  const accentSoft = isDark ? "rgba(129,140,248,0.12)" : "rgba(99,102,241,0.08)"

  return (
    <div style={{ minHeight: "100vh", background: bg, color: text, fontFamily: "var(--font-geist-sans, sans-serif)", position: "relative", overflow: "hidden" }}>

      <style>{`
        @keyframes aurora-1{0%,100%{transform:translate(0,0) scale(1)}33%{transform:translate(60px,-40px) scale(1.1)}66%{transform:translate(-30px,20px) scale(0.95)}}
        @keyframes aurora-2{0%,100%{transform:translate(0,0) scale(1)}33%{transform:translate(-50px,30px) scale(1.05)}66%{transform:translate(40px,-20px) scale(1.1)}}
        @keyframes aurora-3{0%,100%{transform:translate(0,0) scale(1.05)}50%{transform:translate(30px,40px) scale(0.95)}}
        @keyframes fade-in-up{from{opacity:0;transform:translateY(40px)}to{opacity:1;transform:translateY(0)}}
        @keyframes float-avatar{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
        .mp-fade-up{opacity:0;transform:translateY(32px);transition:opacity .7s cubic-bezier(.22,1,.36,1),transform .7s cubic-bezier(.22,1,.36,1)}
        .mp-fade-up.in{opacity:1;transform:translateY(0)}
        .mp-d1{transition-delay:.08s}.mp-d2{transition-delay:.18s}.mp-d3{transition-delay:.28s}
        .mp-gradient-text{-webkit-background-clip:text!important;background-clip:text!important;-webkit-text-fill-color:transparent;color:transparent}
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

      {/* Glassmorphism Navbar */}
      <header
        className="no-print"
        style={{
          position: "sticky", top: 0, zIndex: 50,
          background: isDark ? "rgba(7,7,15,0.80)" : "rgba(255,255,255,0.80)",
          backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
          borderBottom: `1px solid ${border}`,
        }}
      >
        <div style={{ maxWidth: 960, margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 60 }}>
          {/* Logo / Name */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Link
              href="/"
              style={{ fontSize: "0.8rem", fontWeight: 800, color: accent, textDecoration: "none", opacity: 0.7, transition: "opacity 0.2s" }}
              onMouseEnter={e => (e.currentTarget.style.opacity = "1")}
              onMouseLeave={e => (e.currentTarget.style.opacity = "0.7")}
            >
              FolioForge
            </Link>
            <span style={{ color: border, fontSize: "0.75rem" }}>·</span>
            <Link
              href={`/portfolio/${user.username}`}
              className="mp-gradient-text"
              style={{
                fontWeight: 800, fontSize: "1rem", letterSpacing: "-0.03em", textDecoration: "none",
                background: isDark
                  ? "linear-gradient(135deg, #e0e7ff, #a5b4fc)"
                  : "linear-gradient(135deg, #312e81, #6366f1)",
              }}
            >
              {user.name}
            </Link>
          </div>

          {/* Desktop nav */}
          <nav style={{ display: "flex", gap: 4, alignItems: "center" }} className="hidden sm:flex">
            {pages.map(pg => (
              <Link
                key={pg.slug}
                href={`/portfolio/${user.username}/${pg.slug}`}
                style={{
                  padding: "7px 16px", borderRadius: 10,
                  fontSize: "0.8125rem", fontWeight: 600,
                  textDecoration: "none", transition: "all 0.25s",
                  background: pg.slug === currentSlug
                    ? (isDark ? "linear-gradient(135deg, rgba(99,102,241,0.25), rgba(139,92,246,0.25))" : "linear-gradient(135deg, rgba(99,102,241,0.12), rgba(139,92,246,0.12))")
                    : "transparent",
                  color: pg.slug === currentSlug ? accent : textSub,
                  boxShadow: pg.slug === currentSlug
                    ? `0 2px 10px ${isDark ? "rgba(129,140,248,0.15)" : "rgba(99,102,241,0.1)"}`
                    : "none",
                }}
              >
                {pg.title}
              </Link>
            ))}
          </nav>

          {/* Right actions */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <LanguageToggle />
            <button
              onClick={() => window.print()}
              className="no-print"
              style={{
                fontSize: "0.75rem", padding: "6px 14px",
                border: `1px solid ${border}`, borderRadius: 10,
                color: textSub, background: "transparent", cursor: "pointer",
                fontWeight: 600, transition: "all 0.2s",
              }}
              onMouseEnter={e => { e.currentTarget.style.background = accentSoft; e.currentTarget.style.color = accent }}
              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = textSub }}
            >
              PDF ↓
            </button>
            {/* Mobile menu */}
            <button
              onClick={() => setMenuOpen(o => !o)}
              className="sm:hidden"
              style={{
                color: text, background: "none", border: "none", cursor: "pointer",
                fontSize: "1.25rem", transition: "transform 0.3s",
                transform: menuOpen ? "rotate(90deg)" : "rotate(0deg)",
              }}
            >
              {menuOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {menuOpen && (
          <div style={{
            borderTop: `1px solid ${border}`, padding: "12px 24px",
            display: "flex", flexDirection: "column", gap: 4,
            background: isDark ? "rgba(7,7,15,0.95)" : "rgba(255,255,255,0.95)",
            backdropFilter: "blur(20px)",
            animation: "fade-in-up 0.3s ease-out",
          }} className="sm:hidden">
            {pages.map(pg => (
              <Link
                key={pg.slug}
                href={`/portfolio/${user.username}/${pg.slug}`}
                onClick={() => setMenuOpen(false)}
                style={{
                  padding: "12px 16px", borderRadius: 12,
                  fontSize: "0.875rem", fontWeight: 600,
                  textDecoration: "none", transition: "all 0.2s",
                  background: pg.slug === currentSlug
                    ? (isDark ? "rgba(129,140,248,0.15)" : "rgba(99,102,241,0.08)")
                    : "transparent",
                  color: pg.slug === currentSlug ? accent : textSub,
                }}
              >
                {pg.title}
              </Link>
            ))}
          </div>
        )}
      </header>

      {/* Page content */}
      <main style={{ position: "relative", zIndex: 10, maxWidth: 800, margin: "0 auto", padding: "64px 24px 96px" }}>

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
                    background: isDark
                      ? "linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 30%, #a5b4fc 60%, #818cf8 100%)"
                      : "linear-gradient(135deg, #312e81 0%, #4338ca 30%, #6366f1 60%, #818cf8 100%)",
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
          {/* Page heading */}
          {currentContent.heading && (
            <h2
              className="mp-gradient-text"
              style={{
                fontSize: "clamp(1.5rem, 4vw, 2.5rem)", fontWeight: 800,
                letterSpacing: "-0.03em", marginBottom: 28, lineHeight: 1.15,
                background: isDark
                  ? "linear-gradient(135deg, #e0e7ff, #a5b4fc)"
                  : "linear-gradient(135deg, #312e81, #6366f1)",
              }}>
              {currentContent.heading}
            </h2>
          )}

          {/* Body */}
          {currentContent.body && (
            <div style={{ color: textSub, lineHeight: 1.9, fontSize: "1rem", marginBottom: 32, whiteSpace: "pre-wrap" }}>
              {currentContent.body}
            </div>
          )}

          {/* Highlights */}
          {currentContent.highlights?.length ? (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 32 }}>
              {currentContent.highlights.map((h: string, i: number) => (
                <span key={i} style={{
                  padding: "8px 20px", borderRadius: 100,
                  border: `1px solid ${border}`,
                  fontSize: "0.8125rem", fontWeight: 600,
                  color: accent,
                  background: accentSoft,
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

          {/* Extra */}
          {currentContent.extra && (
            <div style={{
              color: textSub, lineHeight: 1.8, fontSize: "0.9375rem",
              borderLeft: `3px solid ${accent}`, paddingLeft: 24,
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
      </main>

      {/* Footer */}
      <footer className="no-print" style={{ position: "relative", zIndex: 10, textAlign: "center", paddingBottom: 40 }}>
        <div style={{
          height: 1, maxWidth: 800, margin: "0 auto 32px",
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
      </footer>
    </div>
  )
}
