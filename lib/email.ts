import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

export async function sendVerificationEmail(
  email: string,
  token: string,
  baseUrl: string
) {
  const verifyUrl = `${baseUrl}/api/verify-email?token=${token}`

  if (!process.env.SMTP_HOST) {
    console.log("\n" + "─".repeat(60))
    console.log("📧  DEV MODE — Email verification link:")
    console.log(verifyUrl)
    console.log("─".repeat(60) + "\n")
    return
  }

  const info = await transporter.sendMail({
    from: process.env.SMTP_FROM || "FolioForge <noreply@folioforge.app>",
    to: email,
    subject: "Verify your FolioForge account",
    html: `
      <div style="font-family:-apple-system,sans-serif;max-width:480px;margin:0 auto;padding:40px 20px;">
        <h1 style="font-size:24px;font-weight:700;color:#000;margin-bottom:8px;">FolioForge</h1>
        <p style="color:#555;margin-bottom:32px;font-size:14px;">Portfolio Builder</p>
        <h2 style="font-size:20px;font-weight:600;color:#000;margin-bottom:16px;">Verify your email</h2>
        <p style="color:#333;line-height:1.6;margin-bottom:32px;">
          Click the button below to verify your email address. This link expires in 24 hours.
        </p>
        <a href="${verifyUrl}"
           style="display:inline-block;background:#000;color:#fff;padding:14px 28px;text-decoration:none;font-weight:600;font-size:14px;letter-spacing:0.05em;">
          VERIFY EMAIL
        </a>
        <p style="color:#999;font-size:12px;margin-top:32px;">
          If you didn't create a FolioForge account, ignore this email.
        </p>
      </div>
    `,
  })

}
