import { useState } from "react"
import { Box, Text, Alert } from "@canva/app-ui-kit"
import { UsernameForm } from "./components/UsernameForm"
import { ProjectCard } from "./components/ProjectCard"

const API_BASE = import.meta.env.DEV
  ? "http://localhost:3000/api/public/portfolio"
  : "https://folio-forge-ten.vercel.app/api/public/portfolio"

interface FileItem {
  url: string
  type: string
  filename: string
}

interface Project {
  id: string
  title: string
  description: string
  tags: string[]
  externalUrl: string | null
  date: string | null
  files: FileItem[]
}

interface UserInfo {
  name: string
  username: string
  bio: string
  avatarUrl: string
}

export function App() {
  const [user, setUser] = useState<UserInfo | null>(null)
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit(username: string) {
    setError("")
    setLoading(true)
    setUser(null)
    setProjects([])

    try {
      const res = await fetch(`${API_BASE}/${encodeURIComponent(username)}`)
      if (!res.ok) {
        setError(res.status === 404 ? "ไม่พบผู้ใช้นี้" : "เกิดข้อผิดพลาด")
        return
      }
      const data = await res.json()
      setUser(data.user)
      setProjects(data.projects || [])
    } catch {
      setError("ไม่สามารถเชื่อมต่อ FolioForge ได้")
    } finally {
      setLoading(false)
    }
  }

  function handleReset() {
    setUser(null)
    setProjects([])
    setError("")
  }

  return (
    <Box paddingStart="2u" paddingEnd="2u" paddingTop="2u" paddingBottom="2u">
      <Box paddingBottom="2u">
        <Text size="large" variant="bold">
          FolioForge
        </Text>
        <Text size="small" tone="tertiary">
          นำเข้าโปรเจกต์จาก Portfolio เข้า Canva
        </Text>
      </Box>

      {!user && (
        <UsernameForm onSubmit={handleSubmit} loading={loading} />
      )}

      {error && (
        <Box paddingTop="1u">
          <Alert tone="critical">{error}</Alert>
        </Box>
      )}

      {user && (
        <Box paddingTop="2u">
          {/* User info header */}
          <Box
            paddingBottom="2u"
            borderRadius="large"
          >
            <div style={{ display: "flex", flexDirection: "row", gap: 12, alignItems: "center" }}>
              {user.avatarUrl && (
                <img
                  src={user.avatarUrl}
                  alt={user.name}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    objectFit: "cover",
                  }}
                />
              )}
              <Box>
                <Text size="medium" variant="bold">
                  {user.name}
                </Text>
                <Text size="small" tone="tertiary">
                  @{user.username}
                </Text>
              </Box>
            </div>
            {user.bio && (
              <Box paddingTop="1u">
                <Text size="small" tone="secondary">
                  {user.bio}
                </Text>
              </Box>
            )}
          </Box>

          {/* Change user button */}
          <Box paddingBottom="2u">
            <button
              onClick={handleReset}
              style={{
                background: "none",
                border: "1px solid #ddd",
                borderRadius: 8,
                padding: "6px 12px",
                fontSize: "12px",
                cursor: "pointer",
                color: "#666",
              }}
            >
              ← เปลี่ยนผู้ใช้
            </button>
          </Box>

          {/* Projects list */}
          <Text size="small" variant="bold">
            โปรเจกต์ ({projects.length})
          </Text>

          {projects.length === 0 ? (
            <Box paddingTop="2u">
              <Alert tone="info">ไม่พบโปรเจกต์สาธารณะ</Alert>
            </Box>
          ) : (
            <div style={{ paddingTop: 8, display: "flex", flexDirection: "column", gap: 8 }}>
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          )}
        </Box>
      )}
    </Box>
  )
}
