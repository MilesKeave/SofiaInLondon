import { useShoppingBag } from './ShoppingBagContext'
import './ShoppingBagSideBar.css'

function ShoppingBagSideBar({ onClose, isClosing, setCurrentPage }) {
  const { items, removeFromBag, updateQuantity, getTotalPrice } = useShoppingBag()

  const handleCheckout = () => {
    setCurrentPage('checkout')
    if (onClose) onClose()
  }

  return (
    <div 
      className={`shoppingBagSidebar ${isClosing ? 'closing' : ''}`}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="sidebarHeader">
        <h2>Shopping Bag</h2>
        {onClose && <button onClick={onClose}>×</button>}
      </div>
      
      {items.length === 0 ? (
        <p>Your bag is empty</p>
      ) : (
        <>
          {items.map((item) => (
            <div key={item.id} className="sidebarItem">
              <img src={item.imageUrl} alt={item.title} />
              <div>
                <h3>{item.title}</h3>
                <p>{item.price}</p>
                <button onClick={() => removeFromBag(item.id)}>Remove</button>
              </div>
            </div>
          ))}
          <div className="sidebarTotal">
            <p>Total: ${getTotalPrice().toFixed(2)}</p>
            <button 
              className="sidebarCheckoutButton"
              onClick={handleCheckout}
            >
              Checkout
            </button>
          </div>
        </>
      )}
    </div>
  )
}

export default ShoppingBagSideBar
