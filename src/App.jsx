import { useState, useEffect } from 'react'
import './App.css'
import Gallery from './Gallery'
import Header from './Header'
import SearchDropdown from './SearchDropdown'
import { fetchGalleryItems } from './api'

function App() {
  const [galleryItems, setGalleryItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchDropdown, setSearchDropdown] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

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
      <Header searchDropdown={searchDropdown} setSearchDropdown={setSearchDropdown} />
      <div className="mainBody">
        {searchDropdown && (
          <SearchDropdown 
            onClose={() => setSearchDropdown(false)} 
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            galleryItems={galleryItems}
          />
        )}
        {loading && <p>Loading...</p>}
        {error && <p>Error: {error}</p>}
        {!loading && !error && (
          <Gallery galleryItems={galleryItems.filter(item => 
            item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.description.toLowerCase().includes(searchTerm.toLowerCase())
          )} />
        )}
      </div>
    </div>
  )
}

export default App
