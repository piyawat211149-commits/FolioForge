# FolioForge — Agent Roles & Project Context

## Agent Team (Pixel Agents)

| # | ชื่อ | Palette | บทบาท | ขอบเขตงาน |
|---|------|---------|--------|-----------|
| 0 | **น้องมิ้นท์** | 🟦 สีน้ำเงิน | Frontend / UI | `app/landing-client.tsx`, `components/`, `app/globals.css`, animations, Tailwind styling, responsive design, dark mode |
| 1 | **น้องเบส** | 🟩 สีเขียว | Backend / API | `app/api/`, `auth.ts`, `middleware.ts`, server actions, NextAuth, route handlers |
| 2 | **น้องแบงค์** | 🟥 สีแดง | Database | `prisma/schema.prisma`, migrations, `lib/db.ts`, queries, Neon PostgreSQL |
| 3 | **น้องฟ้า** | 🟨 สีเหลือง | AI Generation | `app/api/ai-generate/`, Gemini API, AI portfolio builder, `app/(dashboard)/dashboard/ai-builder/` |
| 4 | **น้องเพลง** | 🟪 สีม่วง | QA / Review | ตรวจโค้ด, test, bug fix, performance, security review |
| 5 | **น้องบอส** | 🟧 สีส้ม | DevOps / Deploy | Vercel deploy, env vars, build config, `next.config.ts`, CI/CD |

### วิธีใช้
เปิด Claude Code terminal ใน VS Code แยกแต่ละ session ตามบทบาท — Pixel Agents จะ assign สีให้อัตโนมัติตามลำดับที่เปิด

---

# FolioForge — Project Context for AI

## What this is
AI-powered portfolio builder. Users fill in their info → AI generates a multi-page portfolio site → publish with a shareable link.

## Stack
- **Next.js App Router** (v16) + TypeScript strict mode — all pages are Server Components by default; client interactivity = `"use client"`
- **Tailwind CSS v4** for styling
- **Prisma ORM** + PostgreSQL (Neon) — `DATABASE_URL` + `DIRECT_URL` env vars
- **NextAuth v5** — JWT strategy; session shape: `{ user: { id, email, username, name } }`
- **Google Gemini API** for AI generation (`GEMINI_API_KEY`)
- **Vercel Blob** for file uploads (`BLOB_READ_WRITE_TOKEN`)
- **Nodemailer** for email verification (`SMTP_*` env vars)
- **Vercel** for hosting — auto-deploys on push to main

## Key file map
```
app/
  page.tsx                          ← Landing page (server, checks auth)
  landing-client.tsx                ← Landing page UI (client, all animations)
  layout.tsx                        ← Root layout, wraps with LanguageProvider
  (auth)/login/ register/ verify/   ← Auth pages
  (dashboard)/dashboard/
    page.tsx                        ← Dashboard home (projects grid)
    admin/page.tsx                  ← Admin analytics (email-gated: piyawat211149@gmail.com)
    ai-builder/                     ← AI portfolio wizard
    projects/[id]/edit/             ← Project edit page
    profile/                        ← Profile settings
  portfolio/[username]/[slug]/      ← Public portfolio page
  api/
    auth/[...nextauth]/             ← NextAuth handler
    projects/ ai-generate/ export-pdf/ upload/  ← API routes

components/
  intro-animation.tsx     ← Plays once per session (sessionStorage "ff-intro-done")
  particle-background.tsx ← Canvas particles in hero
  language-provider.tsx   ← useLang() hook → { t, lang, setLang }
  language-toggle.tsx     ← TH/EN toggle button
  onboarding-tour.tsx     ← First-time user tour

lib/
  i18n.ts     ← Translation keys (TH + EN). Add keys to BOTH languages. Type: TranslationKey
  db.ts       ← Prisma client singleton
  utils.ts    ← parseTags(), cn()
  email.ts    ← sendVerificationEmail()

prisma/schema.prisma  ← Models: User, Project, ProjectFile, VerificationToken, PortfolioPage
auth.ts               ← NextAuth config
```

## Design system (landing-client.tsx)
- Dark mode toggled by `dark` state → persisted in `localStorage("ff-theme")`
- Theme tokens pattern: `const bg = dark ? "bg-[#07070f]" : "bg-white"` etc.
- Color palette: indigo-500/violet-500/purple-500 gradient as brand accent
- Background: fixed aurora blobs (CSS keyframes aurora-1/2/3) spanning full page — NO per-section backgrounds
- Animations defined in inline `<style>` tag: aurora-1/2/3, float-a/b, sq-spin, fade-up
- `.fade-up` + `.in` class + IntersectionObserver for scroll-triggered reveals
- Stagger delay classes: `.d1`–`.d6`
- Parallax: `scrollY * multiplier` in inline transform

## i18n pattern
```ts
// lib/i18n.ts — add key to BOTH en and th objects
export const translations = {
  th: { "landing.myKey": "ภาษาไทย" },
  en: { "landing.myKey": "English" },
} as const
// In component:
const { t, lang } = useLang()
t("landing.myKey")  // returns string
// For typed arrays: titleKey: "landing.feat1Title" as const
```

## Breaking cube animation (hero background)
- 3×3 grid of CSS 3D cubes (`transform-style: preserve-3d`, 6 faces each)
- Continuous rotation via `@keyframes sq-spin` using `rotate3d(0.5,1,0.25,360deg)`
- `breakProgress = min(scrollY/480, 1)` — cubes scatter + fade on scroll
- Face lighting: top=brightest → front → right → left → bottom → back=darkest
- `drop-shadow` scales with Z-position

## Coding conventions
- Always `"use client"` at top of interactive components
- Server Components fetch data and pass to Client Components as props
- File writes: use bash heredoc (`cat > file << 'ENDOFFILE'`) to avoid OneDrive truncation
- Git push: PowerShell uses `;` not `&&` as statement separator
- Admin guard: check `session.user.email === "piyawat211149@gmail.com"`
- Translation keys use dot notation: `"section.thing"` e.g. `"landing.heroDesc"`

## User preferences
- Concise responses — no unnecessary explanation
- Thai language preferred for conversation
- Commits in English imperative form
- Wants animations to be "เว่อร์ๆ" (over the top / impressive)
- Dark mode support is required on all landing page changes
- Always test for mobile responsiveness (`sm:` breakpoints)
