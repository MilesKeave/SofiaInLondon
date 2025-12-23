import './Header.css'

function Header({ searchDropdown, setSearchDropdown, setCurrentPage }) {
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
                <button onClick={() => setCurrentPage('otherGallery')}>Shop</button>
                <button onClick={() => setCurrentPage('gallery')}>Gallery</button>
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
                <button>About</button>
                <button onClick={() => setCurrentPage('checkout')}>Shopping Cart</button>
            </div>
        </div>
        <div className="subTitle">
            <h3>Digital Patterns</h3>
        </div>
    </div>
  )
}

export default Header