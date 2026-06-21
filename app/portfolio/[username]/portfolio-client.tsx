"use client"
import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { ParticleBackground } from "@/components/particle-background"

interface PortfolioFile { id: string; url: string; filename: string; type: string }
interface Project {
  id: string; title: string; description: string; tags: string[]
  externalUrl: string | null; date: string | null; files: PortfolioFile[]
}
interface User {
  name: string; username: string; bio: string; school: string; gpa: string
  avatarUrl: string; theme: string; contactLinks: Record<string, string>
}

const THEMES = ["minimal", "dark", "classic"]
const THEME_LABELS: Record<string, string> = { minimal: "Minimal", dark: "Dark", classic: "Classic" }
const CONTACT_ICONS: Record<string, string> = {
  linkedin: "in", github: "GH", website: "🌐", phone: "📞"
}
const CONTACT_LABELS: Record<string, string> = {
  linkedin: "LinkedIn", github: "GitHub", website: "Website", phone: "Phone"
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

export function PortfolioClient({ user, projects }: { user: User; projects: Project[] }) {
  const [theme, setTheme] = useState(user.theme || "minimal")
  const [lightboxImg, setLightboxImg] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  const isDark = theme === "dark"

  const headerView = useInView()
  const projectsView = useInView()

  useEffect(() => {
    setMounted(true)
  }, [])

  const bg = isDark ? "#07070f" : "#ffffff"
  const text = isDark ? "#f0f0f0" : "#111111"
  const textSub = isDark ? "#9ca3af" : "#6b7280"
  const border = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)"
  const cardBg = isDark ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.8)"
  const accent = isDark ? "#818cf8" : "#6366f1"
  const accentSoft = isDark ? "rgba(129,140,248,0.12)" : "rgba(99,102,241,0.08)"

  return (
    <>
      <style>{`
        @keyframes aurora-1{0%,100%{transform:translate(0,0) scale(1)}33%{transform:translate(60px,-40px) scale(1.1)}66%{transform:translate(-30px,20px) scale(0.95)}}
        @keyframes aurora-2{0%,100%{transform:translate(0,0) scale(1)}33%{transform:translate(-50px,30px) scale(1.05)}66%{transform:translate(40px,-20px) scale(1.1)}}
        @keyframes aurora-3{0%,100%{transform:translate(0,0) scale(1.05)}50%{transform:translate(30px,40px) scale(0.95)}}
        @keyframes fade-in-up{from{opacity:0;transform:translateY(40px)}to{opacity:1;transform:translateY(0)}}
        @keyframes fade-in-scale{from{opacity:0;transform:scale(0.92)}to{opacity:1;transform:scale(1)}}
        @keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
        @keyframes float-avatar{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
        .pf-fade-up{opacity:0;transform:translateY(32px);transition:opacity .7s cubic-bezier(.22,1,.36,1),transform .7s cubic-bezier(.22,1,.36,1)}
        .pf-fade-up.in{opacity:1;transform:translateY(0)}
        .pf-card{transition:all .4s cubic-bezier(.22,1,.36,1)}
        .pf-card:hover{transform:translateY(-6px)}
        .pf-img-zoom{transition:transform .7s cubic-bezier(.22,1,.36,1)}
        .pf-img-zoom:hover{transform:scale(1.08)}
        .pf-tag{transition:all .25s ease}
        .pf-tag:hover{transform:translateY(-2px)}
      `}</style>

      {/* Lightbox */}
      {lightboxImg && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 cursor-zoom-out"
          style={{ background: "rgba(0,0,0,0.92)", backdropFilter: "blur(20px)" }}
          onClick={() => setLightboxImg(null)}
        >
          <button
            className="absolute top-6 right-6 w-11 h-11 rounded-full flex items-center justify-center text-white/70 hover:text-white hover:rotate-90 transition-all duration-300"
            style={{ background: "rgba(255,255,255,0.1)", backdropFilter: "blur(10px)" }}
            onClick={() => setLightboxImg(null)}
          >
            ✕
          </button>
          <img
            src={lightboxImg} alt=""
            className="max-w-full max-h-full object-contain rounded-2xl"
            style={{ animation: "fade-in-scale 0.3s ease-out", boxShadow: "0 25px 80px rgba(0,0,0,0.5)" }}
          />
        </div>
      )}

      <div style={{ backgroundColor: bg, color: text, minHeight: "100vh", position: "relative", overflow: "hidden" }}>

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

        {/* Glassmorphism top bar */}
        <div
          className="no-print"
          style={{
            position: "sticky", top: 0, zIndex: 50,
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "0 24px", height: 60,
            borderBottom: `1px solid ${border}`,
            background: isDark ? "rgba(7,7,15,0.80)" : "rgba(255,255,255,0.80)",
            backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
          }}
        >
          <Link
            href="/"
            style={{ fontSize: "0.8rem", fontWeight: 800, letterSpacing: "-0.02em", textDecoration: "none", color: accent, opacity: 0.7, transition: "opacity 0.2s" }}
            onMouseEnter={e => (e.currentTarget.style.opacity = "1")}
            onMouseLeave={e => (e.currentTarget.style.opacity = "0.7")}
          >
            FolioForge
          </Link>

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ display: "flex", gap: 2, padding: 3, borderRadius: 12, background: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)" }}>
              {THEMES.map((t) => (
                <button
                  key={t}
                  onClick={() => setTheme(t)}
                  style={{
                    fontSize: "0.75rem", padding: "6px 14px", borderRadius: 9, border: "none", cursor: "pointer",
                    fontWeight: 600, transition: "all 0.25s",
                    background: theme === t
                      ? (isDark ? "rgba(129,140,248,0.2)" : "rgba(99,102,241,0.1)")
                      : "transparent",
                    color: theme === t ? accent : textSub,
                    boxShadow: theme === t ? `0 2px 8px ${isDark ? "rgba(129,140,248,0.15)" : "rgba(99,102,241,0.1)"}` : "none",
                  }}
                >
                  {THEME_LABELS[t]}
                </button>
              ))}
            </div>
            <button
              onClick={() => window.print()}
              style={{
                fontSize: "0.75rem", padding: "6px 14px", borderRadius: 9, cursor: "pointer",
                border: `1px solid ${border}`, color: textSub, fontWeight: 600,
                background: "transparent", transition: "all 0.2s",
              }}
              onMouseEnter={e => { e.currentTarget.style.background = accentSoft; e.currentTarget.style.color = accent }}
              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = textSub }}
            >
              PDF ↓
            </button>
          </div>
        </div>

        {/* Main content */}
        <div style={{ position: "relative", zIndex: 10, maxWidth: 900, margin: "0 auto", padding: "60px 24px 96px" }}>

          {/* Header section */}
          <div
            ref={headerView.ref}
            className={`pf-fade-up ${mounted && headerView.inView ? "in" : ""}`}
          >
            <header style={{ marginBottom: 64 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 24, marginBottom: 28 }}>
                {user.avatarUrl && (
                  <div style={{
                    width: 88, height: 88, borderRadius: 20, overflow: "hidden", flexShrink: 0,
                    border: `2px solid ${border}`,
                    boxShadow: `0 8px 32px ${isDark ? "rgba(129,140,248,0.15)" : "rgba(99,102,241,0.12)"}`,
                    animation: "float-avatar 4s ease-in-out infinite",
                  }}>
                    <Image src={user.avatarUrl} alt={user.name} width={88} height={88} style={{ objectFit: "cover", width: "100%", height: "100%" }} />
                  </div>
                )}
                <div>
                  <h1 style={{
                    fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 800, letterSpacing: "-0.04em",
                    lineHeight: 1.1, margin: 0,
                    background: isDark
                      ? "linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 30%, #a5b4fc 60%, #818cf8 100%)"
                      : "linear-gradient(135deg, #312e81 0%, #4338ca 30%, #6366f1 60%, #818cf8 100%)",
                    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}>
                    {user.name}
                  </h1>
                  {(user.school || user.gpa) && (
                    <p style={{ margin: "10px 0 0", color: textSub, fontSize: "0.9rem", fontWeight: 500 }}>
                      {user.school}{user.gpa ? ` · GPA ${user.gpa}` : ""}
                    </p>
                  )}
                </div>
              </div>

              {user.bio && (
                <p style={{ color: textSub, lineHeight: 1.8, maxWidth: 640, margin: "0 0 28px", fontSize: "1rem" }}>
                  {user.bio}
                </p>
              )}

              {Object.keys(user.contactLinks).length > 0 && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                  {Object.entries(user.contactLinks).filter(([, v]) => v).map(([k, v]) => (
                    <a
                      key={k}
                      href={k === "phone" ? `tel:${v}` : v}
                      target={k !== "phone" ? "_blank" : undefined}
                      rel="noopener noreferrer"
                      style={{
                        display: "inline-flex", alignItems: "center", gap: 8,
                        fontSize: "0.8rem", fontWeight: 600,
                        padding: "8px 18px", borderRadius: 12,
                        border: `1px solid ${border}`,
                        background: cardBg,
                        backdropFilter: "blur(10px)",
                        color: accent, textDecoration: "none",
                        transition: "all 0.25s",
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.background = accentSoft
                        e.currentTarget.style.transform = "translateY(-2px)"
                        e.currentTarget.style.boxShadow = `0 4px 16px ${isDark ? "rgba(129,140,248,0.15)" : "rgba(99,102,241,0.1)"}`
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.background = cardBg
                        e.currentTarget.style.transform = "translateY(0)"
                        e.currentTarget.style.boxShadow = "none"
                      }}
                    >
                      <span style={{ width: 24, height: 24, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.7rem", fontWeight: 800, background: accentSoft }}>
                        {CONTACT_ICONS[k] || "→"}
                      </span>
                      {CONTACT_LABELS[k] || k}
                    </a>
                  ))}
                </div>
              )}
            </header>

            {/* Gradient divider */}
            <div style={{
              height: 1, marginBottom: 56,
              background: isDark
                ? "linear-gradient(90deg, transparent, rgba(129,140,248,0.3), transparent)"
                : "linear-gradient(90deg, transparent, rgba(99,102,241,0.2), transparent)",
            }} />
          </div>

          {/* Projects section */}
          <section>
            <div
              ref={projectsView.ref}
              className={`pf-fade-up ${mounted && projectsView.inView ? "in" : ""}`}
              style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 40 }}
            >
              <h2 style={{
                fontSize: "0.75rem", fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase",
                color: accent,
              }}>
                Projects
              </h2>
              <span style={{
                fontSize: "0.75rem", fontWeight: 700,
                padding: "4px 14px", borderRadius: 100,
                background: accentSoft, color: accent,
              }}>
                {projects.length}
              </span>
            </div>

            {projects.length === 0 ? (
              <div style={{
                textAlign: "center", padding: "80px 32px",
                borderRadius: 24, border: `2px dashed ${border}`,
                background: cardBg,
              }}>
                <div style={{ fontSize: "3rem", marginBottom: 16, opacity: 0.5 }}>📁</div>
                <p style={{ color: textSub, fontSize: "0.9rem" }}>ยังไม่มีโปรเจกต์สาธารณะ</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
                {projects.map((project, i) => {
                  const images = project.files.filter((f) => f.type === "image")
                  const pdfs = project.files.filter((f) => f.type === "pdf")
                  const dateStr = project.date
                    ? new Date(project.date).toLocaleDateString("th-TH", { year: "numeric", month: "long" })
                    : null
                  return (
                    <article
                      key={project.id}
                      className="pf-card"
                      style={{
                        borderRadius: 20, overflow: "hidden",
                        border: `1px solid ${border}`,
                        background: cardBg,
                        backdropFilter: "blur(12px)",
                        boxShadow: isDark
                          ? "0 4px 24px rgba(0,0,0,0.3)"
                          : "0 4px 24px rgba(0,0,0,0.04)",
                        animation: `fade-in-up 0.6s cubic-bezier(.22,1,.36,1) ${i * 0.1}s both`,
                      }}
                    >
                      {/* Images */}
                      {images.length > 0 && (
                        <div style={{
                          display: images.length > 1 ? "grid" : "block",
                          gridTemplateColumns: images.length > 1 ? "1fr 1fr" : undefined,
                          gap: 2, overflow: "hidden",
                        }}>
                          {images.map((img, idx) => (
                            <div
                              key={img.id}
                              onClick={() => setLightboxImg(img.url)}
                              className="pf-img-zoom"
                              style={{
                                position: "relative", overflow: "hidden", cursor: "zoom-in",
                                aspectRatio: images.length === 1 ? "16/9" : (images.length === 3 && idx === 0 ? "16/9" : "1"),
                                gridColumn: images.length === 3 && idx === 0 ? "1 / -1" : undefined,
                                background: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)",
                              }}
                            >
                              <Image
                                src={img.url} alt={img.filename} fill
                                style={{ objectFit: "cover" }}
                              />
                              <div style={{
                                position: "absolute", inset: 0,
                                background: "linear-gradient(to top, rgba(0,0,0,0.15), transparent)",
                                opacity: 0, transition: "opacity 0.3s",
                              }}
                                onMouseEnter={e => (e.currentTarget.style.opacity = "1")}
                                onMouseLeave={e => (e.currentTarget.style.opacity = "0")}
                              />
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Content */}
                      <div style={{ padding: "24px 28px 28px" }}>
                        {/* Title row */}
                        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, marginBottom: 10 }}>
                          <h3 style={{ fontSize: "1.2rem", fontWeight: 800, letterSpacing: "-0.02em", color: text, margin: 0 }}>
                            {project.title}
                          </h3>
                          {dateStr && (
                            <span style={{
                              fontSize: "0.7rem", fontWeight: 600, flexShrink: 0, marginTop: 4,
                              padding: "4px 10px", borderRadius: 8,
                              background: accentSoft, color: accent,
                            }}>
                              {dateStr}
                            </span>
                          )}
                        </div>

                        <p style={{ color: textSub, fontSize: "0.875rem", lineHeight: 1.8, marginBottom: 16 }}>
                          {project.description}
                        </p>

                        {project.tags.length > 0 && (
                          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
                            {project.tags.map((tag) => (
                              <span
                                key={tag}
                                className="pf-tag"
                                style={{
                                  fontSize: "0.75rem", padding: "5px 14px", borderRadius: 100,
                                  fontWeight: 600, border: `1px solid ${border}`,
                                  background: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.02)",
                                  color: textSub,
                                }}
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}

                        {(project.externalUrl || pdfs.length > 0) && (
                          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, paddingTop: 16, borderTop: `1px solid ${border}` }}>
                            {project.externalUrl && (
                              <a
                                href={project.externalUrl} target="_blank" rel="noopener noreferrer"
                                style={{
                                  display: "inline-flex", alignItems: "center", gap: 6,
                                  fontSize: "0.8rem", fontWeight: 700,
                                  padding: "8px 20px", borderRadius: 12,
                                  background: isDark
                                    ? "linear-gradient(135deg, rgba(99,102,241,0.2), rgba(139,92,246,0.2))"
                                    : "linear-gradient(135deg, rgba(99,102,241,0.1), rgba(139,92,246,0.1))",
                                  color: accent, textDecoration: "none",
                                  transition: "all 0.25s",
                                }}
                                onMouseEnter={e => {
                                  e.currentTarget.style.transform = "translateY(-2px)"
                                  e.currentTarget.style.boxShadow = `0 4px 16px ${isDark ? "rgba(129,140,248,0.2)" : "rgba(99,102,241,0.15)"}`
                                }}
                                onMouseLeave={e => {
                                  e.currentTarget.style.transform = "translateY(0)"
                                  e.currentTarget.style.boxShadow = "none"
                                }}
                              >
                                View Project ↗
                              </a>
                            )}
                            {pdfs.map((pdf) => (
                              <a
                                key={pdf.id} href={pdf.url} target="_blank" rel="noopener noreferrer"
                                style={{
                                  display: "inline-flex", alignItems: "center", gap: 6,
                                  fontSize: "0.8rem", fontWeight: 700,
                                  padding: "8px 20px", borderRadius: 12,
                                  border: `1px solid ${border}`,
                                  background: cardBg,
                                  color: accent, textDecoration: "none",
                                  transition: "all 0.25s",
                                }}
                                onMouseEnter={e => (e.currentTarget.style.transform = "translateY(-2px)")}
                                onMouseLeave={e => (e.currentTarget.style.transform = "translateY(0)")}
                              >
                                PDF ↗
                              </a>
                            ))}
                          </div>
                        )}
                      </div>
                    </article>
                  )
                })}
              </div>
            )}
          </section>

          {/* Footer */}
          <footer style={{ marginTop: 80, paddingTop: 32, textAlign: "center" }}>
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
          </footer>
        </div>
      </div>
    </>
  )
}
