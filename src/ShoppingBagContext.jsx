import { createContext, useContext, useState, useEffect } from 'react'

const ShoppingBagContext = createContext()

export const useShoppingBag = () => {
  const context = useContext(ShoppingBagContext)
  if (!context) {
    throw new Error('useShoppingBag must be used within ShoppingBagProvider')
  }
  return context
}

const getInitialItems = () => {
  try {
    const saved = localStorage.getItem('shoppingBag')
    return saved ? JSON.parse(saved) : []
  } catch (error) {
    console.error('Error loading shopping bag:', error)
    return []
  }
}

export const ShoppingBagProvider = ({ children }) => {
  const [items, setItems] = useState(getInitialItems)

  useEffect(() => {
    localStorage.setItem('shoppingBag', JSON.stringify(items))
  }, [items])

  const addToBag = (product, selectedImage = null) => {
    setItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id || item.title === product.title)
      
      if (existingItem) {
        return prevItems
      } else {
        return [...prevItems, {
          id: product.id || product.title,
          title: product.title,
          price: product.price,
          imageUrl: selectedImage || product.imageUrl,
          quantity: 1
        }]
      }
    })
  }

  const removeFromBag = (itemId) => {
    setItems(prevItems => prevItems.filter(item => item.id !== itemId))
  }

  const updateQuantity = (itemId, quantity) => {
    if (quantity <= 0) {
      removeFromBag(itemId)
      return
    }
    if (quantity > 1) {
      quantity = 1
    }
    setItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId ? { ...item, quantity } : item
      )
    )
  }

  const clearBag = () => {
    setItems([])
  }

  const getTotalItems = () => {
    return items.reduce((total, item) => total + Math.min(item.quantity, 1), 0)
  }

  const getTotalPrice = () => {
    return items.reduce((total, item) => {
      const price = parseFloat(item.price.replace('$', ''))
      const quantity = Math.min(item.quantity, 1)
      return total + (price * quantity)
    }, 0)
  }

  const value = {
    items,
    addToBag,
    removeFromBag,
    updateQuantity,
    clearBag,
    getTotalItems,
    getTotalPrice
  }

  return (
    <ShoppingBagContext.Provider value={value}>
      {children}
    </ShoppingBagContext.Provider>
  )
}

