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
import SuccessPage from './SuccessPage'

const pageToUrl = {
  gallery: '/',
  product: '/product',
  checkout: '/checkout',
  imageGallery: '/gallery',
  imageGalleryItem: '/gallery/item',
  about: '/about',
}

const urlToPage = {
  '/': 'gallery',
  '/product': 'product',
  '/checkout': 'checkout',
  '/gallery': 'imageGallery',
  '/gallery/item': 'imageGalleryItem',
  '/about': 'about',
}

function App() {
  const [galleryItems, setGalleryItems] = useState([])
  const [imageGalleryItems, setImageGalleryItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [imageGalleryLoading, setImageGalleryLoading] = useState(true)
  const [error, setError] = useState(null)
  const [imageGalleryError, setImageGalleryError] = useState(null)
  const [searchDropdown, setSearchDropdown] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const isSuccess = new URLSearchParams(window.location.search).get('success') === 'true'
  const initialPage = isSuccess ? 'success' : (urlToPage[window.location.pathname] || 'gallery')
  const [currentPage, setCurrentPage] = useState(initialPage)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [selectedGalleryItem, setSelectedGalleryItem] = useState(null)
  const [isShoppingBagSideBarOpen, setIsShoppingBagSideBarOpen] = useState(false)
  const [isShoppingBagSideBarClosing, setIsShoppingBagSideBarClosing] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isMobileMenuClosing, setIsMobileMenuClosing] = useState(false)

  const navigate = (page, { product, galleryItem } = {}) => {
    const nextProduct = product !== undefined ? product : selectedProduct
    const nextGalleryItem = galleryItem !== undefined ? galleryItem : selectedGalleryItem
    if (product !== undefined) setSelectedProduct(product)
    if (galleryItem !== undefined) setSelectedGalleryItem(galleryItem)
    setCurrentPage(page)
    const url = pageToUrl[page] || '/'
    history.pushState({ page, selectedProduct: nextProduct, selectedGalleryItem: nextGalleryItem }, '', url)
  }

  useEffect(() => {
    history.replaceState(
      { page: initialPage, selectedProduct: null, selectedGalleryItem: null },
      '',
      window.location.href
    )

    const handlePopState = (e) => {
      if (!e.state) return
      const { page, selectedProduct: prod, selectedGalleryItem: item } = e.state
      if (prod !== undefined) setSelectedProduct(prod)
      if (item !== undefined) setSelectedGalleryItem(item)
      setCurrentPage(page || 'gallery')
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  const closeMobileMenu = () => {
    setIsMobileMenuClosing(true)
    setTimeout(() => {
      setMobileMenuOpen(false)
      setIsMobileMenuClosing(false)
    }, 800)
  }

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
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description.toLowerCase().includes(searchTerm.toLowerCase())
        )
        return (
          <Gallery
            galleryItems={filteredGalleryItems}
            onProductClick={(product) => navigate('product', { product })}
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
            onItemClick={(item) => navigate('imageGalleryItem', { galleryItem: item })}
          />
        )
      case 'imageGalleryItem':
        return (
          <ImageGalleryItem
            item={selectedGalleryItem}
            onProductClick={(product) => navigate('product', { product })}
            onAddToBag={() => setIsShoppingBagSideBarOpen(true)}
          />
        )
      case 'success':
        return <SuccessPage setCurrentPage={(page) => navigate(page)} />
      case 'about':
        return <AboutPage />
      default:
        return (
          <Gallery
            galleryItems={galleryItems}
            onProductClick={(product) => navigate('product', { product })}
          />
        )
    }
  }

  return (
    <div className="homePage">
      <Header
        searchDropdown={searchDropdown}
        setSearchDropdown={setSearchDropdown}
        setCurrentPage={(page) => navigate(page)}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        isMobileMenuClosing={isMobileMenuClosing}
        closeMobileMenu={closeMobileMenu}
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
                navigate('product', { product })
                setSearchDropdown(false)
              }}
              onSearch={() => navigate('gallery')}
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
            setCurrentPage={(page) => navigate(page)}
          />
        </>
      )}
    </div>
  )
}

export default App
