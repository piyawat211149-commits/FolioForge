import { useState } from "react"
import { Box, Button, TextInput, Text } from "@canva/app-ui-kit"

interface Props {
  onSubmit: (username: string) => void
  loading: boolean
}

export function UsernameForm({ onSubmit, loading }: Props) {
  const [username, setUsername] = useState("")

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = username.trim()
    if (trimmed) onSubmit(trimmed)
  }

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <Box>
          <Text size="small" variant="bold">
            ชื่อผู้ใช้ FolioForge
          </Text>
        </Box>
        <TextInput
          value={username}
          onChange={setUsername}
          placeholder="เช่น te_sx1"
          disabled={loading}
        />
        <Button
          variant="primary"
          type="submit"
          disabled={!username.trim() || loading}
          loading={loading}
          stretch
        >
          {loading ? "กำลังโหลด..." : "ดึงข้อมูล Portfolio"}
        </Button>
      </div>
    </form>
  )
}
