"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { LanguageToggle } from "./language-toggle"
import { useLang } from "./language-provider"
import { useTheme } from "./theme-provider"

interface Props {
  username: string
  name: string
  logoutAction: () => Promise<void>
}

function ThemeToggle() {
  const { theme, toggle } = useTheme()
  return (
    <button
      onClick={toggle}
      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/5 transition-all text-left"
    >
      <span className="text-base leading-none w-4 text-center">{theme === "dark" ? "☀" : "☾"}</span>
      {theme === "dark" ? "Light Mode" : "Dark Mode"}
    </button>
  )
}

function NavItems({
  navItems, pathname, username, logoutAction, onNavigate,
}: {
  navItems: { href: string; label: string; icon: string; tourId: string }[]
  pathname: string
  username: string
  logoutAction: () => Promise<void>
  onNavigate?: () => void
}) {
  const { t } = useLang()
  return (
    <>
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href))
          return (
            <Link
              key={item.href}
              href={item.href}
              data-tour={item.tourId}
              onClick={onNavigate}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? "bg-gradient-to-r from-indigo-500 to-violet-500 text-white shadow-md shadow-indigo-500/20"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/5"
              }`}
            >
              <span className="text-base leading-none w-4 text-center">{item.icon}</span>
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="px-3 py-4 border-t border-gray-100 dark:border-white/5 space-y-0.5">
        <Link
          href={`/portfolio/${username}`}
          data-tour="nav-portfolio"
          onClick={onNavigate}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/5 transition-all"
        >
          <span className="text-base leading-none w-4 text-center">{"↗"}</span>
          {t("nav.viewPortfolio")}
        </Link>
        <ThemeToggle />
        <div className="px-3 py-2">
          <LanguageToggle />
        </div>
        <form action={logoutAction}>
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all text-left">
            <span className="text-base leading-none w-4 text-center">{"→"}</span>
            {t("nav.logout")}
          </button>
        </form>
      </div>
    </>
  )
}

function UserBadge({ name, username }: { name: string; username: string }) {
  return (
    <div className="px-4 py-4 border-t border-gray-100 dark:border-white/5 bg-gray-50/60 dark:bg-white/[0.02]">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 shadow-md shadow-indigo-500/20">
          {(name || username).charAt(0).toUpperCase()}
        </div>
        <div className="min-w-0">
          <p className="text-xs font-bold text-gray-800 dark:text-gray-200 truncate">{name || username}</p>
          <p className="text-xs text-gray-400 dark:text-gray-500 truncate">{"@"}{username}</p>
        </div>
      </div>
    </div>
  )
}

export function DashboardSidebar({ username, name, logoutAction }: Props) {
  const { t } = useLang()
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  const navItems = [
    { href: "/dashboard", label: t("nav.projects"), icon: "◈", tourId: "nav-projects" },
    { href: "/dashboard/ai-builder", label: t("nav.aiBuilder"), icon: "✦", tourId: "nav-ai" },
    { href: "/dashboard/profile", label: t("nav.profile"), icon: "◎", tourId: "nav-profile" },
  ]

  return (
    <>
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 h-14 bg-white dark:bg-[#0e0e1a] border-b border-gray-100 dark:border-white/5 shadow-sm">
        <Link href="/" className="text-base font-extrabold tracking-tight text-gray-900 dark:text-white">FolioForge</Link>
        <button
          onClick={() => setMobileOpen(o => !o)}
          className="w-9 h-9 rounded-xl bg-gray-100 dark:bg-white/10 flex items-center justify-center text-gray-700 dark:text-gray-300 text-lg font-bold"
        >
          {mobileOpen ? "✕" : "☰"}
        </button>
      </div>

      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <div className={`lg:hidden fixed top-14 left-0 bottom-0 z-40 w-64 bg-white dark:bg-[#0e0e1a] border-r border-gray-100 dark:border-white/5 flex flex-col shadow-xl transition-transform duration-200 ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <NavItems navItems={navItems} pathname={pathname} username={username} logoutAction={logoutAction} onNavigate={() => setMobileOpen(false)} />
        <UserBadge name={name} username={username} />
      </div>

      <aside className="hidden lg:flex w-60 bg-white dark:bg-[#0e0e1a] border-r border-gray-100 dark:border-white/5 flex-col shrink-0 sticky top-0 h-screen transition-colors duration-300">
        <div className="px-6 py-5 border-b border-gray-100 dark:border-white/5">
          <Link href="/" className="text-lg font-extrabold tracking-tight text-gray-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
            FolioForge
          </Link>
        </div>
        <NavItems navItems={navItems} pathname={pathname} username={username} logoutAction={logoutAction} />
        <UserBadge name={name} username={username} />
      </aside>
    </>
  )
}
