import { useState } from 'react'
import { useShoppingBag } from './ShoppingBagContext'
import './ShoppingBagSideBar.css'

function ShoppingBagSideBar({ onClose, isClosing }) {
  const { items, removeFromBag, getTotalPrice } = useShoppingBag()
  const [loading, setLoading] = useState(false)

  const handleCheckout = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items })
      })
      const data = await res.json()
      if (data.url) window.location.href = data.url
    } catch (err) {
      console.error('Checkout error:', err)
      setLoading(false)
    }
  }

  return (
    <div
      className={`shoppingBagSidebar ${isClosing ? 'closing' : ''}`}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="sidebarHeader">
        <h2>Bag</h2>
        {onClose && <button onClick={onClose}>×</button>}
      </div>

      {items.length === 0 ? (
        <p>Your bag is empty</p>
      ) : (
        <>
          {items.map((item) => (
            <div key={item.id} className="sidebarItem">
              <img src={item.imageUrl} alt={item.name} />
              <div>
                <h3>{item.name}</h3>
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
              disabled={loading}
            >
              {loading ? 'Redirecting...' : 'Checkout'}
            </button>
          </div>
        </>
      )}
    </div>
  )
}

export default ShoppingBagSideBar
