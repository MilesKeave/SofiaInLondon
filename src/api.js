const PRODUCTS_API_URL = import.meta.env.DEV 
  ? '/mockData.json' 
  : 'https://api.example.com/products'

const GALLERY_API_URL = import.meta.env.DEV 
  ? '/galleryData.json' 
  : 'https://api.example.com/gallery-items'

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
    const response = await fetch(GALLERY_API_URL)
    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status}`)
    }
    const data = await response.json()
    return data
  } catch (error) {
    throw new Error(`Failed to fetch image gallery items: ${error.message}`)
  }
}

