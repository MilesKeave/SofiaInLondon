import './Gallery.css'
import GalleryItem from './GalleryItem'

function Gallery(props) {
  const { galleryItems } = props;
  return (
    <div className="scrollableGallery">
      {galleryItems.map((item, index) => (
        <GalleryItem 
          key={index}
          item={item}
        />
      ))}
    </div>
  )
}

export default Gallery