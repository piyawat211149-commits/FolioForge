"use client"
import { useLang } from "./language-provider"

export function LanguageToggle() {
  const { lang, setLang } = useLang()
  return (
    <button
      onClick={() => setLang(lang === "th" ? "en" : "th")}
      className="flex items-center gap-1 px-3 py-1.5 rounded-full border border-gray-200 text-xs font-medium text-gray-500 hover:text-gray-900 hover:border-gray-400 transition-all"
      title="Switch language"
    >
      <span className={lang === "th" ? "text-gray-900 font-semibold" : "text-gray-400"}>TH</span>
      <span className="text-gray-300">|</span>
      <span className={lang === "en" ? "text-gray-900 font-semibold" : "text-gray-400"}>EN</span>
    </button>
  )
}
