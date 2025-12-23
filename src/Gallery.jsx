import './Gallery.css'
import GalleryItem from './GalleryItem'

function Gallery(props) {
  const { galleryItems, onProductClick } = props;
  return (
    <div className="scrollableGallery">
      {galleryItems.map((item, index) => (
        <GalleryItem 
          key={index}
          item={item}
          onProductClick={onProductClick}
        />
      ))}
    </div>
  )
}

export default Gallery