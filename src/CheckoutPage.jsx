import './CheckoutPage.css'
import { useShoppingBag } from './ShoppingBagContext'

function CheckoutPage() {
  const { items, removeFromBag, updateQuantity, getTotalPrice } = useShoppingBag()

  const returnBagItems = () => {
    if (items.length === 0) {
      return <p>Your bag is empty</p>
    }
    return (
      <>
        {items.map((item) => (
          <div key={item.id} className="bagItem">
            <img src={item.imageUrl} alt={item.title} className="bagItemImage" />
            <div className="bagItemInfo">
              <div className="bagItemTitlePrice">
                <h3>{item.title}</h3>
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
      </>
    )
  }

  return (
    <div className="checkoutPage">
      <div className="ShopifyCheckout">
        <h2>Shopify Checkout</h2>
      </div>
      <div className="bagItems">
        {returnBagItems()}
      </div>
    </div>
  )
}

export default CheckoutPage
