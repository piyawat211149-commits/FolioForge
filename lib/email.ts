import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendVerificationEmail(
  email: string,
  token: string,
  baseUrl: string
) {
  const verifyUrl = `${baseUrl}/api/verify-email?token=${token}`

  // ─── Development mode: print link to terminal instead of sending email ───
  if (!process.env.RESEND_API_KEY) {
    console.log("\n" + "─".repeat(60))
    console.log("📧  DEV MODE — Email verification link:")
    console.log(verifyUrl)
    console.log("─".repeat(60) + "\n")
    return
  }

  // ─── Production: send via Resend ───
  const result = await resend.emails.send({
    from: "FolioForge <onboarding@resend.dev>",
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

  if (result.error) {
    throw new Error(`Resend API error: ${JSON.stringify(result.error)}`)
  }

  console.log("[email] Resend send success, id:", result.data?.id)
}
