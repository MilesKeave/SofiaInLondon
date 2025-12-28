import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ShoppingBagProvider } from './ShoppingBagContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ShoppingBagProvider>
      <App />
    </ShoppingBagProvider>
  </StrictMode>,
)
