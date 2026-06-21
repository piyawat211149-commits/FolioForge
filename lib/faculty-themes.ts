export interface FacultyTheme {
  id: string
  label: string
  accent: string        // main accent (dark mode text/highlight)
  accentDark: string    // deep version for light mode text
  accentSoft: string    // light bg tint
  accentSoftDark: string // dark mode bg tint
  gradient: string      // for gradient text (light mode)
  gradientDark: string  // for gradient text (dark mode)
}

export const FACULTY_THEMES: FacultyTheme[] = [
  {
    id: "default",
    label: "ทั่วไป (Indigo)",
    accent: "#818cf8", accentDark: "#4f46e5",
    accentSoft: "rgba(99,102,241,0.08)", accentSoftDark: "rgba(129,140,248,0.12)",
    gradient: "linear-gradient(135deg, #312e81, #6366f1)",
    gradientDark: "linear-gradient(135deg, #e0e7ff, #818cf8)",
  },
  {
    id: "engineering",
    label: "วิศวกรรมศาสตร์ (แดงเลือดหมู)",
    accent: "#f87171", accentDark: "#991b1b",
    accentSoft: "rgba(239,68,68,0.08)", accentSoftDark: "rgba(248,113,113,0.12)",
    gradient: "linear-gradient(135deg, #7f1d1d, #dc2626)",
    gradientDark: "linear-gradient(135deg, #fecaca, #f87171)",
  },
  {
    id: "medicine",
    label: "แพทยศาสตร์ (เขียว)",
    accent: "#4ade80", accentDark: "#166534",
    accentSoft: "rgba(34,197,94,0.08)", accentSoftDark: "rgba(74,222,128,0.12)",
    gradient: "linear-gradient(135deg, #14532d, #22c55e)",
    gradientDark: "linear-gradient(135deg, #bbf7d0, #4ade80)",
  },
  {
    id: "science",
    label: "วิทยาศาสตร์ (เหลืองทอง)",
    accent: "#fbbf24", accentDark: "#854d0e",
    accentSoft: "rgba(234,179,8,0.08)", accentSoftDark: "rgba(251,191,36,0.12)",
    gradient: "linear-gradient(135deg, #713f12, #eab308)",
    gradientDark: "linear-gradient(135deg, #fef3c7, #fbbf24)",
  },
  {
    id: "arts",
    label: "ศิลปศาสตร์ / อักษรศาสตร์ (ม่วง)",
    accent: "#c084fc", accentDark: "#7c3aed",
    accentSoft: "rgba(168,85,247,0.08)", accentSoftDark: "rgba(192,132,252,0.12)",
    gradient: "linear-gradient(135deg, #581c87, #a855f7)",
    gradientDark: "linear-gradient(135deg, #e9d5ff, #c084fc)",
  },
  {
    id: "business",
    label: "บริหารธุรกิจ / พาณิชยศาสตร์ (น้ำเงิน)",
    accent: "#60a5fa", accentDark: "#1e40af",
    accentSoft: "rgba(59,130,246,0.08)", accentSoftDark: "rgba(96,165,250,0.12)",
    gradient: "linear-gradient(135deg, #1e3a5f, #3b82f6)",
    gradientDark: "linear-gradient(135deg, #bfdbfe, #60a5fa)",
  },
  {
    id: "law",
    label: "นิติศาสตร์ (กรมท่า)",
    accent: "#93c5fd", accentDark: "#1e3a5f",
    accentSoft: "rgba(30,58,95,0.08)", accentSoftDark: "rgba(147,197,253,0.12)",
    gradient: "linear-gradient(135deg, #0f172a, #1e3a5f)",
    gradientDark: "linear-gradient(135deg, #dbeafe, #93c5fd)",
  },
  {
    id: "architecture",
    label: "สถาปัตยกรรมศาสตร์ (น้ำตาล/ส้ม)",
    accent: "#fb923c", accentDark: "#9a3412",
    accentSoft: "rgba(249,115,22,0.08)", accentSoftDark: "rgba(251,146,60,0.12)",
    gradient: "linear-gradient(135deg, #7c2d12, #f97316)",
    gradientDark: "linear-gradient(135deg, #ffedd5, #fb923c)",
  },
  {
    id: "education",
    label: "ครุศาสตร์ / ศึกษาศาสตร์ (เขียวอมฟ้า)",
    accent: "#2dd4bf", accentDark: "#115e59",
    accentSoft: "rgba(20,184,166,0.08)", accentSoftDark: "rgba(45,212,191,0.12)",
    gradient: "linear-gradient(135deg, #134e4a, #14b8a6)",
    gradientDark: "linear-gradient(135deg, #ccfbf1, #2dd4bf)",
  },
  {
    id: "communication",
    label: "นิเทศศาสตร์ (ส้ม/แดง)",
    accent: "#fb7185", accentDark: "#be123c",
    accentSoft: "rgba(244,63,94,0.08)", accentSoftDark: "rgba(251,113,133,0.12)",
    gradient: "linear-gradient(135deg, #881337, #f43f5e)",
    gradientDark: "linear-gradient(135deg, #ffe4e6, #fb7185)",
  },
  {
    id: "nursing",
    label: "พยาบาลศาสตร์ (ฟ้า)",
    accent: "#38bdf8", accentDark: "#0369a1",
    accentSoft: "rgba(14,165,233,0.08)", accentSoftDark: "rgba(56,189,248,0.12)",
    gradient: "linear-gradient(135deg, #0c4a6e, #0ea5e9)",
    gradientDark: "linear-gradient(135deg, #e0f2fe, #38bdf8)",
  },
  {
    id: "pharmacy",
    label: "เภสัชศาสตร์ (เขียวมะกอก)",
    accent: "#a3e635", accentDark: "#3f6212",
    accentSoft: "rgba(132,204,22,0.08)", accentSoftDark: "rgba(163,230,53,0.12)",
    gradient: "linear-gradient(135deg, #365314, #84cc16)",
    gradientDark: "linear-gradient(135deg, #ecfccb, #a3e635)",
  },
  {
    id: "economics",
    label: "เศรษฐศาสตร์ (ทอง)",
    accent: "#fcd34d", accentDark: "#a16207",
    accentSoft: "rgba(252,211,77,0.08)", accentSoftDark: "rgba(252,211,77,0.15)",
    gradient: "linear-gradient(135deg, #78350f, #d97706)",
    gradientDark: "linear-gradient(135deg, #fef3c7, #fcd34d)",
  },
  {
    id: "political",
    label: "รัฐศาสตร์ (แดงเข้ม)",
    accent: "#f472b6", accentDark: "#9f1239",
    accentSoft: "rgba(244,114,182,0.08)", accentSoftDark: "rgba(244,114,182,0.12)",
    gradient: "linear-gradient(135deg, #881337, #e11d48)",
    gradientDark: "linear-gradient(135deg, #fce7f3, #f472b6)",
  },
  {
    id: "dentistry",
    label: "ทันตแพทยศาสตร์ (ม่วงเข้ม)",
    accent: "#a78bfa", accentDark: "#5b21b6",
    accentSoft: "rgba(139,92,246,0.08)", accentSoftDark: "rgba(167,139,250,0.12)",
    gradient: "linear-gradient(135deg, #4c1d95, #7c3aed)",
    gradientDark: "linear-gradient(135deg, #ede9fe, #a78bfa)",
  },
  {
    id: "technology",
    label: "เทคโนโลยี / IT (ฟ้าม่วง)",
    accent: "#818cf8", accentDark: "#4338ca",
    accentSoft: "rgba(99,102,241,0.08)", accentSoftDark: "rgba(129,140,248,0.12)",
    gradient: "linear-gradient(135deg, #312e81, #6366f1)",
    gradientDark: "linear-gradient(135deg, #e0e7ff, #818cf8)",
  },
]

const FACULTY_KEYWORDS: Record<string, string[]> = {
  engineering: ["วิศวกรรม", "engineer", "วิศว"],
  medicine: ["แพทย", "medicine", "medical", "หมอ"],
  science: ["วิทยาศาสตร์", "science", "วิทย์"],
  arts: ["ศิลปศาสตร์", "อักษรศาสตร์", "arts", "humanities", "มนุษยศาสตร์", "ภาษา"],
  business: ["บริหารธุรกิจ", "พาณิชยศาสตร์", "business", "บัญชี", "การตลาด", "management", "commerce"],
  law: ["นิติศาสตร์", "กฎหมาย", "law"],
  architecture: ["สถาปัตย", "architecture", "ออกแบบ", "design"],
  education: ["ครุศาสตร์", "ศึกษาศาสตร์", "education", "ครู"],
  communication: ["นิเทศ", "communication", "สื่อสาร", "journalism", "วารสาร"],
  nursing: ["พยาบาล", "nursing"],
  pharmacy: ["เภสัช", "pharmacy"],
  economics: ["เศรษฐศาสตร์", "economics", "เศรษฐ"],
  political: ["รัฐศาสตร์", "political", "การเมือง"],
  dentistry: ["ทันตแพทย", "ทันต", "dentist"],
  technology: ["เทคโนโลยี", "technology", "it", "คอมพิวเตอร์", "computer", "สารสนเทศ", "ดิจิทัล", "digital", "ซอฟต์แวร์", "software"],
}

export function detectFacultyTheme(text: string): string {
  const lower = text.toLowerCase()
  for (const [id, keywords] of Object.entries(FACULTY_KEYWORDS)) {
    if (keywords.some(kw => lower.includes(kw.toLowerCase()))) return id
  }
  return "default"
}

export function getFacultyTheme(id: string): FacultyTheme {
  return FACULTY_THEMES.find(t => t.id === id) || FACULTY_THEMES[0]
}
