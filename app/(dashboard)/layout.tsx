import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { signOut } from "@/auth"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { ThemeProvider } from "@/components/theme-provider"

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session) redirect("/login")

  async function handleLogout() {
    "use server"
    await signOut({ redirectTo: "/" })
  }

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a14] flex transition-colors duration-300">
        <DashboardSidebar
          username={session.user.username ?? ""}
          name={session.user.name ?? ""}
          logoutAction={handleLogout}
        />
        <main className="flex-1 min-w-0 overflow-auto pt-14 lg:pt-0">
          {children}
        </main>
      </div>
    </ThemeProvider>
  )
}
