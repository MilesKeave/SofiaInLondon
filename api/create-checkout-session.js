import Stripe from 'stripe'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
  const { items } = req.body
  const siteUrl = process.env.VITE_SITE_URL

  const lineItems = items.map(item => ({
    price_data: {
      currency: 'usd',
      product_data: { name: item.name },
      unit_amount: Math.round(item.priceValue * 100),
    },
    quantity: 1,
  }))

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: lineItems,
    mode: 'payment',
    success_url: `${siteUrl}?success=true&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${siteUrl}`,
    metadata: {
      productIds: JSON.stringify(items.map(i => i.id))
    }
  })

  res.json({ url: session.url })
}
