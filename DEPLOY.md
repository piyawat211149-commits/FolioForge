# 🚀 Deploy FolioForge to Vercel

TypeScript passes ✅ — ready to deploy. Follow these steps:

---

## Step 1 — ลบโฟลเดอร์ .git เดิม (ที่สร้างไม่สำเร็จ)

เปิด Terminal แล้วรัน:

```bash
cd ~/Desktop/FolioForge
rm -rf .git
```

---

## Step 2 — สร้าง Git repo และ push ขึ้น GitHub

```bash
cd ~/Desktop/FolioForge
git init
git branch -m main
git add .
git commit -m "Initial commit: FolioForge"
```

จากนั้นไปที่ https://github.com/new สร้าง repo ชื่อ `folioforge` (private หรือ public ก็ได้) **อย่า** tick "Add README"

แล้วรัน (แทน `YOUR_USERNAME` ด้วย GitHub username ของคุณ):

```bash
git remote add origin https://github.com/YOUR_USERNAME/folioforge.git
git push -u origin main
```

---

## Step 3 — สร้าง Neon Postgres (ฟรี)

1. ไปที่ https://neon.tech → Sign up (ใช้ GitHub login ได้)
2. สร้าง project ชื่อ `folioforge`
3. คลิก **Connection Details** → เลือก **Prisma**
4. คัดลอก `DATABASE_URL` และ `DIRECT_URL` ไว้

---

## Step 4 — Deploy บน Vercel

1. ไปที่ https://vercel.com/new → Sign up / login ด้วย GitHub
2. กด **Import** เลือก repo `folioforge`
3. Framework: **Next.js** (ตรวจจับอัตโนมัติ)
4. กด **Deploy** (จะ fail ครั้งแรก — ไม่เป็นไร)

---

## Step 5 — ตั้ง Environment Variables ใน Vercel

ใน Vercel dashboard → Settings → Environment Variables เพิ่มทั้งหมดนี้:

| Key | Value |
|-----|-------|
| `DATABASE_URL` | จาก Neon (มี `?pgbouncer=true`) |
| `DIRECT_URL` | จาก Neon (ไม่มี pgbouncer) |
| `AUTH_SECRET` | รัน `openssl rand -base64 32` แล้วใส่ผลลัพธ์ |
| `NEXTAUTH_URL` | `https://your-app.vercel.app` (ใส่ URL จริงหลัง deploy) |
| `SMTP_HOST` | `smtp.gmail.com` |
| `SMTP_PORT` | `587` |
| `SMTP_USER` | Gmail ของคุณ |
| `SMTP_PASS` | [App Password](https://myaccount.google.com/apppasswords) (16 ตัว) |
| `SMTP_FROM` | `FolioForge <your-gmail@gmail.com>` |
| `GEMINI_API_KEY` | จาก https://aistudio.google.com/apikey |

---

## Step 6 — เพิ่ม Vercel Blob Storage

1. Vercel dashboard → **Storage** tab → **Create Database** → **Blob**
2. ตั้งชื่อ `folioforge-blob` → Create
3. Link ไปที่ project → `BLOB_READ_WRITE_TOKEN` จะถูกเพิ่มอัตโนมัติ

---

## Step 7 — รัน Database Migration

เปิด Terminal บนเครื่องของคุณ:

```bash
cd ~/Desktop/FolioForge
npx prisma db push
```

(ต้องมี `.env` ที่มี `DATABASE_URL` และ `DIRECT_URL` จาก Neon ก่อน)

---

## Step 8 — Redeploy

Vercel dashboard → **Deployments** → **Redeploy** (หรือ push commit ใหม่)

---

## ✅ เสร็จแล้ว!

เว็บจะอยู่ที่ `https://folioforge-xxx.vercel.app`

คัดลอก URL นั้นไปใส่ `NEXTAUTH_URL` แล้ว Redeploy อีกครั้งหนึ่ง

---

## สรุป .env ที่ต้องสร้างบนเครื่อง (สำหรับ db push)

สร้างไฟล์ `.env` ใน `~/Desktop/FolioForge/`:

```env
DATABASE_URL="postgresql://..."   # จาก Neon (pgbouncer)
DIRECT_URL="postgresql://..."     # จาก Neon (direct)
AUTH_SECRET="..."
NEXTAUTH_URL="http://localhost:3000"
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER=""
SMTP_PASS=""
SMTP_FROM=""
GEMINI_API_KEY=""
BLOB_READ_WRITE_TOKEN=""
```
