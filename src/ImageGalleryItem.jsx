import './ImageGalleryItem.css'
import { useShoppingBag } from './ShoppingBagContext'

function ImageGalleryItem({ item, onProductClick, onAddToBag }) {
  const { addToBag } = useShoppingBag()

  if (!item) {
    return <div>No item selected</div>
  }

  const hasProducts = item.linkedProducts && item.linkedProducts.length > 0

  return (
    <div className={`imageGalleryItemPage ${!hasProducts ? 'imageGalleryItemPageCentered' : ''}`}>
      <div className="imageGalleryItemImageContainer">
        <img
          src={item.photoUrl}
          alt="Gallery image"
          className="imageGalleryItemImage"
        />
      </div>
      {hasProducts && (
        <div className="imageGalleryItemContent">
          <div className="featuredDesignsHeader">
            <h2>Featured Designs:</h2>
          </div>
          <div className="featuredDesignsList">
            {item.linkedProducts.map((product, index) => (
              <div key={index} className="featuredDesignItem">
                <img
                  src={product.media?.[0]?.src || ''}
                  alt={product.name}
                  onClick={() => onProductClick && onProductClick(product)}
                />
                <div className="featuredDesignInfo">
                  <div className="featuredDesignTitlePrice">
                    <span className="featuredDesignTitle">{product.name}</span>
                    <span className="featuredDesignPrice">{product.price}</span>
                  </div>
                  <button
                    className="addToCartButton"
                    onClick={() => {
                      addToBag(product, product.media?.[0]?.src || '')
                      if (onAddToBag) onAddToBag()
                    }}
                  >
                    Add To Bag
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default ImageGalleryItem
