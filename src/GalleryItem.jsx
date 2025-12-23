import './Gallery.css'

function GalleryItem(props) {
  const { item = {}, onProductClick } = props;
  
  const handleClick = () => {
    if (onProductClick) {
      onProductClick(item)
    }
  }
  
  return (
    <div className="galleryItem" onClick={handleClick} style={{ cursor: 'pointer' }}>
       <img src={item.imageUrl} alt={item.title} />
       <div className="galleryItemInfo">
         <h3>{item.title}</h3>
         <p>{item.price}</p>
       </div>
    </div>
  );
}

export default GalleryItem;