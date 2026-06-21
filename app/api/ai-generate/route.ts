import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/auth"

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { basicInfo, pages, lang, facultyTheme } = await req.json()
  if (!basicInfo || !pages?.length) return NextResponse.json({ error: "Missing data" }, { status: 400 })

  const langLabel = lang === "th" ? "ภาษาไทย" : "English"
  const pagesText = pages.map((p: { name: string; notes: string }, i: number) =>
    `หน้า ${i + 1}: "${p.name}"\nเนื้อหาที่ต้องการ: ${p.notes || "(ไม่ระบุ ให้ AI สร้างให้เหมาะสม)"}`
  ).join("\n\n")

  const prompt = `คุณเป็นนักเขียนพอร์ตโฟลิโอมืออาชีพระดับ TCAS สำหรับนักเรียนไทย
เขียนเนื้อหาพอร์ตโฟลิโอทั้งหมดใน${langLabel}

## ข้อมูลนักเรียน
- ชื่อ: ${basicInfo.name}
- โรงเรียน/มหาวิทยาลัย: ${basicInfo.school || "ไม่ระบุ"}
- ชั้นปี/ระดับ: ${basicInfo.grade || "ไม่ระบุ"}
- แนะนำตัว: ${basicInfo.bio || "ไม่ระบุ"}
- มหาวิทยาลัย/คณะเป้าหมาย: ${basicInfo.targetFaculty || "ไม่ระบุ"}
- GPAX: ${basicInfo.gpax || "ไม่ระบุ"}
- กิจกรรมสำคัญ: ${basicInfo.activities || "ไม่ระบุ"}
- เกียรติบัตร/รางวัล: ${basicInfo.awards || "ไม่ระบุ"}
- ทักษะพิเศษ: ${basicInfo.skills || "ไม่ระบุ"}
- เป้าหมายอาชีพ: ${basicInfo.goals || "ไม่ระบุ"}

## หน้าที่ต้องสร้าง
${pagesText}

## หลักการเขียนพอร์ตโฟลิโอที่ดี (ต้องปฏิบัติตาม)

1. **ใช้ Storytelling** — ทุกหน้าต้องเล่า "เรื่องของตัวเอง" ไม่ใช่แค่ลิสต์รายการ ใช้โครงสร้าง: จุดเริ่มต้น → แรงบันดาลใจ → สิ่งที่ทำ → ผลลัพธ์
2. **SOP (Statement of Purpose)** — ถ้ามีหน้าแนะนำตัว/คำนำ ต้องมี 5 ส่วน: แนะนำตัวเอง, แรงจูงใจเลือกสาขา, เป้าหมายการศึกษา/อาชีพ, คุณสมบัติ/ความสำเร็จ, ทำไมถึงเลือกมหาวิทยาลัยนี้
3. **ปรับตามคณะเป้าหมาย** — เนื้อหาทั้งหมดต้องสะท้อนว่านักเรียนเหมาะกับสาขาที่เลือก เลือกกิจกรรม/ทักษะที่เกี่ยวข้องมาเน้น
4. **เน้นคุณภาพไม่ใช่ปริมาณ** — อาจารย์ตรวจมองหา "ผลงานเด่นมีอะไรบ้าง?" และ "บุคลิกผู้สมัครเป็นอย่างไร (ผู้นำ/จิตอาสา/สร้างสรรค์)" ไม่ได้นับจำนวนเกียรติบัตร
5. **แสดง Mindset ที่ดี** — ทักษะการทำงาน ความรับผิดชอบ การเรียนรู้ด้วยตัวเอง ความมุ่งมั่น
6. **ถ้ามีผลงานน้อย** — เน้นความตั้งใจจริง กิจกรรมจิตอาสา โปรเจกต์ส่วนตัว และเรื่องราวที่แสดงความพยายาม

## รูปแบบ JSON ที่ต้องตอบ (ตอบเฉพาะ JSON เท่านั้น ไม่ต้องมีข้อความอื่น):
[
  {
    "slug": "ชื่อหน้าภาษาอังกฤษ-lowercase-ไม่มีเว้นวรรค",
    "title": "ชื่อหน้าที่แสดง",
    "content": {
      "heading": "หัวข้อหลักของหน้า",
      "body": "เนื้อหาหลัก 3-5 ย่อหน้า ใช้ storytelling เล่าเรื่อง ไม่ใช่แค่ลิสต์ เขียนให้เป็นธรรมชาติ จริงใจ น่าประทับใจ",
      "highlights": ["จุดเด่น 1", "จุดเด่น 2", "จุดเด่น 3", "จุดเด่น 4", "จุดเด่น 5"],
      "extra": "ข้อมูลเพิ่มเติม เช่น คำพูดที่สร้างแรงบันดาลใจ หรือสรุปสิ่งที่ได้เรียนรู้"
    }
  }
]

## กฎ:
- slug ต้องเป็น lowercase อังกฤษ ใช้ - แทนเว้นวรรค เช่น "about-me", "education"
- body ต้องยาวพอสมควร (3-5 ย่อหน้า) ใช้ storytelling ไม่ใช่แค่ประโยคสั้นๆ
- highlights ให้มี 3-6 รายการ
- เขียนให้เป็นธรรมชาติ เหมาะกับนักเรียน ไม่เป็นทางการจนเกินไป
- ทุกหน้าต้องเชื่อมโยงกับคณะ/สาขาเป้าหมาย (ถ้าระบุ)
- สร้างเนื้อหาจากข้อมูลที่ให้ ถ้าข้อมูลน้อยให้เขียนให้เหมาะสมโดยไม่แต่งเรื่องเท็จ`

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
          generationConfig: { temperature: 0.7, maxOutputTokens: 8192 },
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
    if (generated.length > 0 && facultyTheme) {
      generated[0].content._facultyTheme = facultyTheme
    }
    return NextResponse.json({ pages: generated })
  } catch (err) {
    console.error("AI generate error:", err)
    return NextResponse.json({ error: "AI generation failed" }, { status: 500 })
  }
}
