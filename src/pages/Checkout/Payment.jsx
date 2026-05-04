import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShopContext } from '../../Context/ShopContext';
import { useAuth } from '../../Context/AuthContext';
import './Payment.css';

const Payment = () => {
  const { cartItems, products, getTotalPrice, clearCart } = useContext(ShopContext);
  const { token, user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Shipping form state
  const [address, setAddress] = useState({
    fullName: '',
    phone: '',
    addressLine: '',
    city: '',
    state: '',
    pincode: '',
  });

  useEffect(() => {
    if (token) {
      fetch('http://localhost:8000/api/users/profile', {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.address?.city) {
            setAddress({
              fullName: data.name || '',
              phone: data.phone || '',
              addressLine: data.address.addressLine || '',
              city: data.address.city || '',
              state: data.address.state || '',
              pincode: data.address.pincode || '',
            });
          }
        })
        .catch(() => { });
    }
  }, [token]);

  const handleAddressChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  // Build cart items array for the order
  const cartProductItems = products
    .filter((p) => cartItems[p.product_id] > 0)
    .map((p) => ({
      product_id: p.product_id,
      quantity: cartItems[p.product_id],
    }));

  const handleCheckout = async () => {
    // Validate address fields
    const fields = Object.values(address);
    if (fields.some((f) => f.trim() === '')) {
      setError('Please fill in all address fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Step 1 — Save order to MongoDB as "pending"
      const orderRes = await fetch('http://localhost:8000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,  // JWT for auth middleware
        },
        body: JSON.stringify({
          items: cartProductItems,
          shippingAddress: address,
        }),
      });
      const order = await orderRes.json();
      if (!orderRes.ok) throw new Error(order.message);

      // Step 2 — Create Razorpay order
      const razorpayRes = await fetch('http://localhost:8000/api/orders/create-razorpay-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ orderId: order._id }),
      });
      const razorpayData = await razorpayRes.json();
      if (!razorpayRes.ok) throw new Error(razorpayData.message);

      // Step 3 — Open Razorpay popup
      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID,
        amount: razorpayData.amount,
        currency: razorpayData.currency,
        name: 'VARA',
        description: 'Handcrafted Channapatna Products',
        order_id: razorpayData.razorpayOrderId,
        prefill: {
          name: user.name,
          email: user.email,
          contact: address.phone,
        },
        theme: { color: '#8B0000' },

        // Step 4 — On payment success, verify with backend
        handler: async (response) => {
          try {
            const verifyRes = await fetch('http://localhost:8000/api/orders/verify-payment', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderId: order._id,
              }),
            });
            const verifyData = await verifyRes.json();
            if (!verifyRes.ok) throw new Error(verifyData.message);

            // Step 5 — Clear cart and redirect
            clearCart();
            navigate('/order-success', { state: { order: verifyData.order } });
          } catch (err) {
            setError('Payment verification failed. Contact support.');
          }
        },
      };

      const rzp = new window.Razorpay(options);

      // Handle payment popup closed without paying
      rzp.on('payment.failed', (response) => {
        setError(`Payment failed: ${response.error.description}`);
      });

      rzp.open();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="payment-container">
      <h2>Checkout</h2>

      {/* Order summary */}
      <div style={{ marginBottom: '2rem', textAlign: 'left' }}>
        <h3 style={{ color: 'brown', marginBottom: '1rem' }}>Order Summary</h3>
        {products
          .filter((p) => cartItems[p.product_id] > 0)
          .map((p) => (
            <div key={p.product_id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span>{p.name} × {cartItems[p.product_id]}</span>
              <span>₹{p.price * cartItems[p.product_id]}</span>
            </div>
          ))}
        <hr style={{ margin: '1rem 0' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
          <span>Total</span>
          <span>₹{getTotalPrice()}</span>
        </div>
      </div>

      {/* Shipping address form */}
      <h3 style={{ color: 'brown', marginBottom: '1rem', textAlign: 'left' }}>Shipping Address</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', marginBottom: '2rem' }}>
        {[
          { name: 'fullName', placeholder: 'Full Name' },
          { name: 'phone', placeholder: 'Phone Number' },
          { name: 'addressLine', placeholder: 'Address Line' },
          { name: 'city', placeholder: 'City' },
          { name: 'state', placeholder: 'State' },
          { name: 'pincode', placeholder: 'Pincode' },
        ].map((field) => (
          <input
            key={field.name}
            name={field.name}
            placeholder={field.placeholder}
            value={address[field.name]}
            onChange={handleAddressChange}
            style={{
              padding: '12px',
              borderRadius: '8px',
              border: '1px solid #ccc',
              fontSize: '1rem',
            }}
          />
        ))}
      </div>

      {error && (
        <p style={{ color: 'red', marginBottom: '1rem' }}>{error}</p>
      )}

      <button
        className="pay-button"
        onClick={handleCheckout}
        disabled={loading || cartProductItems.length === 0}
      >
        {loading ? 'Processing...' : `Pay ₹${getTotalPrice()}`}
      </button>
    </div>
  );
};

export default Payment;