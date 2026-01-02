import './Gallery.css'
import './ImageGalleryPage.css'

function ImageGalleryPage({ galleryItems = [], onItemClick }) {
  
  if (!galleryItems || galleryItems.length === 0) {
    return <div>No Gallery items</div>
  }

  const itemsWithPhotos = galleryItems.filter(item => item.photoGalleryImage)

  if (itemsWithPhotos.length === 0) {
    return (
      <div>
        <div>No gallery images found</div>
        <div>Total items: {galleryItems.length}</div>
        <div>First item keys: {galleryItems[0] ? Object.keys(galleryItems[0]).join(', ') : 'none'}</div>
      </div>
    )
  }

  return (
    <div className="scrollableGallery">
      {itemsWithPhotos.map((item, index) => (
        <div 
          key={index} 
          className="imageGalleryItem"
          onClick={() => onItemClick && onItemClick(item)}
        >
          <img src={item.photoGalleryImage} alt={item.title || 'Gallery image'} draggable="false" />
          <div className="imageGalleryOverlay">
            <p className="imageGalleryDescription">{item.description}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

export default ImageGalleryPage

