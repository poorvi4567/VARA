import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { ShopContext } from "../../Context/ShopContext";
import './ProductGrid.css';

const ProductGrid = () => {
  const { addToCart, removeFromCart, cartItems, products, loading } = useContext(ShopContext);

  if (loading) return <p>Loading products...</p>;

  return (
    <div className="product-grid">
      {products.map((product) => {
        const quantity = cartItems[product.product_id] || 0;
        return (
          <div key={product.product_id} className="product-card">
            <Link to={`/product/${product.product_id}`}>
              <img src={product.image_url} alt={product.name} className="product-image" />
            </Link>
            <div className="product-info">
              <Link to={`/product/${product.product_id}`} className="product-name-link">
                <h3 className="product-name">{product.name}</h3>
              </Link>
              <p className="product-price">₹{product.price}</p>
              {quantity === 0 ? (
                <button className="product-button" onClick={() => addToCart(product.product_id)}>
                  Add to Cart
                </button>
              ) : (
                <div className="cart-counter">
                  <button className="counter-btn" onClick={() => removeFromCart(product.product_id)}>−</button>
                  <span className="counter-value">{quantity}</span>
                  <button className="counter-btn" onClick={() => addToCart(product.product_id)}>+</button>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ProductGrid;