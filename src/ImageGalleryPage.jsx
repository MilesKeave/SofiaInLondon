import { useState } from 'react'
import './Gallery.css'
import './ImageGalleryPage.css'

function ImageGalleryPage({ galleryItems = [], onItemClick }) {
  const [hoveredIndex, setHoveredIndex] = useState(null)

  if (!galleryItems || galleryItems.length === 0) {
    return <div>No Gallery items</div>
  }

  return (
    <div className="scrollableGallery">
      {galleryItems.map((item, index) => (
        <div
          key={item.id || index}
          className="imageGalleryItem"
          onClick={() => onItemClick && onItemClick(item)}
          onMouseEnter={() => setHoveredIndex(index)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <img
            src={hoveredIndex === index && item.hoverUrl ? item.hoverUrl : item.photoUrl}
            alt="Gallery image"
            draggable="false"
          />
        </div>
      ))}
    </div>
  )
}

export default ImageGalleryPage
