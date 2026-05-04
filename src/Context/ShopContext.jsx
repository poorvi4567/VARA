import React, { createContext, useState, useEffect } from 'react';
// ❌ REMOVE: import products from '../Data/Products';

export const ShopContext = createContext();

// Cart is now empty by default — products load dynamically
const getDefaultCart = () => ({});


const ShopContextProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(getDefaultCart());

  // ✅ NEW: products live in state, fetched from the API
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://localhost:8000/api/products')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch products');
        return res.json();
      })
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []); // Empty array = runs once when the app first loads

  const addToCart = (productId, quantity = 1) => {
    setCartItems((prev) => ({
      ...prev,
      [productId]: (prev[productId] || 0) + quantity, // Handle new product_ids gracefully
    }));
  };

  const removeFromCart = (productId) => {
    setCartItems((prev) => ({
      ...prev,
      [productId]: Math.max((prev[productId] || 0) - 1, 0),
    }));
  };

  const getTotalItems = () =>
    Object.values(cartItems).reduce((sum, qty) => sum + qty, 0);

  // ✅ Now reads from state instead of hardcoded array
  const getTotalPrice = () =>
    products.reduce((total, product) => {
      return total + product.price * (cartItems[product.product_id] || 0);
    }, 0);

  const clearCart = () => {
    setCartItems({});
  };

  return (
    <ShopContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        getTotalItems,
        getTotalPrice,
        products,   // ✅ expose to all consumers
        loading,
        error,
        clearCart,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;