export function parseTags(tagsJson: string): string[] {
  try { return JSON.parse(tagsJson) }
  catch { return [] }
}

export function stringifyTags(tags: string[]): string {
  return JSON.stringify(tags)
}

export function getFileType(mimeType: string): string {
  if (mimeType.startsWith("image/")) return "image"
  if (mimeType === "application/pdf") return "pdf"
  return "other"
}
