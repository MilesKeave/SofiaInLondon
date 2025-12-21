import './Gallery.css'

function GalleryItem(props) {
  const { item = {} } = props;
  return (
    <div className="galleryItem">
       <img src={item.imageUrl} alt={item.title} />
       <div className="galleryItemInfo">
         <h3>{item.title}</h3>
         <p>{item.price}</p>
       </div>
    </div>
  );
}

export default GalleryItem;