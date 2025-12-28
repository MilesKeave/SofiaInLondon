import './Header.css'
import { useShoppingBag } from './ShoppingBagContext'

function Header({ searchDropdown, setSearchDropdown, setCurrentPage }) {
  const { getTotalItems } = useShoppingBag()
  return (
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
                <button onClick={() => setCurrentPage('gallery')}>Shop</button>
                <button onClick={() => setCurrentPage('otherGallery')}>Gallery</button>
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
  )
}

export default Header