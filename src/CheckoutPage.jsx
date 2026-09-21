import { useState } from 'react'
import './CheckoutPage.css'
import { useShoppingBag } from './ShoppingBagContext'

function CheckoutPage() {
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
    <div className="checkoutPage">
      <div className="bagItems">
        {items.length === 0 ? (
          <p>Your bag is empty</p>
        ) : (
          <>
            <h2 className="bagHeading">Bag</h2>
            {items.map((item) => (
              <div key={item.id} className="bagItem">
                <img src={item.imageUrl} alt={item.name} className="bagItemImage" />
                <div className="bagItemInfo">
                  <div className="bagItemTitlePrice">
                    <h3>{item.name}</h3>
                    <p>{item.price}</p>
                  </div>
                  <button onClick={() => removeFromBag(item.id)} className="removeButton">
                    Remove
                  </button>
                </div>
              </div>
            ))}
            <div className="bagTotal">
              <span>Total</span>
              <span>${getTotalPrice().toFixed(2)}</span>
            </div>
            <button
              className="stripeCheckoutButton"
              onClick={handleCheckout}
              disabled={loading}
            >
              {loading ? 'Redirecting...' : 'Checkout'}
            </button>
          </>
        )}
      </div>
    </div>
  )
}

export default CheckoutPage
