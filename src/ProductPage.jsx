import { useEffect, useRef, useState } from 'react'
import './ProductPage.css'
import { useShoppingBag } from './ShoppingBagContext'

function SkillDots({ level, max }) {
  return (
    <div className="skillLevel">
      <span className="skillLabel">Beginner</span>
      {Array.from({ length: max }, (_, i) => (
        <span key={i} className={`skillDot ${i < level ? 'filled' : ''}`} />
      ))}
      <span className="skillLabel">Intermediate</span>
    </div>
  )
}

function ProductPage({ product, onAddToBag }) {
  const alternateImagesRef = useRef(null)
  const productInfoRef = useRef(null)
  const mainImageRef = useRef(null)
  const mainImageWrapperRef = useRef(null)
  const [mainMediaIndex, setMainMediaIndex] = useState(0)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const { addToBag } = useShoppingBag()

  if (!product) {
    return <div>No product selected</div>
  }

  const media = product.media || []
  const imageOnlyMedia = media.filter(m => m.type === 'image')

  useEffect(() => {
    if (product) setMainMediaIndex(0)
  }, [product])

  useEffect(() => {
    const updateHeight = () => {
      if (alternateImagesRef.current && productInfoRef.current) {
        const alternateHeight = alternateImagesRef.current.offsetHeight
        productInfoRef.current.style.height = `${alternateHeight}px`
      }
    }

    updateHeight()

    const images = alternateImagesRef.current?.querySelectorAll('img')
    if (images) {
      images.forEach(img => {
        if (img.complete) updateHeight()
        else img.addEventListener('load', updateHeight)
      })
    }

    window.addEventListener('resize', updateHeight)
    return () => {
      window.removeEventListener('resize', updateHeight)
      if (images) images.forEach(img => img.removeEventListener('load', updateHeight))
    }
  }, [product])

  useEffect(() => {
    const handleScroll = () => {
      if (!mainImageRef.current) return
      const container = mainImageRef.current
      const scrollLeft = container.scrollLeft
      const containerWidth = container.offsetWidth
      setCurrentImageIndex(Math.round(scrollLeft / containerWidth))
    }

    const container = mainImageRef.current
    if (container) {
      container.addEventListener('scroll', handleScroll)
      handleScroll()
    }
    return () => { if (container) container.removeEventListener('scroll', handleScroll) }
  }, [media])

  const sizesDisplay = Array.isArray(product.sizes)
    ? `Sizes: ${product.sizes.join(', ')}`
    : product.sizes

  return (
    <div className="productPage">
      <div className="alternateImages" ref={alternateImagesRef}>
        {media.map((m, mediaIndex) => {
          const scrollToItem = () => {
            setMainMediaIndex(mediaIndex)
            const items = mainImageRef.current?.children
            if (items && items[mediaIndex]) {
              const isMobile = window.innerWidth <= 768
              if (isMobile) {
                mainImageRef.current.scrollTo({ left: items[mediaIndex].offsetLeft, behavior: 'smooth' })
              } else {
                mainImageWrapperRef.current.scrollTo({ top: items[mediaIndex].offsetTop, behavior: 'smooth' })
              }
            }
          }

          if (m.type === 'video') {
            return (
              <div key={mediaIndex} className="alternateVideoThumb" onClick={scrollToItem}>
                <video src={m.src} className="alternateImage" muted playsInline />
                <div className="playIcon">▶</div>
              </div>
            )
          }

          return (
            <img
              key={mediaIndex}
              src={m.src}
              alt={`${product.name} - View ${mediaIndex + 1}`}
              className="alternateImage"
              draggable="false"
              onMouseDown={(e) => e.preventDefault()}
              onClick={scrollToItem}
            />
          )
        })}
      </div>

      <div className="mainImage" ref={mainImageWrapperRef}>
        <div className="mainImageScrollContainer" ref={mainImageRef}>
          {media.map((m, index) => (
            m.type === 'video' ? (
              <video
                key={index}
                src={m.src}
                className="mainImageItem"
                autoPlay
                muted
                loop
                playsInline
              />
            ) : (
              <img
                key={index}
                src={m.src}
                alt={`${product.name} - View ${index + 1}`}
                className="mainImageItem"
                draggable="false"
              />
            )
          ))}
        </div>
        <div className="imageIndicators">
          {media.map((_, index) => (
            <div
              key={index}
              className={`indicatorDot ${index === currentImageIndex ? 'active' : ''}`}
            />
          ))}
        </div>
      </div>

      <div className="productInfo" ref={productInfoRef}>
        <div className="productTitle">
          <h1>{product.name}</h1>
          <p className="productPrice">{product.price}</p>
        </div>
        <div className="productDescription">
          <div className="productSizes">{sizesDisplay}</div>
          <button
            className="addToCartButton"
            onClick={() => {
              addToBag(product, media[0]?.src || '')
              if (onAddToBag) onAddToBag()
            }}
          >
            Add To Bag
          </button>
          <SkillDots level={product.skillLevel} max={product.skillLevelMax} />
          {product.fit && product.fit.length > 0 && (
            <ul className="productFit">
              {product.fit.map((line, i) => <li key={i}>{line}</li>)}
            </ul>
          )}
          {product.whatsIncluded && product.whatsIncluded.length > 0 && (
            <div className="whatsIncluded">
              <p className="whatsIncludedTitle">What's Included in Your Download:</p>
              <ul>
                {product.whatsIncluded.map((line, i) => <li key={i}>{line}</li>)}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProductPage
