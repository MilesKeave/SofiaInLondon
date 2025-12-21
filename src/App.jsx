import { useState, useEffect } from 'react'
import './App.css'
import Gallery from './Gallery'
import Header from './Header'
import { fetchGalleryItems } from './api'

function App() {
  const [galleryItems, setGalleryItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadGalleryItems = async () => {
      try {
        setLoading(true)
        const data = await fetchGalleryItems()
        setGalleryItems(data)
        setError(null)
      } catch (err) {
        setError('Failed to fetch gallery items')
        console.error('Error fetching gallery items:', err)
      } finally {
        setLoading(false)
      }
    }

    loadGalleryItems()
  }, [])

  return (
    <div className="homePage">
      <Header />
      <div className="mainBody">
        {loading && <p>Loading...</p>}
        {error && <p>Error: {error}</p>}
        {!loading && !error && <Gallery galleryItems={galleryItems} />}
      </div>
    </div>
  )
}

export default App
