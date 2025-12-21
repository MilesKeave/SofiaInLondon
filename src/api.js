const API_URL = import.meta.env.DEV 
  ? '/mockData.json' 
  : 'https://api.example.com/gallery-items'

export const fetchGalleryItems = async () => {
  try {
    const response = await fetch(API_URL)
    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status}`)
    }
    const data = await response.json()
    return data
  } catch (error) {
    throw new Error(`Failed to fetch gallery items: ${error.message}`)
  }
}

