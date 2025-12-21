import './Header.css'

function Header() {
  return (
    <div className="mainHeader">
        <div className="navbar">
            <div className="navbar-left">
                <button>Shop</button>
                <button>Gallery</button>
            </div>
            <div className="navbar-center">
                <h1>SOFIA IN LONDON</h1>
            </div>
            <div className="navbar-right">
                <button>Search</button>
                <button>About</button>
                <button>Shopping Cart</button>
            </div>
        </div>
        <div className="subTitle">
            <h3>Digital Patterns</h3>
        </div>
    </div>
  )
}

export default Header