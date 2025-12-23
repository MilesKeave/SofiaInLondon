import { useState, useEffect } from 'react'
import './App.css'
import Gallery from './Gallery'
import Header from './Header'
import SearchDropdown from './SearchDropdown'
import ProductPage from './ProductPage'
import CheckoutPage from './CheckoutPage'
import OtherGalleryPage from './OtherGalleryPage'
import { fetchGalleryItems } from './api'

function App() {
  const [galleryItems, setGalleryItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchDropdown, setSearchDropdown] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState('gallery')
  const [selectedProduct, setSelectedProduct] = useState(null)

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

  const renderPage = () => {
    if (loading) return <p>Loading...</p>
    if (error) return <p>Error: {error}</p>
    
    switch (currentPage) {
      case 'gallery':
        const filteredGalleryItems = galleryItems.filter(item => 
          item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description.toLowerCase().includes(searchTerm.toLowerCase())
        )
        return (
          <Gallery 
            galleryItems={filteredGalleryItems} 
            onProductClick={(product) => {
              setSelectedProduct(product)
              setCurrentPage('product')
            }}
          />
        )
      case 'product':
        return <ProductPage product={selectedProduct} />
      case 'checkout':
        return <CheckoutPage />
      case 'otherGallery':
        return <OtherGalleryPage />
      default:
        return (
          <Gallery 
            galleryItems={galleryItems} 
            onProductClick={(product) => {
              setSelectedProduct(product)
              setCurrentPage('product')
            }}
          />
        )
    }
  }

  return (
    <div className="homePage">
      <Header 
        searchDropdown={searchDropdown} 
        setSearchDropdown={setSearchDropdown}
        setCurrentPage={setCurrentPage}
      />
      <div className="mainBody">
        {searchDropdown && (
          <>
            <div 
              className="searchOverlay"
              onClick={() => setSearchDropdown(false)}
            />
            <SearchDropdown 
              onClose={() => setSearchDropdown(false)} 
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              galleryItems={galleryItems}
              onProductClick={(product) => {
                setSelectedProduct(product)
                setCurrentPage('product')
                setSearchDropdown(false)
              }}
              onSearch={() => {
                setCurrentPage('gallery')
              }}
            />
          </>
        )}
        {renderPage()}
      </div>
    </div>
  )
}

export default App
