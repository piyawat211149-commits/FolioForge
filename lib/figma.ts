const FIGMA_API = "https://api.figma.com/v1"

function getToken() {
  const token = process.env.FIGMA_API_TOKEN
  if (!token) throw new Error("FIGMA_API_TOKEN is not set")
  return token
}

async function figmaFetch<T>(path: string): Promise<T> {
  const res = await fetch(`${FIGMA_API}${path}`, {
    headers: { "X-Figma-Token": getToken() },
    next: { revalidate: 300 },
  })
  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Figma API ${res.status}: ${err}`)
  }
  return res.json()
}

export interface FigmaFile {
  key: string
  name: string
  thumbnail_url: string
  last_modified: string
}

interface TeamProjectsResponse {
  name: string
  projects: { id: string; name: string }[]
}

interface ProjectFilesResponse {
  name: string
  files: FigmaFile[]
}

export interface FigmaPageInfo {
  id: string
  name: string
  imageUrl?: string
}

interface FileResponse {
  document: {
    children: { id: string; name: string }[]
  }
}

interface ImagesResponse {
  images: Record<string, string | null>
}

export async function getTeamFiles(): Promise<FigmaFile[]> {
  const teamId = process.env.FIGMA_TEAM_ID
  if (!teamId) throw new Error("FIGMA_TEAM_ID is not set")

  const { projects } = await figmaFetch<TeamProjectsResponse>(`/teams/${teamId}/projects`)
  const allFiles: FigmaFile[] = []

  for (const project of projects) {
    const { files } = await figmaFetch<ProjectFilesResponse>(`/projects/${project.id}/files`)
    allFiles.push(...files)
  }

  return allFiles
}

export async function getFilePages(fileKey: string): Promise<FigmaPageInfo[]> {
  const file = await figmaFetch<FileResponse>(`/files/${fileKey}?depth=1`)
  const pages = file.document.children.map((c) => ({ id: c.id, name: c.name }))

  const nodeIds = pages.map((p) => p.id).join(",")
  const { images } = await figmaFetch<ImagesResponse>(
    `/images/${fileKey}?ids=${nodeIds}&format=png&scale=2`
  )

  return pages.map((p) => ({
    ...p,
    imageUrl: images[p.id] ?? undefined,
  }))
}
