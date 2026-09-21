const PRODUCTS_API_URL = '/productsData.json'

const INSTAGRAM_TOKEN = import.meta.env.VITE_INSTAGRAM_TOKEN
const INSTAGRAM_API_URL = `https://graph.instagram.com/me/media?fields=id,media_type,media_url,thumbnail_url,children{media_url}&limit=24&access_token=${INSTAGRAM_TOKEN}`

export const fetchGalleryItems = async () => {
  try {
    const response = await fetch(PRODUCTS_API_URL)
    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status}`)
    }
    const data = await response.json()
    return data
  } catch (error) {
    throw new Error(`Failed to fetch gallery items: ${error.message}`)
  }
}

export const fetchImageGalleryItems = async () => {
  try {
    const [igResponse, linksResponse, productsResponse] = await Promise.all([
      fetch(INSTAGRAM_API_URL),
      fetch('/galleryLinks.json'),
      fetch('/productsData.json')
    ])

    if (!igResponse.ok) throw new Error(`Failed to fetch Instagram: ${igResponse.status}`)

    const [igJson, links, products] = await Promise.all([
      igResponse.json(),
      linksResponse.json(),
      productsResponse.json()
    ])

    return igJson.data
      .filter(post => post.media_type === 'IMAGE' || post.media_type === 'CAROUSEL_ALBUM')
      .map(post => {
        const linkedProductIds = links[post.id] || []
        const linkedProducts = linkedProductIds.map(id => products.find(p => p.id === id)).filter(Boolean)
        return {
          id: post.id,
          photoUrl: post.media_url,
          hoverUrl: post.children?.data?.[1]?.media_url || null,
          mediaType: post.media_type,
          linkedProducts,
        }
      })
  } catch (error) {
    throw new Error(`Failed to fetch Instagram feed: ${error.message}`)
  }
}

