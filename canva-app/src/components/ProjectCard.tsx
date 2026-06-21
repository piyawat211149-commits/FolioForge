import { Box, Text, Button } from "@canva/app-ui-kit"

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

export function ProjectCard({ project }: { project: Project }) {
  const firstImage = project.files.find((f) => f.type === "image")

  async function handleAddImage() {
    if (!firstImage) return
    try {
      const { addNativeElement } = await import("@canva/design")
      await addNativeElement({
        type: "image",
        dataUrl: firstImage.url,
        altText: { text: project.title, decorative: false },
      })
    } catch (err) {
      console.error("Failed to add image:", err)
      alert("ต้องใช้ภายใน Canva Editor เท่านั้น")
    }
  }

  async function handleAddText() {
    try {
      const { addNativeElement } = await import("@canva/design")
      await addNativeElement({
        type: "text",
        children: [project.title + "\n\n" + project.description],
      })
    } catch (err) {
      console.error("Failed to add text:", err)
      alert("ต้องใช้ภายใน Canva Editor เท่านั้น")
    }
  }

  return (
    <Box
      borderRadius="large"
      padding="2u"
      background="surface"
    >
      {firstImage && (
        <Box paddingBottom="1u">
          <img
            src={firstImage.url}
            alt={project.title}
            style={{
              width: "100%",
              height: 120,
              objectFit: "cover",
              borderRadius: 8,
              display: "block",
            }}
          />
        </Box>
      )}

      <Text size="small" variant="bold">
        {project.title}
      </Text>
      <Box paddingTop="0.5u" paddingBottom="1u">
        <Text size="xsmall" tone="tertiary" lineClamp={2}>
          {project.description || "ไม่มีคำอธิบาย"}
        </Text>
      </Box>

      {project.tags.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 4, paddingBottom: 8 }}>
          {project.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              style={{
                fontSize: 10,
                padding: "2px 8px",
                borderRadius: 100,
                background: "#f0f0f0",
                color: "#666",
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      <div style={{ display: "flex", gap: 8 }}>
        {firstImage && (
          <Button variant="secondary" onClick={handleAddImage} stretch>
            Add Image
          </Button>
        )}
        <Button variant="secondary" onClick={handleAddText} stretch>
          Add Text
        </Button>
      </div>
    </Box>
  )
}
