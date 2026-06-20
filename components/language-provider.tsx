"use client"
import { createContext, useContext, useEffect, useState } from "react"
import type { Lang } from "@/lib/i18n"
import { tr } from "@/lib/i18n"
import type { TranslationKey } from "@/lib/i18n"

interface LangCtx {
  lang: Lang
  setLang: (l: Lang) => void
  t: (key: TranslationKey) => string
}

const LangContext = createContext<LangCtx>({
  lang: "th",
  setLang: () => {},
  t: (k) => k,
})

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("th")

  useEffect(() => {
    const stored = localStorage.getItem("ff_lang") as Lang | null
    if (stored === "th" || stored === "en") setLangState(stored)
  }, [])

  function setLang(l: Lang) {
    setLangState(l)
    localStorage.setItem("ff_lang", l)
  }

  return (
    <LangContext.Provider value={{ lang, setLang, t: (key) => tr(lang, key) }}>
      {children}
    </LangContext.Provider>
  )
}

export function useLang() {
  return useContext(LangContext)
}
