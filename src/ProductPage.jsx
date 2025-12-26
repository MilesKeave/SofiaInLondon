import { useEffect, useRef } from 'react'
import './ProductPage.css'

function ProductPage({ product }) {
  const alternateImagesRef = useRef(null)
  const productInfoRef = useRef(null)

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

  console.log("product", product);

  return (
    <div className="productPage">
        <div className="alternateImages" ref={alternateImagesRef}>
            {product.secondaryPhotos && product.secondaryPhotos.map((photoUrl, index) => (
                <img 
                    key={index} 
                    src={photoUrl} 
                    alt={`${product.title} - View ${index + 1}`}
                    className="alternateImage"
                />
            ))}
        </div>
        <div className="mainImage">
            <img src={product.imageUrl} alt={product.title} className="mainImage" />
        </div>
        <div className="productInfo" ref={productInfoRef}>
            <h1>{product.title}</h1>
            <p className="productPrice">{product.price}</p>
            <p className="productDescription">{product.description}</p>
        </div>
    </div>
  )
}

export default ProductPage

