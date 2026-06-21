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
- โรงเรียน: ${basicInfo.school || "ไม่ระบุ"}
- ชั้นปี: ${basicInfo.grade || "ไม่ระบุ"}
- แนะนำตัว: ${basicInfo.bio || "ไม่ระบุ"}
- มหาวิทยาลัย/คณะเป้าหมาย: ${basicInfo.targetFaculty || "ไม่ระบุ"}
- GPAX: ${basicInfo.gpax || "ไม่ระบุ"}
- กิจกรรมสำคัญ: ${basicInfo.activities || "ไม่ระบุ"}
- เกียรติบัตร/รางวัล: ${basicInfo.awards || "ไม่ระบุ"}
- ทักษะพิเศษ: ${basicInfo.skills || "ไม่ระบุ"}
- เป้าหมายอาชีพ: ${basicInfo.goals || "ไม่ระบุ"}

## หน้าที่ต้องสร้าง
${pagesText}

## คำแนะนำเฉพาะแต่ละประเภทหน้า (สร้างตามที่ระบุข้างบน)

### หน้าปก (cover)
- heading = ชื่อ-นามสกุลนักเรียน
- body = ชื่อโรงเรียน, คณะ/มหาวิทยาลัยที่สมัคร, ชั้นปี
- highlights = ไม่ต้องมี (ส่ง array ว่าง)
- extra = คำขวัญหรือ motto สั้นๆ 1 ประโยค

### คำนำ / SOP (introduction-sop)
- ต้องมี 5 ส่วนใน body: (1) แนะนำตัวเอง (2) แรงจูงใจที่เลือกสาขานี้ (3) เป้าหมายการศึกษา/อาชีพ (4) คุณสมบัติ/ความสำเร็จที่เกี่ยวข้อง (5) ทำไมถึงเลือกมหาวิทยาลัยนี้โดยเฉพาะ
- ไม่เกิน 1 หน้า กระชับได้ใจความ
- highlights = จุดเด่นสำคัญ 3-5 ข้อ

### ประวัติส่วนตัว (personal-info)
- ข้อมูลพื้นฐาน ครอบครัว ความสนใจ บุคลิกภาพ
- highlights = ความสามารถพิเศษ งานอดิเรก ภาษาที่ใช้ได้

### ประวัติการศึกษา (education)
- GPAX แต่ละปี (ถ้ามี) หรือ GPAX รวม
- วิชาที่ถนัด วิชาที่ได้คะแนนสูง
- highlights = GPAX, โรงเรียน, วิชาถนัด

### กิจกรรม (activities)
- เรียงจากกิจกรรมที่เกี่ยวข้องกับคณะเป้าหมายมากที่สุดก่อน
- ใช้ storytelling: ทำอะไร → บทบาทอะไร → ได้เรียนรู้อะไร
- highlights = ชื่อกิจกรรมสำคัญ

### ผลงาน (projects)
- โปรเจกต์ส่วนตัว ผลงานที่ภาคภูมิใจ
- อธิบายกระบวนการทำ ไม่ใช่แค่บอกชื่อ
- highlights = ชื่อผลงานเด่น

### เกียรติบัตร & รางวัล (certificates)
- เรียงจากระดับประเทศ → ระดับภูมิภาค → ระดับโรงเรียน
- อธิบายสั้นๆ ว่าแต่ละรางวัลคืออะไร
- highlights = ชื่อรางวัลสำคัญ

### ทักษะ (skills)
- แยกเป็นหมวด: ทักษะวิชาการ, ทักษะเทคนิค, ทักษะภาษา, soft skills
- highlights = ทักษะสำคัญทั้งหมด

### เป้าหมาย & แรงบันดาลใจ (goals)
- วิสัยทัศน์ระยะสั้น (ช่วงเรียนมหาวิทยาลัย) + ระยะยาว (อาชีพ)
- ทำไมสาขานี้จะช่วยให้บรรลุเป้าหมาย
- highlights = เป้าหมายหลัก

### ขอบคุณ (thank-you)
- ขอบคุณผู้อ่าน อาจารย์ ครอบครัว
- body สั้นกระชับ 1-2 ย่อหน้า
- extra = ช่องทางติดต่อ (อีเมล, เบอร์โทร)

## หลักการสำคัญ
1. **Storytelling** — เล่าเรื่อง ไม่ใช่แค่ลิสต์
2. **กระชับ** — แต่ละหน้าไม่ยาวเกินไป อ่านง่าย
3. **เชื่อมโยงกับคณะ** — ทุกหน้าสะท้อนว่าเหมาะกับสาขาที่เลือก
4. **คุณภาพ > ปริมาณ** — เลือกเฉพาะผลงานที่เกี่ยวข้อง
5. **ห้ามแต่งเรื่องเท็จ** — เขียนจากข้อมูลที่ให้เท่านั้น
6. **สีไม่เกิน 2-3 สี** — ให้อ่านง่าย ไม่ฉูดฉาด

## JSON format (ตอบเฉพาะ JSON):
[{"slug":"string","title":"string","content":{"heading":"string","body":"string","highlights":["string"],"extra":"string"}}]

## กฎ:
- slug = lowercase อังกฤษ ใช้ - แทนเว้นวรรค
- body = 2-5 ย่อหน้าตาม storytelling (หน้าปก+ขอบคุณ ให้สั้น 1-2 ย่อหน้า)
- highlights = 3-8 รายการ (หน้าปกส่ง array ว่าง)
- เขียนเป็นธรรมชาติ เหมาะกับนักเรียน`

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
