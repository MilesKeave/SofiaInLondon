import './Gallery.css'
import './ImageGalleryPage.css'

function ImageGalleryPage({ galleryItems = [], onItemClick }) {
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
        >
          <img
            src={item.photoUrl}
            alt="Gallery image"
            draggable="false"
          />
          {item.caption && (
            <div className="imageGalleryOverlay">
              <p className="imageGalleryDescription">{item.caption}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export default ImageGalleryPage
