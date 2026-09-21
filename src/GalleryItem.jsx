import { useState } from 'react'
import './Gallery.css'

function GalleryItem(props) {
  const { item = {}, onProductClick } = props;
  const [hovered, setHovered] = useState(false)

  const image1 = item.media?.[0]?.src || ''
  const hoverIndex = item.hoverImageIndex ?? 1
  const hoverMedia = item.media?.[hoverIndex]
  const image2 = hoverMedia?.type === 'image' ? hoverMedia.src : null

  const handleClick = () => {
    if (onProductClick) {
      onProductClick(item)
    }
  }

  return (
    <div
      className="galleryItem"
      onClick={handleClick}
      style={{ cursor: 'pointer' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {image2 && <link rel="preload" as="image" href={image2} />}
      <img
        src={hovered && image2 ? image2 : image1}
        alt={item.name}
        draggable="false"
        loading="eager"
      />
      <div className="galleryItemInfo">
        <h3>{item.name}</h3>
        <p>{item.price}</p>
      </div>
    </div>
  );
}

export default GalleryItem;
