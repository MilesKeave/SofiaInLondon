import { useEffect, useState } from 'react'
import './Header.css'
import { useShoppingBag } from './ShoppingBagContext'

function Header({ searchDropdown, setSearchDropdown, setCurrentPage, mobileMenuOpen, setMobileMenuOpen, isMobileMenuClosing, closeMobileMenu }) {
  const { getTotalItems } = useShoppingBag()
  const [isMenuOpening, setIsMenuOpening] = useState(false)
  
  useEffect(() => {
    if (mobileMenuOpen && !isMobileMenuClosing) {
      // Small delay to ensure element is rendered before adding open class
      const timer = setTimeout(() => {
        setIsMenuOpening(true)
      }, 10)
      return () => clearTimeout(timer)
    } else {
      setIsMenuOpening(false)
    }
  }, [mobileMenuOpen, isMobileMenuClosing])
  
  const handleMenuClick = (page) => {
    setCurrentPage(page)
    if (closeMobileMenu) {
      closeMobileMenu()
    } else {
      setMobileMenuOpen(false)
    }
  }

  return (
    <>
      <div 
        className="mainHeader"
        onClick={() => {
          if (searchDropdown) {
            setSearchDropdown(false)
          }
        }}
      >
          <button 
            className="burgerMenu"
            onClick={(e) => {
              e.stopPropagation()
              if (mobileMenuOpen && closeMobileMenu) {
                closeMobileMenu()
              } else {
                setMobileMenuOpen(true)
              }
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
              <path fillRule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"/>
            </svg>
          </button>
          <div className="navbar">
              <div className="navbar-left">
                  <button onClick={() => setCurrentPage('gallery')}>Shop</button>
                      <button onClick={() => setCurrentPage('imageGallery')}>Gallery</button>
              </div>
              <div className="navbar-center">
                  <h1>SOFIA IN LONDON</h1>
              </div>
              <div className="navbar-right">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation()
                      setSearchDropdown(!searchDropdown)
                    }}
                  >
                    Search
                  </button>
                  <button onClick={() => setCurrentPage('about')}>About</button>
                  <button onClick={() => setCurrentPage('checkout')}>
                    Shopping Bag ({getTotalItems()})
                  </button>
              </div>
          </div>
          <div className="subTitle">
              <h3>Digital Patterns</h3>
          </div>
      </div>
      {(mobileMenuOpen || isMobileMenuClosing) && (
        <>
          <div 
            className="mobileMenuOverlay"
            onClick={closeMobileMenu || (() => setMobileMenuOpen(false))}
          />
          <div className={`mobileMenuSidebar ${isMenuOpening && !isMobileMenuClosing ? 'open' : ''} ${isMobileMenuClosing ? 'closing' : ''}`}>
            <button 
              className="mobileMenuClose"
              onClick={closeMobileMenu || (() => setMobileMenuOpen(false))}
            >
              ×
            </button>
            <button onClick={() => handleMenuClick('gallery')}>Shop</button>
            <button onClick={() => handleMenuClick('imageGallery')}>Gallery</button>
            <button 
              onClick={(e) => {
                e.stopPropagation()
                setSearchDropdown(!searchDropdown)
                if (closeMobileMenu) {
                  closeMobileMenu()
                } else {
                  setMobileMenuOpen(false)
                }
              }}
            >
              Search
            </button>
            <button onClick={() => handleMenuClick('about')}>About</button>
            <button onClick={() => handleMenuClick('checkout')}>
              Shopping Bag ({getTotalItems()})
            </button>
          </div>
        </>
      )}
    </>
  )
}

export default Header