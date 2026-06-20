"use client"
import { useRouter } from "next/navigation"
import { useState } from "react"

export function DeleteProjectButton({ projectId }: { projectId: string }) {
  const router = useRouter()
  const [confirming, setConfirming] = useState(false)

  async function handleDelete() {
    await fetch(`/api/projects/${projectId}`, { method: "DELETE" })
    router.refresh()
  }

  if (confirming) {
    return (
      <span className="flex gap-2 ml-auto">
        <button onClick={handleDelete} className="text-xs text-red-400 hover:text-red-600 dark:hover:text-red-300 font-medium transition-colors">
          ลบ?
        </button>
        <button onClick={() => setConfirming(false)} className="text-xs text-gray-300 dark:text-gray-600 hover:text-gray-600 dark:hover:text-gray-400 transition-colors">
          ยกเลิก
        </button>
      </span>
    )
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="text-xs text-gray-300 dark:text-gray-600 hover:text-red-400 dark:hover:text-red-400 transition-colors ml-auto font-medium"
    >
      ลบ
    </button>
  )
}
