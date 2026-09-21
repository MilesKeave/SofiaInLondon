import Stripe from 'stripe'
import { Resend } from 'resend'

export const config = {
  api: { bodyParser: false }
}

async function getRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = []
    req.on('data', chunk => chunks.push(chunk))
    req.on('end', () => resolve(Buffer.concat(chunks)))
    req.on('error', reject)
  })
}

const productNames = {
  'thurloe-handheld-bag': 'Thurloe Handheld Bag',
  'saville-top': 'Saville Top',
  'carlisle-skirt': 'Carlisle Skirt',
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
  const resend = new Resend(process.env.RESEND_API_KEY)
  const siteUrl = process.env.VITE_SITE_URL

  const rawBody = await getRawBody(req)
  const sig = req.headers['stripe-signature']

  let event
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET)
  } catch (err) {
    return res.status(400).json({ error: `Webhook error: ${err.message}` })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object
    const customerEmail = session.customer_details.email
    const productIds = JSON.parse(session.metadata.productIds)

    const downloadsHtml = productIds.map(id => `
      <div style="margin-bottom: 28px;">
        <p style="font-size: 13px; font-weight: 300; letter-spacing: 0.05em; margin: 0 0 10px 0; text-transform: uppercase;">${productNames[id] || id}</p>
        <a href="${siteUrl}/products/${id}/instruction.pdf" style="display: block; font-size: 12px; color: black; text-decoration: none; margin-bottom: 5px;">→ Instructions</a>
        <a href="${siteUrl}/products/${id}/pattern-a4.pdf" style="display: block; font-size: 12px; color: black; text-decoration: none; margin-bottom: 5px;">→ Pattern (A4)</a>
        <a href="${siteUrl}/products/${id}/pattern-letter.pdf" style="display: block; font-size: 12px; color: black; text-decoration: none;">→ Pattern (Letter)</a>
      </div>
    `).join('')

    await resend.emails.send({
      from: 'SIL New York <onboarding@resend.dev>',
      to: customerEmail,
      subject: 'Your SIL New York Downloads',
      html: `
        <div style="max-width: 480px; margin: 0 auto; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: black; padding: 48px 24px;">
          <h1 style="font-size: 14px; font-weight: 300; letter-spacing: 0.15em; margin: 0 0 40px 0; text-transform: uppercase;">SIL New York</h1>
          <p style="font-size: 13px; font-weight: 300; line-height: 1.7; margin: 0 0 40px 0;">Thank you for your purchase. Your downloads are ready below.</p>
          ${downloadsHtml}
          <p style="font-size: 11px; color: #999; margin-top: 48px; line-height: 1.6;">Questions? Reach us at sbkeaveny@gmail.com</p>
        </div>
      `
    })
  }

  res.json({ received: true })
}
