"use client"
import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
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

export function MultiPagePortfolioClient({ user, pages, currentSlug, currentContent }: Props) {
  const [menuOpen, setMenuOpen] = useState(false)
  const isDark = user.theme === "dark"
  const bg = isDark ? "#0a0a0a" : "#ffffff"
  const text = isDark ? "#f0f0f0" : "#111111"
  const textSub = isDark ? "#888888" : "#666666"
  const border = isDark ? "#222" : "#ebebeb"
  const accent = isDark ? "#ffffff" : "#111111"

  return (
    <div style={{ minHeight: "100vh", background: bg, color: text, fontFamily: "var(--font-geist-sans, sans-serif)" }}>
      {/* Particle background */}
      <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}>
        <ParticleBackground dark={isDark} />
      </div>

      {/* Navbar */}
      <header
        className="no-print"
        style={{
          position: "sticky", top: 0, zIndex: 50,
          background: isDark ? "rgba(10,10,10,0.85)" : "rgba(255,255,255,0.85)",
          backdropFilter: "blur(12px)",
          borderBottom: `1px solid ${border}`,
        }}
      >
        <div style={{ maxWidth: 960, margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 60 }}>
          {/* Logo / Name */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Link href="/" style={{ fontSize: "0.75rem", fontWeight: 700, color: isDark ? "#666" : "#aaa", textDecoration: "none", letterSpacing: "-0.01em", transition: "color 0.15s" }}
              onMouseEnter={e => (e.currentTarget.style.color = isDark ? "#fff" : "#111")}
              onMouseLeave={e => (e.currentTarget.style.color = isDark ? "#666" : "#aaa")}
            >
              FolioForge
            </Link>
            <span style={{ color: border, fontSize: "0.75rem" }}>·</span>
            <Link href={`/portfolio/${user.username}`} style={{ fontWeight: 800, fontSize: "1rem", letterSpacing: "-0.03em", color: text, textDecoration: "none" }}>
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
                  padding: "6px 14px",
                  borderRadius: 8,
                  fontSize: "0.8125rem",
                  fontWeight: 500,
                  textDecoration: "none",
                  transition: "all 0.15s",
                  background: pg.slug === currentSlug ? accent : "transparent",
                  color: pg.slug === currentSlug ? bg : textSub,
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
              style={{ fontSize: "0.75rem", padding: "6px 12px", border: `1px solid ${border}`, borderRadius: 8, color: textSub, background: "transparent", cursor: "pointer" }}
            >
              PDF
            </button>
            {/* Mobile menu */}
            <button
              onClick={() => setMenuOpen(o => !o)}
              className="sm:hidden"
              style={{ color: text, background: "none", border: "none", cursor: "pointer", fontSize: "1.25rem" }}
            >
              {menuOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {menuOpen && (
          <div style={{ borderTop: `1px solid ${border}`, padding: "12px 24px", display: "flex", flexDirection: "column", gap: 4 }} className="sm:hidden">
            {pages.map(pg => (
              <Link
                key={pg.slug}
                href={`/portfolio/${user.username}/${pg.slug}`}
                onClick={() => setMenuOpen(false)}
                style={{
                  padding: "10px 14px",
                  borderRadius: 8,
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  textDecoration: "none",
                  background: pg.slug === currentSlug ? accent : "transparent",
                  color: pg.slug === currentSlug ? bg : textSub,
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
          <div style={{ marginBottom: 64 }}>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 20, marginBottom: 24 }}>
              {user.avatarUrl && (
                <div style={{ width: 80, height: 80, borderRadius: "50%", overflow: "hidden", border: `2px solid ${border}`, flexShrink: 0 }}>
                  <Image src={user.avatarUrl} alt={user.name} width={80} height={80} style={{ objectFit: "cover", width: "100%", height: "100%" }} />
                </div>
              )}
              <div>
                <h1 style={{ fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1.1, margin: 0 }}>
                  {user.name}
                </h1>
                {user.school && (
                  <p style={{ margin: "8px 0 0", color: textSub, fontSize: "0.9rem" }}>{user.school}</p>
                )}
              </div>
            </div>
            {user.bio && (
              <p style={{ color: textSub, lineHeight: 1.7, maxWidth: 640, margin: 0, fontSize: "1rem" }}>{user.bio}</p>
            )}
            <div style={{ height: 1, background: border, margin: "40px 0 0" }} />
          </div>
        )}

        {/* Page heading */}
        {currentContent.heading && (
          <h2 style={{ fontSize: "clamp(1.5rem, 4vw, 2.5rem)", fontWeight: 800, letterSpacing: "-0.03em", marginBottom: 24, lineHeight: 1.15 }}>
            {currentContent.heading}
          </h2>
        )}

        {/* Body */}
        {currentContent.body && (
          <div style={{ color: textSub, lineHeight: 1.8, fontSize: "1rem", marginBottom: 32, whiteSpace: "pre-wrap" }}>
            {currentContent.body}
          </div>
        )}

        {/* Highlights */}
        {currentContent.highlights?.length ? (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 32 }}>
            {currentContent.highlights.map((h: string, i: number) => (
              <span key={i} style={{
                padding: "8px 16px",
                borderRadius: 100,
                border: `1px solid ${border}`,
                fontSize: "0.8125rem",
                fontWeight: 500,
                color: text,
              }}>
                {h}
              </span>
            ))}
          </div>
        ) : null}

        {/* Extra */}
        {currentContent.extra && (
          <p style={{ color: textSub, lineHeight: 1.7, fontSize: "0.9375rem", borderLeft: `3px solid ${border}`, paddingLeft: 20, margin: "32px 0 0" }}>
            {currentContent.extra}
          </p>
        )}

        {/* Page navigation */}
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 80, paddingTop: 32, borderTop: `1px solid ${border}` }}>
          {(() => {
            const idx = pages.findIndex(p => p.slug === currentSlug)
            const prev = idx > 0 ? pages[idx - 1] : null
            const next = idx < pages.length - 1 ? pages[idx + 1] : null
            return (
              <>
                {prev ? (
                  <Link href={`/portfolio/${user.username}/${prev.slug}`} style={{ color: textSub, textDecoration: "none", fontSize: "0.8125rem", fontWeight: 500 }}>
                    ← {prev.title}
                  </Link>
                ) : <span />}
                {next ? (
                  <Link href={`/portfolio/${user.username}/${next.slug}`} style={{ color: textSub, textDecoration: "none", fontSize: "0.8125rem", fontWeight: 500 }}>
                    {next.title} →
                  </Link>
                ) : <span />}
              </>
            )
          })()}
        </div>
      </main>

      {/* Footer */}
      <footer className="no-print" style={{ position: "relative", zIndex: 10, textAlign: "center", paddingBottom: 32, borderTop: `1px solid ${border}` }}>
        <p style={{ color: textSub, fontSize: "0.75rem", marginTop: 24 }}>
          Built with <a href="/" style={{ color: textSub, textDecoration: "underline" }}>FolioForge</a>
        </p>
      </footer>
    </div>
  )
}
