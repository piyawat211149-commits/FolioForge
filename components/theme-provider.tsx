"use client"
import { createContext, useContext, useState, useEffect, useCallback } from "react"

type Theme = "light" | "dark"
const ThemeContext = createContext<{ theme: Theme; dark: boolean; toggle: () => void }>({ theme: "light", dark: false, toggle: () => {} })

export function useTheme() {
  return useContext(ThemeContext)
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light")

  useEffect(() => {
    const saved = localStorage.getItem("ff-theme") as Theme
    if (saved) setTheme(saved)
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark")
    localStorage.setItem("ff-theme", theme)
  }, [theme])

  const toggle = useCallback(() => setTheme(t => t === "light" ? "dark" : "light"), [])

  return (
    <ThemeContext.Provider value={{ theme, dark: theme === "dark", toggle }}>
      {children}
    </ThemeContext.Provider>
  )
}
