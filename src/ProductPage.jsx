import { useEffect, useRef, useState } from 'react'
import './ProductPage.css'
import { useShoppingBag } from './ShoppingBagContext'

function ProductPage({ product, onAddToBag }) {
  const alternateImagesRef = useRef(null)
  const productInfoRef = useRef(null)
  const mainImageRef = useRef(null)
  const [mainImage, setMainImage] = useState(product?.imageUrl || '')
  const [failedImages, setFailedImages] = useState(new Set())
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const { addToBag } = useShoppingBag()

  const handleImageError = (imageUrl) => {
    setFailedImages(prev => new Set([...prev, imageUrl]))
  }

  if (!product) {
    return <div>No product selected</div>
  }

  // Combine all images: main image + secondary photos, filtered to exclude failed images
  const allImages = [
    product.imageUrl,
    ...(product.secondaryPhotos || [])
  ].filter(img => img && !failedImages.has(img))

  useEffect(() => {
    if (product) {
      setMainImage(product.imageUrl)
    }
  }, [product])

  useEffect(() => {
    const updateHeight = () => {
      if (alternateImagesRef.current && productInfoRef.current) {
        const alternateHeight = alternateImagesRef.current.offsetHeight
        productInfoRef.current.style.height = `${alternateHeight}px`
      }
    }

    // Update height initially
    updateHeight()

    // Update height when images load
    const images = alternateImagesRef.current?.querySelectorAll('img')
    if (images) {
      images.forEach(img => {
        if (img.complete) {
          updateHeight()
        } else {
          img.addEventListener('load', updateHeight)
        }
      })
    }

    // Update height on window resize
    window.addEventListener('resize', updateHeight)

    return () => {
      window.removeEventListener('resize', updateHeight)
      if (images) {
        images.forEach(img => {
          img.removeEventListener('load', updateHeight)
        })
      }
    }
  }, [product, failedImages])

  useEffect(() => {
    const handleScroll = () => {
      if (!mainImageRef.current) return
      
      const container = mainImageRef.current
      const scrollLeft = container.scrollLeft
      const containerWidth = container.offsetWidth
      const imageIndex = Math.round(scrollLeft / containerWidth)
      
      setCurrentImageIndex(imageIndex)
    }

    const container = mainImageRef.current
    if (container) {
      container.addEventListener('scroll', handleScroll)
      // Set initial index
      handleScroll()
    }

    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScroll)
      }
    }
  }, [allImages])

  // Create alternate images list (main image + secondary photos), filtered to exclude failed images
  const alternateImagesList = [
    product.imageUrl,
    ...(product.secondaryPhotos || [])
  ].filter(img => img && !failedImages.has(img))

  return (
    <div className="productPage">
        <div className="alternateImages" ref={alternateImagesRef}>
            {alternateImagesList.map((photoUrl, index) => (
                <img 
                    key={index} 
                    src={photoUrl} 
                    alt={`${product.title} - View ${index + 1}`}
                    className="alternateImage"
                    onClick={() => setMainImage(photoUrl)}
                    onError={() => handleImageError(photoUrl)}
                />
            ))}
        </div>
        <div className="mainImage">
            <div className="mainImageScrollContainer" ref={mainImageRef}>
                {allImages.map((imageUrl, index) => (
                    <img 
                        key={index} 
                        src={imageUrl} 
                        alt={`${product.title} - View ${index + 1}`}
                        className="mainImageItem"
                        draggable="false"
                        onError={() => handleImageError(imageUrl)}
                    />
                ))}
            </div>
            <div className="imageIndicators">
                {allImages.map((_, index) => (
                    <div 
                        key={index} 
                        className={`indicatorDot ${index === currentImageIndex ? 'active' : ''}`}
                    />
                ))}
            </div>
        </div>
        <div className="productInfo" ref={productInfoRef}>
            <div className="productTitle">
                <h1>{product.title}</h1>
                <p className="productPrice">{product.price}</p>
            </div>
            <div className= "productDescription">
                <div className="productSizes">Sizes Include: S M L XL</div>
                <button 
                  className="addToCartButton"
                  onClick={() => {
                    addToBag(product, mainImage)
                    if (onAddToBag) onAddToBag()
                  }}
                >
                  Add To Shopping Bag
                </button>
                <p className="description">{product.description}</p>
            </div>
        </div>
    </div>
  )
}

export default ProductPage

