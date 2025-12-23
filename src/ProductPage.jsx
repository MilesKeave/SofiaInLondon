import './ProductPage.css'

function ProductPage({ product }) {
  if (!product) {
    return <div>No product selected</div>
  }

  return (
    <div className="productPage">
      <img src={product.imageUrl} alt={product.title} className="productImage" />
      <div className="productInfo">
        <h1>{product.title}</h1>
        <p className="productPrice">{product.price}</p>
        <p className="productDescription">{product.description}</p>
      </div>
    </div>
  )
}

export default ProductPage

