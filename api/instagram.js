export default async function handler(req, res) {
  const token = process.env.VITE_INSTAGRAM_TOKEN
  if (!token) {
    return res.status(500).json({ error: 'Instagram token not configured' })
  }

  const url = `https://graph.instagram.com/me/media?fields=id,media_type,media_url,thumbnail_url,caption,children{media_url}&limit=24&access_token=${token}`

  const response = await fetch(url)
  const data = await response.json()

  if (!response.ok) {
    return res.status(response.status).json(data)
  }

  res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600')
  return res.status(200).json(data)
}
