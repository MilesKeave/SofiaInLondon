import { useEffect } from 'react'
import { useShoppingBag } from './ShoppingBagContext'
import './SuccessPage.css'

function SuccessPage({ setCurrentPage }) {
  const { clearBag } = useShoppingBag()

  useEffect(() => {
    clearBag()
    window.history.replaceState({}, '', '/')
  }, [])

  return (
    <div className="successPage">
      <h1>Thank you for your order.</h1>
      <p>Your downloads are on their way to your email.</p>
      <button onClick={() => setCurrentPage('gallery')}>Continue Shopping</button>
    </div>
  )
}

export default SuccessPage
