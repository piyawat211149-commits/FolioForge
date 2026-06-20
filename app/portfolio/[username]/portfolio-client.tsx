"use client"
import { useState } from "react"
import Image from "next/image"
import Link from "next/link"

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

const CONTACT_LABELS: Record<string, string> = {
  linkedin: "LinkedIn", github: "GitHub", website: "Website", phone: "Phone"
}

export function PortfolioClient({ user, projects }: { user: User; projects: Project[] }) {
  const [theme, setTheme] = useState(user.theme || "minimal")
  const [lightboxImg, setLightboxImg] = useState<string | null>(null)

  const isDark = theme === "dark"
  const isClassic = theme === "classic"

  return (
    <>
      {lightboxImg && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 cursor-zoom-out"
          onClick={() => setLightboxImg(null)}
        >
          <button
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
            onClick={() => setLightboxImg(null)}
          >
            ✕
          </button>
          <img src={lightboxImg} alt="" className="max-w-full max-h-full object-contain rounded-lg" />
        </div>
      )}

      <div data-theme={theme} style={{ backgroundColor: "var(--pt-bg)", color: "var(--pt-text)", minHeight: "100vh" }}>

        {/* Top bar */}
        <div
          className="no-print flex items-center justify-between px-6 py-3 border-b sticky top-0 z-40"
          style={{
            borderColor: "var(--pt-border)",
            backgroundColor: isDark ? "rgba(10,10,10,0.85)" : isClassic ? "rgba(253,248,239,0.85)" : "rgba(255,255,255,0.85)",
            backdropFilter: "blur(12px)",
          }}
        >
          <Link href="/" className="text-xs font-bold tracking-tight opacity-40 hover:opacity-80 transition-opacity" style={{ color: "var(--pt-text)" }}>
            FolioForge
          </Link>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 rounded-xl p-1" style={{ backgroundColor: "var(--pt-border)", opacity: 0.6 }}>
              {THEMES.map((t) => (
                <button
                  key={t}
                  onClick={() => setTheme(t)}
                  className="text-xs px-3 py-1.5 rounded-lg transition-all font-medium"
                  style={{
                    backgroundColor: theme === t ? "var(--pt-bg)" : "transparent",
                    color: "var(--pt-text)",
                    boxShadow: theme === t ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
                  }}
                >
                  {THEME_LABELS[t]}
                </button>
              ))}
            </div>
            <button
              onClick={() => window.print()}
              className="text-xs px-3 py-1.5 rounded-lg border transition-colors font-medium"
              style={{ borderColor: "var(--pt-border)", color: "var(--pt-text2)" }}
            >
              PDF
            </button>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-6 py-16">
          {/* Header */}
          <header className="mb-16">
            <div className="flex items-start gap-6 mb-8">
              {user.avatarUrl && (
                <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0" style={{ border: "2px solid var(--pt-border)" }}>
                  <Image src={user.avatarUrl} alt={user.name} width={80} height={80} className="object-cover w-full h-full" />
                </div>
              )}
              <div className="flex-1">
                <h1 className="text-4xl font-extrabold tracking-tight mb-2 leading-tight" style={{ color: "var(--pt-text)", letterSpacing: "-0.04em" }}>
                  {user.name}
                </h1>
                {(user.school || user.gpa) && (
                  <p className="text-sm font-medium" style={{ color: "var(--pt-text2)" }}>
                    {user.school}{user.gpa ? ` · GPA ${user.gpa}` : ""}
                  </p>
                )}
              </div>
            </div>

            {user.bio && (
              <p className="text-base leading-relaxed max-w-2xl mb-8" style={{ color: "var(--pt-text2)", lineHeight: 1.8 }}>
                {user.bio}
              </p>
            )}

            {Object.keys(user.contactLinks).length > 0 && (
              <div className="flex flex-wrap gap-3">
                {Object.entries(user.contactLinks).filter(([, v]) => v).map(([k, v]) => (
                  <a
                    key={k}
                    href={k === "phone" ? `tel:${v}` : v}
                    target={k !== "phone" ? "_blank" : undefined}
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-lg transition-all"
                    style={{
                      border: "1px solid var(--pt-border)",
                      color: "var(--pt-accent)",
                      textDecoration: "none",
                    }}
                    onMouseEnter={e => (e.currentTarget.style.opacity = "0.7")}
                    onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
                  >
                    {CONTACT_LABELS[k] || k} ↗
                  </a>
                ))}
              </div>
            )}
          </header>

          <div style={{ height: "1px", backgroundColor: "var(--pt-border)", marginBottom: 56 }} />

          {/* Projects */}
          <section>
            <div className="flex items-center justify-between mb-10">
              <h2 className="text-xs font-bold tracking-[0.2em] uppercase" style={{ color: "var(--pt-text2)" }}>
                Projects
              </h2>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ backgroundColor: "var(--pt-border)", color: "var(--pt-text2)" }}>
                {projects.length}
              </span>
            </div>

            {projects.length === 0 ? (
              <p className="text-sm" style={{ color: "var(--pt-text2)" }}>ยังไม่มีโปรเจกต์สาธารณะ</p>
            ) : (
              <div className="space-y-16">
                {projects.map((project) => {
                  const images = project.files.filter((f) => f.type === "image")
                  const pdfs = project.files.filter((f) => f.type === "pdf")
                  const dateStr = project.date
                    ? new Date(project.date).toLocaleDateString("th-TH", { year: "numeric", month: "long" })
                    : null
                  return (
                    <article key={project.id}>
                      {/* Images */}
                      {images.length > 0 && (
                        <div className={`mb-6 rounded-2xl overflow-hidden ${images.length > 1 ? "grid grid-cols-2 gap-2" : ""}`}
                          style={{ border: "1px solid var(--pt-border)" }}>
                          {images.map((img, i) => (
                            <div
                              key={img.id}
                              onClick={() => setLightboxImg(img.url)}
                              className={`relative overflow-hidden cursor-zoom-in ${
                                images.length === 1 ? "aspect-video" : "aspect-square"
                              } ${images.length === 3 && i === 0 ? "col-span-2 aspect-video" : ""}`}
                              style={{ backgroundColor: "var(--pt-border)" }}
                            >
                              <Image
                                src={img.url} alt={img.filename} fill
                                className="object-cover hover:scale-105 transition-transform duration-700"
                              />
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Title row */}
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <h3 className="text-xl font-bold leading-tight" style={{ color: "var(--pt-text)", letterSpacing: "-0.02em" }}>
                          {project.title}
                        </h3>
                        {dateStr && (
                          <span className="text-xs shrink-0 mt-1.5 font-medium" style={{ color: "var(--pt-text2)" }}>
                            {dateStr}
                          </span>
                        )}
                      </div>

                      <p className="text-sm leading-relaxed mb-5" style={{ color: "var(--pt-text2)", lineHeight: 1.8 }}>
                        {project.description}
                      </p>

                      {project.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-5">
                          {project.tags.map((tag) => (
                            <span
                              key={tag}
                              className="text-xs px-3 py-1 rounded-lg font-medium"
                              style={{ backgroundColor: "var(--pt-tag-bg)", color: "var(--pt-tag-text)" }}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}

                      {(project.externalUrl || pdfs.length > 0) && (
                        <div className="flex flex-wrap gap-3">
                          {project.externalUrl && (
                            <a
                              href={project.externalUrl} target="_blank" rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-widest transition-opacity hover:opacity-60"
                              style={{ color: "var(--pt-accent)" }}
                            >
                              View Project &#8599;
                            </a>
                          )}
                          {pdfs.map((pdf) => (
                            <a
                              key={pdf.id} href={pdf.url} target="_blank" rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-widest transition-opacity hover:opacity-60"
                              style={{ color: "var(--pt-accent)" }}
                            >
                              PDF &#8599;
                            </a>
                          ))}
                        </div>
                      )}

                      <div className="mt-12" style={{ height: "1px", backgroundColor: "var(--pt-border)" }} />
                    </article>
                  )
                })}
              </div>
            )}
          </section>

          <footer className="mt-16 pt-8">
            <p className="text-xs" style={{ color: "var(--pt-text2)" }}>
              Built with{" "}
              <Link href="/" className="underline hover:opacity-60 transition-opacity" style={{ color: "var(--pt-text2)" }}>
                FolioForge
              </Link>
            </p>
          </footer>
        </div>
      </div>
    </>
  )
}
