import './ImageGalleryItem.css'
import { useShoppingBag } from './ShoppingBagContext'

function ImageGalleryItem({ item, products = [], onProductClick, onAddToBag }) {
  const { addToBag } = useShoppingBag()
  
  if (!item) {
    return <div>No item selected</div>
  }

  const getProduct = (productTitle) => {
    return products.find(p => p.title === productTitle)
  }

  const handleProductClick = (productTitle) => {
    const product = getProduct(productTitle)
    if (product && onProductClick) {
      onProductClick(product)
    }
  }

  const handleAddToBag = (productTitle) => {
    const product = getProduct(productTitle)
    if (product) {
      addToBag(product, product.imageUrl)
      if (onAddToBag) {
        onAddToBag()
      }
    }
  }

  return (
    <div className="imageGalleryItemPage">
      <div className="imageGalleryItemImageContainer">
        <img 
          src={item.photoUrl} 
          alt="Gallery image" 
          className="imageGalleryItemImage"
        />
      </div>
      <div className="imageGalleryItemContent">
        <div className="featuredDesignsHeader">
          <h2>Featured Designs:</h2>
        </div>
        <div className="featuredDesignsList">
          {item.linkedProducts && item.linkedProducts.map((productTitle, index) => {
            const product = getProduct(productTitle)
            if (!product) return null
            
            return (
              <div key={index} className="featuredDesignItem">
                <img 
                  src={product.imageUrl} 
                  alt={productTitle}
                  onClick={() => handleProductClick(productTitle)}
                />
                <div className="featuredDesignInfo">
                  <div className="featuredDesignTitlePrice">
                    <span className="featuredDesignTitle">{product.title}</span>
                    <span className="featuredDesignPrice">{product.price}</span>
                  </div>
                  <button 
                    className="addToCartButton"
                    onClick={() => handleAddToBag(productTitle)}
                  >
                    Add To Shopping Bag
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default ImageGalleryItem

