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
          <div className="navbar">
              <div className="navbar-left">
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
                  <button className="navbar-left-button" onClick={() => setCurrentPage('gallery')}>Shop</button>
                  <button className="navbar-left-button" onClick={() => setCurrentPage('imageGallery')}>Gallery</button>
              </div>
              <div className="navbar-center">
                  <h1>SOFIA IN LONDON</h1>
              </div>
              <div className="navbar-right">
                <button 
                  className="searchButton"
                  onClick={(e) => {
                    e.stopPropagation()
                    setSearchDropdown(!searchDropdown)
                  }}
                >
                  <svg className="searchIcon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/>
                  </svg>
                  <span className="searchButtonText">Search</span>
                </button>
                <button className="aboutButton" onClick={() => setCurrentPage('about')}>About</button>
                <button 
                  className="shoppingBagButton"
                  onClick={() => setCurrentPage('checkout')}
                >
                  <svg className="shoppingBagIcon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5M3.618 3.5 4.5 10.5h8l.5-7zM5 14a1 1 0 1 1 0 2 1 1 0 0 1 0-2m5 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2"/>
                  </svg>
                  <span className="shoppingBagButtonText">Shopping Bag ({getTotalItems()})</span>
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
            <button onClick={() => handleMenuClick('about')}>About</button>
          </div>
        </>
      )}
    </>
  )
}

export default Header