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

const productDetails = {
  'thurloe-handheld-bag': { name: 'Thurloe Handheld Bag', price: 12 },
  'saville-top':          { name: 'Saville Top',          price: 16 },
  'carlisle-skirt':       { name: 'Carlisle Skirt',       price: 12 },
}

async function fetchAttachment(url, filename) {
  try {
    const res = await fetch(url)
    if (!res.ok) return null
    const buffer = await res.arrayBuffer()
    return { filename, content: Buffer.from(buffer) }
  } catch {
    return null
  }
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
    const total = (session.amount_total / 100).toFixed(2)

    // Build product rows (image left, name + price right)
    const productRowsHtml = productIds.map(id => {
      const product = productDetails[id] || { name: id, price: '—' }
      const imageUrl = `${siteUrl}/products/${id}/image-1.jpg`
      return `
        <tr>
          <td style="padding: 24px 0; border-bottom: 1px solid #e8e8e8;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td width="120" valign="top">
                  <img src="${imageUrl}" width="110" style="display: block; width: 110px; aspect-ratio: 3/4; object-fit: cover;" alt="${product.name}" />
                </td>
                <td valign="top" style="padding-left: 24px;">
                  <p style="margin: 0 0 8px 0; font-size: 13px; font-weight: 400; color: black;">${product.name}</p>
                  <p style="margin: 0; font-size: 13px; color: black;">$${product.price}.00</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      `
    }).join('')

    // Fetch all PDFs as attachments
    const attachmentPromises = productIds.flatMap(id => [
      fetchAttachment(`${siteUrl}/products/${id}/instruction.pdf`,   `${productDetails[id]?.name || id} - Instructions.pdf`),
      fetchAttachment(`${siteUrl}/products/${id}/pattern-a4.pdf`,    `${productDetails[id]?.name || id} - Pattern A4.pdf`),
      fetchAttachment(`${siteUrl}/products/${id}/pattern-letter.pdf`,`${productDetails[id]?.name || id} - Pattern Letter.pdf`),
    ])
    const attachmentResults = await Promise.all(attachmentPromises)
    const attachments = attachmentResults.filter(Boolean)

    await resend.emails.send({
      from: 'SIL New York <sofia@silnewyork.com>',
      to: customerEmail,
      subject: 'ORDER SUMMARY',
      attachments,
      html: `
        <div style="display:none; max-height:0px; overflow:hidden; mso-hide:all;" aria-hidden="true">SIL NEW YORK</div>
        <div style="display:none; max-height:0px; overflow:hidden; mso-hide:all;" aria-hidden="true">&#847;&zwnj;&nbsp;&#8199;&shy; &#847;&zwnj;&nbsp;&#8199;&shy; &#847;&zwnj;&nbsp;&#8199;&shy; &#847;&zwnj;&nbsp;&#8199;&shy; &#847;&zwnj;&nbsp;&#8199;&shy; &#847;&zwnj;&nbsp;&#8199;&shy; &#847;&zwnj;&nbsp;&#8199;&shy; &#847;&zwnj;&nbsp;&#8199;&shy; &#847;&zwnj;&nbsp;&#8199;&shy; &#847;&zwnj;&nbsp;&#8199;&shy; &#847;&zwnj;&nbsp;&#8199;&shy; &#847;&zwnj;&nbsp;&#8199;&shy; &#847;&zwnj;&nbsp;&#8199;&shy; &#847;&zwnj;&nbsp;&#8199;&shy; &#847;&zwnj;&nbsp;&#8199;&shy; &#847;&zwnj;&nbsp;&#8199;&shy; &#847;&zwnj;&nbsp;&#8199;&shy; &#847;&zwnj;&nbsp;&#8199;&shy; &#847;&zwnj;&nbsp;&#8199;&shy; &#847;&zwnj;&nbsp;&#8199;&shy; &#847;&zwnj;&nbsp;&#8199;&shy; &#847;&zwnj;&nbsp;&#8199;&shy; &#847;&zwnj;&nbsp;&#8199;&shy; &#847;&zwnj;&nbsp;&#8199;&shy; &#847;&zwnj;&nbsp;&#8199;&shy; &#847;&zwnj;&nbsp;&#8199;&shy; &#847;&zwnj;&nbsp;&#8199;&shy; &#847;&zwnj;&nbsp;&#8199;&shy; &#847;&zwnj;&nbsp;&#8199;&shy; &#847;&zwnj;&nbsp;&#8199;&shy; &#847;&zwnj;&nbsp;&#8199;&shy; &#847;&zwnj;&nbsp;&#8199;&shy; &#847;&zwnj;&nbsp;&#8199;&shy; &#847;&zwnj;&nbsp;&#8199;&shy; &#847;&zwnj;&nbsp;&#8199;&shy; &#847;&zwnj;&nbsp;&#8199;&shy; &#847;&zwnj;&nbsp;&#8199;&shy; &#847;&zwnj;&nbsp;&#8199;&shy; &#847;&zwnj;&nbsp;&#8199;&shy; &#847;&zwnj;&nbsp;&#8199;&shy; &#847;&zwnj;&nbsp;&#8199;&shy; &#847;&zwnj;&nbsp;&#8199;&shy; &#847;&zwnj;&nbsp;&#8199;&shy; &#847;&zwnj;&nbsp;&#8199;&shy; &#847;&zwnj;&nbsp;&#8199;&shy; &#847;&zwnj;&nbsp;&#8199;&shy; &#847;&zwnj;&nbsp;&#8199;&shy; &#847;&zwnj;&nbsp;&#8199;&shy; &#847;&zwnj;&nbsp;&#8199;&shy; &#847;&zwnj;&nbsp;&#8199;&shy;</div>
        <div style="max-width: 560px; margin: 0 auto; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: black; padding: 48px 24px; background: white;">

          <!-- Logo / Brand -->
          <div style="margin-bottom: 48px; text-align: center;">
            <img src="${siteUrl}/favicon.png" width="60" height="60" style="display: inline-block; margin-bottom: 12px;" alt="SIL New York logo" />
            <p style="margin: 0; font-size: 22px; font-weight: 300; letter-spacing: 0.25em; text-transform: uppercase; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">SIL NEW YORK</p>
          </div>

          <!-- Section label -->
          <p style="margin: 0 0 6px 0; font-size: 13px; font-weight: 300; color: black;">Order</p>

          <!-- Products -->
          <table width="100%" cellpadding="0" cellspacing="0" border="0">
            ${productRowsHtml}
          </table>

          <!-- Totals -->
          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top: 32px;">
            <tr>
              <td style="padding: 10px 0; font-size: 13px; font-weight: 300; color: black;">item total</td>
              <td style="padding: 10px 0; font-size: 13px; font-weight: 300; color: black; text-align: right;">$${total}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; font-size: 13px; font-weight: 600; color: black; border-top: 1px solid #e8e8e8;">total</td>
              <td style="padding: 10px 0; font-size: 13px; font-weight: 600; color: black; text-align: right; border-top: 1px solid #e8e8e8;">$${total}</td>
            </tr>
          </table>

          <!-- Footer -->
          <p style="margin-top: 48px; font-size: 11px; color: #555; line-height: 2; text-align: center;">
            Your PDF's are attached to this email.<br/>
            Questions? Reach us at sofia@silnewyork.com
          </p>

        </div>
      `
    })
  }

  res.json({ received: true })
}
