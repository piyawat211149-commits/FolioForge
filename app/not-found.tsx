import Link from "next/link"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="text-center max-w-md">
        <div className="w-24 h-24 rounded-3xl bg-gray-50 border border-gray-100 flex items-center justify-center text-5xl mx-auto mb-8">
          🔍
        </div>
        <h1 className="text-6xl font-extrabold text-gray-900 mb-3 tracking-tight">404</h1>
        <h2 className="text-xl font-bold text-gray-700 mb-3">ไม่พบหน้านี้</h2>
        <p className="text-gray-400 text-sm leading-relaxed mb-10">
          หน้าที่คุณกำลังมองหาอาจถูกย้าย ลบ หรือไม่เคยมีอยู่เลย
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-xl text-sm font-bold hover:bg-black transition-colors"
          >
            ← กลับหน้าหลัก
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center gap-2 border border-gray-200 text-gray-600 px-6 py-3 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors"
          >
            ไปยัง Dashboard
          </Link>
        </div>
        <p className="mt-12 text-xs text-gray-300">
          <Link href="/" className="font-bold text-gray-400">FolioForge</Link>
        </p>
      </div>
    </div>
  )
}
