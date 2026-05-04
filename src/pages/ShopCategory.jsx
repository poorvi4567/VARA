import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { ShopContext } from '../Context/ShopContext';
import './CSS/ShopCategory.css';

const ShopCategory = ({ category }) => {
  const { addToCart, removeFromCart, cartItems, products, loading } = useContext(ShopContext);

  if (loading) return <p>Loading...</p>;

  const filteredProducts = category
    ? products.filter((product) => product.category.toLowerCase() === category.toLowerCase())
    : products;

  const title = category ? category.toUpperCase() : 'ALL PRODUCTS';

  return (
    <div className="category-page">
      <h1 className="category-title">{title}</h1>
      <div className="product-grid">
        {filteredProducts.map((item) => {
          const quantity = cartItems[item.product_id] || 0;
          return (
            <div key={item.product_id} className="product-card">
              <Link to={`/product/${item.product_id}`}>
                <img src={item.image_url} alt={item.name} />
              </Link>
              <h3>{item.name}</h3>
              <p>{item.description}</p>
              <p>₹{item.price}</p>
              {quantity === 0 ? (
                <button className="add-to-cart-button" onClick={() => addToCart(item.product_id)}>
                  Add to Cart
                </button>
              ) : (
                <div className="cart-counter">
                  <button className="counter-btn" onClick={() => removeFromCart(item.product_id)}>−</button>
                  <span className="counter-value">{quantity}</span>
                  <button className="counter-btn" onClick={() => addToCart(item.product_id)}>+</button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ShopCategory;