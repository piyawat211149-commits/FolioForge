"use client"
import { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"

const MESSAGES: Record<string, { title: string; body: string; emoji: string }> = {
  missing: { emoji: "⚠️", title: "ลิงก์ไม่ถูกต้อง", body: "ลิงก์ยืนยันไม่มีโทเค็น กรุณาตรวจสอบอีเมลของคุณ" },
  invalid: { emoji: "🔗", title: "ไม่พบลิงก์นี้", body: "ลิงก์ยืนยันนี้ไม่ถูกต้องหรือถูกใช้ไปแล้ว" },
  expired: { emoji: "⏰", title: "ลิงก์หมดอายุ", body: "ลิงก์ยืนยันหมดอายุแล้ว กรุณาสมัครสมาชิกใหม่อีกครั้ง" },
}

function VerifyContent() {
  const params = useSearchParams()
  const error = params.get("error")
  const msg = error ? MESSAGES[error] : null

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-6">
      <div className="w-full max-w-sm text-center">
        <Link href="/" className="block text-gray-900 font-extrabold text-lg mb-12">FolioForge</Link>

        <div className="w-20 h-20 rounded-3xl bg-gray-50 border border-gray-100 flex items-center justify-center text-4xl mx-auto mb-6">
          {msg ? msg.emoji : "✉️"}
        </div>

        <h1 className="text-2xl font-extrabold text-gray-900 mb-3">
          {msg ? msg.title : "ยืนยันอีเมลของคุณ"}
        </h1>
        <p className="text-gray-400 text-sm leading-relaxed mb-8">
          {msg ? msg.body : "เราส่งลิงก์ยืนยันไปที่อีเมลของคุณแล้ว กดลิงก์ในอีเมลเพื่อเปิดใช้งานบัญชี"}
        </p>

        {msg ? (
          <Link href="/register" className="inline-flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-xl text-sm font-bold hover:bg-black transition-colors">
            สมัครสมาชิกใหม่ →
          </Link>
        ) : (
          <Link href="/login" className="text-sm text-indigo-600 font-bold hover:text-indigo-700 transition-colors">
            กลับไปหน้าเข้าสู่ระบบ →
          </Link>
        )}
      </div>
    </div>
  )
}

export default function VerifyEmailPage() {
  return <Suspense><VerifyContent /></Suspense>
}
