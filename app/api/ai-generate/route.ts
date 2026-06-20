import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { basicInfo, pages, lang } = await req.json()
  if (!basicInfo || !pages?.length) return NextResponse.json({ error: "Missing data" }, { status: 400 })

  const langLabel = lang === "th" ? "ภาษาไทย" : "English"
  const pagesText = pages.map((p: { name: string; notes: string }, i: number) =>
    `หน้า ${i + 1}: "${p.name}"\nเนื้อหาที่ต้องการ: ${p.notes || "(ไม่ระบุ ให้ AI สร้างให้เหมาะสม)"}`
  ).join("\n\n")

  const prompt = `คุณเป็นนักเขียนพอร์ตโฟลิโอมืออาชีพสำหรับนักเรียน
เขียนเนื้อหาพอร์ตโฟลิโอทั้งหมดใน${langLabel}

ข้อมูลนักเรียน:
- ชื่อ: ${basicInfo.name}
- โรงเรียน/มหาวิทยาลัย: ${basicInfo.school || "ไม่ระบุ"}
- ชั้นปี/ระดับ: ${basicInfo.grade || "ไม่ระบุ"}
- แนะนำตัว: ${basicInfo.bio || "ไม่ระบุ"}

หน้าที่ต้องสร้าง:
${pagesText}

สร้าง JSON array ที่มีโครงสร้างดังนี้ (ตอบเฉพาะ JSON เท่านั้น ไม่ต้องมีข้อความอื่น):
[
  {
    "slug": "ชื่อหน้าภาษาอังกฤษ-lowercase-ไม่มีเว้นวรรค",
    "title": "ชื่อหน้าที่แสดง",
    "content": {
      "heading": "หัวข้อหลักของหน้า",
      "body": "เนื้อหาหลัก 2-4 ย่อหน้า เขียนให้เป็นธรรมชาติ น่าประทับใจ",
      "highlights": ["จุดเด่น 1", "จุดเด่น 2", "จุดเด่น 3"],
      "extra": "ข้อมูลเพิ่มเติมถ้ามี เช่น ทักษะ ผลงาน รางวัล"
    }
  }
]

กฎ:
- slug ต้องเป็น lowercase อังกฤษ ใช้ - แทนเว้นวรรค เช่น "about-me", "my-skills"
- เขียนให้เป็นธรรมชาติ ไม่เป็นทางการจนเกินไป
- ปรับให้เหมาะกับนักเรียน ไม่ใช่ผู้ใหญ่มืออาชีพ
- highlights ให้มี 3-5 รายการ`

  try {
    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) return NextResponse.json({ error: "GEMINI_API_KEY not set" }, { status: 500 })

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.7, maxOutputTokens: 4096 },
        }),
      }
    )

    const data = await res.json()

    if (!res.ok) {
      console.error("Gemini error:", data)
      return NextResponse.json({ error: data.error?.message || "Gemini API error" }, { status: 500 })
    }

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || ""
    const jsonMatch = text.match(/\[[\s\S]*\]/)
    if (!jsonMatch) return NextResponse.json({ error: "AI did not return valid JSON" }, { status: 500 })

    const generated = JSON.parse(jsonMatch[0])
    return NextResponse.json({ pages: generated })
  } catch (err) {
    console.error("AI generate error:", err)
    return NextResponse.json({ error: "AI generation failed" }, { status: 500 })
  }
}
