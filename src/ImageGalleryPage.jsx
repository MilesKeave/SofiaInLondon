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
          <div className="shimmerWrapper">
            <img
              src={item.photoUrl}
              alt="Gallery image"
              draggable="false"
              loading={index < 6 ? 'eager' : 'lazy'}
              onLoad={(e) => e.target.classList.add('imgLoaded')}
            />
          </div>
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
