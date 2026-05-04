import React from 'react';
import { useLocation, Link } from 'react-router-dom';

const OrderSuccess = () => {
    const { state } = useLocation();
    const order = state?.order;

    return (
        <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
            <h1 style={{ color: 'green', fontSize: '2.5rem' }}>✓</h1>
            <h2>Order Placed Successfully!</h2>
            {order && (
                <p style={{ color: '#555', marginTop: '0.5rem' }}>
                    Order ID: {order._id}
                </p>
            )}
            <p style={{ marginTop: '1rem', color: '#555' }}>
                Thank you for shopping with VARA. Your handcrafted items are on their way!
            </p>
            <Link to='/'>
                <button style={{
                    marginTop: '2rem',
                    padding: '12px 24px',
                    backgroundColor: 'brown',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    cursor: 'pointer',
                }}>
                    Continue Shopping
                </button>
            </Link>
        </div>
    );
};

export default OrderSuccess;