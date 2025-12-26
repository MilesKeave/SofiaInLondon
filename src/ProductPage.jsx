import { useEffect, useRef, useState } from 'react'
import './ProductPage.css'

function ProductPage({ product }) {
  const alternateImagesRef = useRef(null)
  const productInfoRef = useRef(null)
  const [mainImage, setMainImage] = useState(product?.imageUrl || '')

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
  }, [product])

  if (!product) {
    return <div>No product selected</div>
  }

  return (
    <div className="productPage">
        <div className="alternateImages" ref={alternateImagesRef}>
            {product.secondaryPhotos && product.secondaryPhotos.map((photoUrl, index) => (
                <img 
                    key={index} 
                    src={photoUrl} 
                    alt={`${product.title} - View ${index + 1}`}
                    className="alternateImage"
                    onClick={() => setMainImage(photoUrl)}
                />
            ))}
        </div>
        <div className="mainImage">
            <img src={mainImage} alt={product.title} className="mainImage" />
        </div>
        <div className="productInfo" ref={productInfoRef}>
            <div className="productTitle">
                <h1>{product.title}</h1>
                <p className="productPrice">{product.price}</p>
            </div>
            <div className= "productDescription">
                <div className="productSizes">Sizes Include: S M L XL</div>
                <button className="addToCartButton">Add To Cart</button>
                <p className="description">{product.description}</p>
            </div>
        </div>
    </div>
  )
}

export default ProductPage

