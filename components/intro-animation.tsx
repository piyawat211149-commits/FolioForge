"use client"
import { useEffect, useState } from "react"

export function IntroAnimation() {
  const [phase, setPhase] = useState<"skip" | "enter" | "center" | "exit" | "done">("enter")

  useEffect(() => {
    // Only show once per browser session
    if (sessionStorage.getItem("ff-intro-done")) {
      setPhase("done")
      return
    }
    const t1 = setTimeout(() => setPhase("center"), 100)
    const t2 = setTimeout(() => setPhase("exit"), 1800)
    const t3 = setTimeout(() => {
      setPhase("done")
      sessionStorage.setItem("ff-intro-done", "1")
    }, 2800)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [])

  if (phase === "done" || phase === "skip") return null

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "#000",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: phase === "exit" ? 0 : 1,
        transition: phase === "exit" ? "opacity 1s cubic-bezier(0.4,0,0.2,1)" : "none",
        pointerEvents: phase === "exit" ? "none" : "all",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <h1
          style={{
            color: "#fff",
            fontSize: "clamp(2.5rem, 10vw, 6rem)",
            fontWeight: 800,
            letterSpacing: "-0.05em",
            lineHeight: 1,
            transform: phase === "enter" ? "translateY(30px) scale(0.9)" : "translateY(0) scale(1)",
            opacity: phase === "enter" ? 0 : 1,
            transition: "transform 1s cubic-bezier(0.16,1,0.3,1), opacity 0.8s ease",
          }}
        >
          FolioForge
        </h1>
        <p
          style={{
            color: "rgba(255,255,255,0.4)",
            fontSize: "clamp(0.75rem, 2vw, 1rem)",
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            marginTop: "1rem",
            transform: phase === "enter" ? "translateY(10px)" : "translateY(0)",
            opacity: phase === "enter" ? 0 : 0.6,
            transition: "transform 1s cubic-bezier(0.16,1,0.3,1) 0.2s, opacity 0.8s ease 0.2s",
          }}
        >
          Portfolio Builder
        </p>
      </div>
    </div>
  )
}
