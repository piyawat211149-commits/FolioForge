"use client"

import { useState } from "react"
import Image from "next/image"

interface FigmaFile {
  key: string
  name: string
  thumbnail_url: string
  last_modified: string
}

interface PageInfo {
  id: string
  name: string
  imageUrl?: string
}

export function FigmaGallery({ initialFiles }: { initialFiles: FigmaFile[] }) {
  const [files] = useState(initialFiles)
  const [selectedFile, setSelectedFile] = useState<string | null>(null)
  const [pages, setPages] = useState<PageInfo[]>([])
  const [loading, setLoading] = useState(false)
  const [previewImg, setPreviewImg] = useState<string | null>(null)

  async function openFile(fileKey: string) {
    if (selectedFile === fileKey) {
      setSelectedFile(null)
      setPages([])
      return
    }
    setSelectedFile(fileKey)
    setLoading(true)
    try {
      const res = await fetch(`/api/figma?fileKey=${fileKey}`)
      const data = await res.json()
      setPages(data.pages || [])
    } catch {
      setPages([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {files.length === 0 ? (
        <div className="rounded-3xl border-2 border-dashed border-gray-200 dark:border-white/10 bg-gray-50/50 dark:bg-white/[0.02] py-20 px-8 text-center">
          <div className="w-16 h-16 rounded-2xl bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 shadow-sm flex items-center justify-center text-3xl mx-auto mb-5">
            🎨
          </div>
          <h3 className="text-base font-bold text-gray-800 dark:text-gray-200 mb-2">ไม่มีไฟล์ใน Figma</h3>
          <p className="text-sm text-gray-400 dark:text-gray-500 max-w-xs mx-auto">
            สร้างไฟล์ดีไซน์ใน Figma แล้วจะแสดงที่นี่อัตโนมัติ
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {files.map((file) => (
            <div key={file.key} className="col-span-1">
              <button
                onClick={() => openFile(file.key)}
                className={`w-full text-left bg-white dark:bg-white/[0.04] rounded-2xl border overflow-hidden hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300 group hover:-translate-y-1 ${
                  selectedFile === file.key
                    ? "border-indigo-500 dark:border-indigo-400 shadow-lg shadow-indigo-500/10"
                    : "border-gray-100 dark:border-white/5"
                }`}
              >
                <div className="aspect-video relative overflow-hidden bg-gray-50 dark:bg-white/5">
                  {file.thumbnail_url ? (
                    <img
                      src={file.thumbnail_url}
                      alt={file.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-indigo-200 dark:text-indigo-500/30 text-4xl">◈</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center text-sm flex-shrink-0 shadow-md shadow-pink-500/20">
                      <svg width="16" height="16" viewBox="0 0 38 57" fill="white">
                        <path d="M19 28.5a9.5 9.5 0 1 1 19 0 9.5 9.5 0 0 1-19 0z" />
                        <path d="M0 47.5A9.5 9.5 0 0 1 9.5 38H19v9.5a9.5 9.5 0 0 1-19 0z" />
                        <path d="M19 0v19h9.5a9.5 9.5 0 0 0 0-19H19z" />
                        <path d="M0 9.5A9.5 9.5 0 0 0 9.5 19H19V0H9.5A9.5 9.5 0 0 0 0 9.5z" />
                        <path d="M0 28.5A9.5 9.5 0 0 0 9.5 38H19V19H9.5A9.5 9.5 0 0 0 0 28.5z" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{file.name}</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500">
                        {new Date(file.last_modified).toLocaleDateString("th-TH", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </button>

              {selectedFile === file.key && (
                <div className="mt-3 rounded-2xl border border-indigo-100 dark:border-indigo-500/20 bg-indigo-50/50 dark:bg-indigo-500/5 p-4">
                  <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400 mb-3">
                    หน้าในไฟล์นี้
                  </p>
                  {loading ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                  ) : pages.length === 0 ? (
                    <p className="text-xs text-gray-400 py-4 text-center">ไม่พบหน้าในไฟล์นี้</p>
                  ) : (
                    <div className="space-y-2">
                      {pages.map((page) => (
                        <button
                          key={page.id}
                          onClick={() => page.imageUrl && setPreviewImg(page.imageUrl)}
                          className="w-full flex items-center gap-3 p-2.5 rounded-xl bg-white dark:bg-white/[0.06] border border-gray-100 dark:border-white/5 hover:border-indigo-300 dark:hover:border-indigo-500/30 hover:shadow-md transition-all duration-200 text-left group"
                        >
                          {page.imageUrl ? (
                            <img
                              src={page.imageUrl}
                              alt={page.name}
                              className="w-14 h-10 rounded-lg object-cover flex-shrink-0 border border-gray-100 dark:border-white/10"
                            />
                          ) : (
                            <div className="w-14 h-10 rounded-lg bg-gray-100 dark:bg-white/5 flex items-center justify-center flex-shrink-0">
                              <span className="text-gray-300 text-sm">—</span>
                            </div>
                          )}
                          <span className="text-sm text-gray-700 dark:text-gray-300 font-medium truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                            {page.name}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                  <a
                    href={`https://www.figma.com/file/${file.key}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 flex items-center justify-center gap-1.5 w-full py-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-white dark:bg-white/[0.06] rounded-xl border border-indigo-200 dark:border-indigo-500/20 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-colors"
                  >
                    เปิดใน Figma ↗
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {previewImg && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setPreviewImg(null)}
        >
          <div
            className="relative max-w-5xl max-h-[90vh] rounded-2xl overflow-hidden bg-white dark:bg-gray-900 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setPreviewImg(null)}
              className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors text-sm"
            >
              ✕
            </button>
            <img
              src={previewImg}
              alt="Preview"
              className="max-w-full max-h-[90vh] object-contain"
            />
          </div>
        </div>
      )}
    </>
  )
}
