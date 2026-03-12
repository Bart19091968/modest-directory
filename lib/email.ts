import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

const FROM_EMAIL = process.env.FROM_EMAIL || 'noreply@modestdirectory.be'
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

export async function sendVerificationEmail(
  to: string,
  reviewerName: string,
  shopName: string,
  score: number,
  reviewText: string,
  verificationToken: string
) {
  const verifyUrl = `${SITE_URL}/verify/${verificationToken}`

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #5d7a5d; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f8f7f5; padding: 30px; border-radius: 0 0 8px 8px; }
        .review-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #e0e0e0; }
        .stars { color: #f4b942; font-size: 24px; }
        .button { display: inline-block; background: #5d7a5d; color: white; padding: 15px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
        .button:hover { background: #4a624a; }
        .footer { text-align: center; color: #777; font-size: 14px; margin-top: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Bevestig je review</h1>
        </div>
        <div class="content">
          <p>Beste ${reviewerName},</p>
          <p>Bedankt voor je review voor <strong>${shopName}</strong>!</p>
          
          <div class="review-box">
            <p class="stars">${'★'.repeat(score)}${'☆'.repeat(5 - score)}</p>
            <p><em>"${reviewText}"</em></p>
          </div>
          
          <p>Klik op onderstaande knop om je review te bevestigen:</p>
          
          <a href="${verifyUrl}" class="button">Bevestig mijn review</a>
          
          <p style="color: #777; font-size: 14px;">Of kopieer deze link: ${verifyUrl}</p>
        </div>
        <div class="footer">
          <p>ModestDirectory.be - Islamitische kledingwinkels in NL & BE</p>
        </div>
      </div>
    </body>
    </html>
  `

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: `Bevestig je review voor ${shopName}`,
      html,
    })
    return { success: true }
  } catch (error) {
    console.error('Email error:', error)
    return { success: false, error }
  }
}

export async function sendShopRegistrationNotification(
  shopName: string,
  shopEmail: string,
  contactName: string
) {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@modestdirectory.be'

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
    </head>
    <body>
      <h2>Nieuwe shop aanmelding</h2>
      <p><strong>Shop naam:</strong> ${shopName}</p>
      <p><strong>Contact:</strong> ${contactName}</p>
      <p><strong>Email:</strong> ${shopEmail}</p>
      <p>Log in op het admin panel om de aanvraag te beoordelen.</p>
    </body>
    </html>
  `

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: adminEmail,
      subject: `Nieuwe shop aanmelding: ${shopName}`,
      html,
    })
    return { success: true }
  } catch (error) {
    console.error('Email error:', error)
    return { success: false, error }
  }
}
