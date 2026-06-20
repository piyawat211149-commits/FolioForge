# FolioForge — Student Portfolio Builder

A professional portfolio builder for students to showcase projects and submit with university applications.

## Features

- **Authentication** — Sign up with email/password, email verification required
- **Project Management** — Add, edit, delete projects with image/PDF uploads
- **Public Portfolio** — Share `/portfolio/[username]` with anyone
- **3 Themes** — Minimal, Dark, Classic (switchable on the public page)
- **PDF Export** — One-click print-to-PDF from the portfolio page
- **Private/Public toggle** — Control which projects appear publicly

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Database | SQLite + Prisma ORM |
| Auth | Auth.js v5 (NextAuth) |
| Styling | Tailwind CSS v4 |
| Email | Nodemailer (SMTP) |
| Files | Local filesystem (`/public/uploads`) |

## Quick Start

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

**Required:**
- `AUTH_SECRET` — Generate with: `openssl rand -base64 32`
- `DATABASE_URL` — Default: `file:./dev.db` (SQLite, works out of the box)

**For email verification (required for accounts to work):**
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`

> **Quick SMTP options:**
> - **Gmail**: Enable 2FA → create an [App Password](https://myaccount.google.com/apppasswords), use `smtp.gmail.com:587`
> - **Resend**: Sign up at [resend.com](https://resend.com) — free tier, easy setup
> - **Dev/testing**: Use [Ethereal Email](https://ethereal.email) to capture emails locally

### 3. Set up the database

```bash
npm run db:push
```

This creates `prisma/dev.db` (SQLite file) with all tables.

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Deployment

### Option A: VPS / Railway / Render (recommended)

Works with SQLite + local file storage. These platforms provide persistent disk storage.

```bash
# Build
npm run build

# Start
npm run start
```

Set environment variables in your platform's dashboard.

### Option B: Vercel

Vercel is serverless — **SQLite and local file storage won't persist between requests.**

You must upgrade before deploying to Vercel for production:

**Database → PostgreSQL**

1. Create a free database at [Neon](https://neon.tech) or [Supabase](https://supabase.com)
2. Update `prisma/schema.prisma`:
   ```prisma
   datasource db {
     provider = "postgresql"  // change from "sqlite"
     url      = env("DATABASE_URL")
   }
   ```
3. Update `DATABASE_URL` to your Postgres connection string
4. Run `npm run db:migrate`

> The schema is intentionally written to be Postgres-compatible (no SQLite-specific features), so migration is straightforward.

**File Storage → Cloud Storage**

Replace local file upload with [Vercel Blob](https://vercel.com/docs/storage/vercel-blob), [Cloudinary](https://cloudinary.com), or [AWS S3](https://aws.amazon.com/s3).

Update `app/api/upload/route.ts` to use your cloud provider's SDK instead of writing to disk.

---

## Project Structure

```
app/
  (auth)/           # Login, register, verify-email pages
  (dashboard)/      # Protected pages (require login)
    dashboard/      # Project list + profile editor
  portfolio/[username]/  # Public portfolio page
  api/              # API routes
lib/
  db.ts             # Prisma client singleton
  email.ts          # Nodemailer email sender
  utils.ts          # Helpers
prisma/
  schema.prisma     # Database schema
public/
  uploads/          # User-uploaded files
```

## Customization

**Add more themes**: Edit the CSS variables in `app/globals.css` under `[data-theme="..."]` blocks.

**Change max upload size**: Edit `MAX_FILE_SIZE` in `app/api/upload/route.ts`.

**Remove email verification**: Remove the `emailVerified` check in `auth.ts` `authorize()` function (not recommended for production).
