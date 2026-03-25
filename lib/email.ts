import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendVerificationEmail(
  to: string,
  shopName: string,
  verificationToken: string
) {
  const verificationUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/verify/${verificationToken}`
  
  try {
    await resend.emails.send({
      from: process.env.FROM_EMAIL || 'noreply@modestdirectory.be',
      to,
      subject: `Bevestig je review voor ${shopName}`,
      html: `
        <h2>Bedankt voor je review!</h2>
        <p>Je hebt een review achtergelaten voor <strong>${shopName}</strong>.</p>
        <p>Klik op de onderstaande link om je review te bevestigen:</p>
        <p><a href="${verificationUrl}" style="background-color: #5d7a5d; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block;">Bevestig Review</a></p>
        <p>Of kopieer deze link: ${verificationUrl}</p>
        <p>Deze link is 24 uur geldig.</p>
        <br>
        <p>Met vriendelijke groet,<br>ModestDirectory</p>
      `
    })
    return true
  } catch (error) {
    console.error('Email error:', error)
    return false
  }
}

export async function sendNewShopNotification(
  shopName: string,
  email: string,
  city?: string,
  invoiceRequested?: boolean
) {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@modestdirectory.be'
  
  try {
    await resend.emails.send({
      from: process.env.FROM_EMAIL || 'noreply@modestdirectory.be',
      to: adminEmail,
      subject: `Nieuwe winkel aangemeld: ${shopName}${invoiceRequested ? ' (factuur gewenst)' : ''}`,
      html: `
        <h2>Nieuwe winkel aanmelding</h2>
        <p><strong>Naam:</strong> ${shopName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Stad:</strong> ${city || 'Niet opgegeven'}</p>
        <p><strong>Factuur gewenst:</strong> ${invoiceRequested ? 'Ja' : 'Nee'}</p>
        <hr>
        <p><strong>Betalingsgegevens voor klant:</strong></p>
        <p>€100 naar BE07 9734 4192 5566</p>
        <hr>
        <p><a href="${process.env.NEXT_PUBLIC_SITE_URL}/admin/shops">Bekijk in admin panel</a></p>
      `
    })
    return true
  } catch (error) {
    console.error('Email error:', error)
    return false
  }
}
