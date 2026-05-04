import React, { useContext, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
// ❌ REMOVE: import products from '../Data/Products';
import { ShopContext } from '../Context/ShopContext';
import './CSS/ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart } = useContext(ShopContext);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    fetch(`http://localhost:8000/api/products/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data);
        setLoading(false);
      });
  }, [id]); // Re-fetch if the id in the URL changes

  if (loading) return <h2>Loading...</h2>;
  if (!product) return <h2>Product not found!</h2>;

  const handleQuantityChange = (amount) =>
    setQuantity((prev) => Math.max(prev + amount, 1));

  const handleAddToCart = () => {
    addToCart(product.product_id, quantity);
    alert(`${quantity} item(s) added to cart!`);
  };

  // JSX is unchanged — product.image_url is still just a string src
  return (
    <div className="product-detail-container">
      <div className="product-images">
        <img src={product.image_url} alt={product.name} />
      </div>
      <div className="product-info">
        <h2>{product.name}</h2>
        <div className="description-box">
          <h3>Description</h3>
          <p className="price">₹{product.price}</p>
          <p className="description">{product.description}</p>
          <p>Artisan: {product.artisan_name}</p>
          <p>Materials: {product.material_used}</p>
          <p>VARA Nanya: {product.vara_nanya}</p>
        </div>
        <div className="quantity">
          <label>Quantity:</label>
          <div className="quantity-controls">
            <button onClick={() => handleQuantityChange(-1)}>-</button>
            <input type="number" min="1" value={quantity} readOnly />
            <button onClick={() => handleQuantityChange(1)}>+</button>
          </div>
        </div>
        <button className="add-to-cart" onClick={handleAddToCart}>
          Add {quantity} to Cart (₹{quantity * product.price})
        </button>
      </div>
    </div>
  );
};

export default ProductDetail;