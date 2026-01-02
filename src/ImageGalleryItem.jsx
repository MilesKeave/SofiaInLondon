import './ImageGalleryItem.css'

function ImageGalleryItem({ item }) {
  if (!item) {
    return <div>No item selected</div>
  }

  return (
    <div className="imageGalleryItemPage">
      <img 
        src={item.photoGalleryImage} 
        alt={item.title || 'Gallery image'} 
        className="imageGalleryItemImage"
      />
      <p className="imageGalleryItemDescription">{item.description}</p>
    </div>
  )
}

export default ImageGalleryItem

