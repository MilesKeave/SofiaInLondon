import { useState, useEffect } from 'react'
import './App.css'
import Gallery from './Gallery'
import Header from './Header'
import SearchDropdown from './SearchDropdown'
import ProductPage from './ProductPage'
import CheckoutPage from './CheckoutPage'
import ImageGalleryPage from './ImageGalleryPage'
import AboutPage from './AboutPage'
import ImageGalleryItem from './ImageGalleryItem'
import ShoppingBagSideBar from './ShoppingBagSideBar'
import { fetchGalleryItems, fetchImageGalleryItems } from './api'

function App() {
  const [galleryItems, setGalleryItems] = useState([])
  const [imageGalleryItems, setImageGalleryItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [imageGalleryLoading, setImageGalleryLoading] = useState(true)
  const [error, setError] = useState(null)
  const [imageGalleryError, setImageGalleryError] = useState(null)
  const [searchDropdown, setSearchDropdown] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState('gallery')
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [selectedGalleryItem, setSelectedGalleryItem] = useState(null)
  const [isShoppingBagSideBarOpen, setIsShoppingBagSideBarOpen] = useState(false)
  const [isShoppingBagSideBarClosing, setIsShoppingBagSideBarClosing] = useState(false)

  const closeShoppingBagSideBar = () => {
    setIsShoppingBagSideBarClosing(true)
    setTimeout(() => {
      setIsShoppingBagSideBarOpen(false)
      setIsShoppingBagSideBarClosing(false)
    }, 500)
  }

  useEffect(() => {
    const loadProducts = async () => {
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

    const loadImageGallery = async () => {
      try {
        setImageGalleryLoading(true)
        const data = await fetchImageGalleryItems()
        setImageGalleryItems(data)
        setImageGalleryError(null)
      } catch (err) {
        setImageGalleryError('Failed to fetch image gallery items')
        console.error('Error fetching image gallery items:', err)
      } finally {
        setImageGalleryLoading(false)
      }
    }

    loadProducts()
    loadImageGallery()
  }, [])

  const renderPage = () => {
    if (loading && currentPage === 'gallery') return <p>Loading...</p>
    if (error && currentPage === 'gallery') return <p>Error: {error}</p>
    
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
        return (
          <ProductPage 
            product={selectedProduct}
            onAddToBag={() => setIsShoppingBagSideBarOpen(true)}
          />
        )
      case 'checkout':
        return <CheckoutPage />
      case 'imageGallery':
        if (imageGalleryLoading) return <p>Loading...</p>
        if (imageGalleryError) return <p>Error: {imageGalleryError}</p>
        return (
          <ImageGalleryPage 
            galleryItems={imageGalleryItems} 
            onItemClick={(item) => {
              setSelectedGalleryItem(item)
              setCurrentPage('imageGalleryItem')
            }}
          />
        )
      case 'imageGalleryItem':
        return <ImageGalleryItem item={selectedGalleryItem} />
      case 'about':
        return <AboutPage />
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
      <div className={`mainBody ${currentPage === 'checkout' ? 'checkoutPageActive' : ''}`}>
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
      {isShoppingBagSideBarOpen && (
        <>
          <div 
            className="shoppingBagSidebarOverlay"
            onClick={closeShoppingBagSideBar}
          />
          <ShoppingBagSideBar 
            onClose={closeShoppingBagSideBar}
            isClosing={isShoppingBagSideBarClosing}
            setCurrentPage={setCurrentPage}
          />
        </>
      )}
    </div>
  )
}

export default App
