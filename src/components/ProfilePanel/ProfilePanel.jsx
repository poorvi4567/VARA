import React, { useState, useEffect, useContext } from 'react';
import { useAuth } from '../../Context/AuthContext';
import './ProfilePanel.css';

const ProfilePanel = ({ isOpen, onClose }) => {
    const { user, token, setUser } = useAuth();
    const [activeTab, setActiveTab] = useState('profile');

    // Profile state
    const [profile, setProfile] = useState({
        name: '',
        email: '',
        phone: '',
        addressLine: '',
        city: '',
        state: '',
        pincode: '',
    });
    const [isEditing, setIsEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [saveMsg, setSaveMsg] = useState('');

    // Orders state
    const [orders, setOrders] = useState([]);
    const [ordersLoading, setOrdersLoading] = useState(false);

    // Load profile data when panel opens
    useEffect(() => {
        if (isOpen && user) {
            fetchProfile();
        }
    }, [isOpen]);

    // Load orders when orders tab selected
    useEffect(() => {
        if (activeTab === 'orders' && token) {
            fetchOrders();
        }
    }, [activeTab]);

    const fetchProfile = async () => {
        try {
            const res = await fetch('http://localhost:8000/api/users/profile', {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            setProfile({
                name: data.name || '',
                email: data.email || '',
                phone: data.phone || '',
                addressLine: data.address?.addressLine || '',
                city: data.address?.city || '',
                state: data.address?.state || '',
                pincode: data.address?.pincode || '',
            });
        } catch (err) {
            console.error('Failed to fetch profile', err);
        }
    };

    const fetchOrders = async () => {
        setOrdersLoading(true);
        try {
            const res = await fetch('http://localhost:8000/api/orders/my', {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            setOrders(data);
        } catch (err) {
            console.error('Failed to fetch orders', err);
        } finally {
            setOrdersLoading(false);
        }
    };

    const handleChange = (e) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        setSaving(true);
        setSaveMsg('');
        try {
            const res = await fetch('http://localhost:8000/api/users/profile', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    name: profile.name,
                    phone: profile.phone,
                    address: {
                        addressLine: profile.addressLine,
                        city: profile.city,
                        state: profile.state,
                        pincode: profile.pincode,
                    },
                }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Server error');

            // Update the name in AuthContext so navbar reflects change immediately
            const updatedUser = { ...user, name: data.name };
            setUser(updatedUser);
            // Also sync to localStorage so the change persists on refresh
            localStorage.setItem('vara_user', JSON.stringify(updatedUser));

            setIsEditing(false);
            setSaveMsg('Profile updated successfully');

            // Clear success message after 3 seconds
            setTimeout(() => setSaveMsg(''), 3000);
        } catch (err) {
            console.error('Profile save error:', err);
            setSaveMsg(`Failed to save: ${err.message}`);
        } finally {
            setSaving(false);
        }
    };

    // Format date for orders
    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop — clicking it closes the panel */}
            <div className="panel-backdrop" onClick={onClose} />

            <div className="profile-panel">
                {/* Header */}
                <div className="panel-header">
                    <div>
                        <h2 className="panel-title">Hi, {user?.name?.split(' ')[0]}</h2>
                        <p className="panel-subtitle">{user?.email}</p>
                    </div>
                    <button className="panel-close" onClick={onClose}>✕</button>
                </div>

                {/* Tabs */}
                <div className="panel-tabs">
                    <button
                        className={`panel-tab ${activeTab === 'profile' ? 'active' : ''}`}
                        onClick={() => setActiveTab('profile')}
                    >
                        Profile
                    </button>
                    <button
                        className={`panel-tab ${activeTab === 'orders' ? 'active' : ''}`}
                        onClick={() => setActiveTab('orders')}
                    >
                        Orders
                    </button>
                </div>

                {/* Panel body */}
                <div className="panel-body">

                    {/* ── Profile Tab ── */}
                    {activeTab === 'profile' && (
                        <div>
                            {/* Edit / Save / Cancel buttons */}
                            <div className="profile-actions">
                                {!isEditing ? (
                                    <button className="edit-btn" onClick={() => setIsEditing(true)}>
                                        Edit Details
                                    </button>
                                ) : (
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <button className="save-btn" onClick={handleSave} disabled={saving}>
                                            {saving ? 'Saving...' : 'Save'}
                                        </button>
                                        <button
                                            className="cancel-btn"
                                            onClick={() => { setIsEditing(false); fetchProfile(); }}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                )}
                            </div>

                            {saveMsg && (
                                <p className={`save-msg ${saveMsg.includes('success') ? 'success' : 'error'}`}>
                                    {saveMsg}
                                </p>
                            )}

                            {/* Fields */}
                            <div className="profile-fields">
                                {[
                                    { label: 'Full Name', name: 'name', type: 'text' },
                                    { label: 'Email', name: 'email', type: 'email', disabled: true },
                                    { label: 'Phone', name: 'phone', type: 'tel' },
                                    { label: 'Address Line', name: 'addressLine', type: 'text' },
                                    { label: 'City', name: 'city', type: 'text' },
                                    { label: 'State', name: 'state', type: 'text' },
                                    { label: 'Pincode', name: 'pincode', type: 'text' },
                                ].map((field) => (
                                    <div key={field.name} className="profile-field">
                                        <label className="field-label">{field.label}</label>
                                        {isEditing && !field.disabled ? (
                                            <input
                                                type={field.type}
                                                name={field.name}
                                                value={profile[field.name]}
                                                onChange={handleChange}
                                                className="field-input editing"
                                            />
                                        ) : (
                                            <p className="field-value">
                                                {profile[field.name] || (
                                                    <span className="field-empty">Not set</span>
                                                )}
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* ── Orders Tab ── */}
                    {activeTab === 'orders' && (
                        <div>
                            {ordersLoading ? (
                                <p className="orders-loading">Loading orders...</p>
                            ) : orders.length === 0 ? (
                                <p className="orders-empty">No orders yet.</p>
                            ) : (
                                <div className="orders-list">
                                    {orders.map((order) => (
                                        <div key={order._id} className="order-card">
                                            {/* Order header */}
                                            <div className="order-header">
                                                <div>
                                                    <p className="order-date">{formatDate(order.createdAt)}</p>
                                                    <p className="order-id">#{order._id.slice(-8).toUpperCase()}</p>
                                                </div>
                                                <span className={`order-status ${order.status}`}>
                                                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                                </span>
                                            </div>

                                            {/* Order items */}
                                            <div className="order-items">
                                                {order.items.map((item, i) => (
                                                    <div key={i} className="order-item">
                                                        <img
                                                            src={item.image_url}
                                                            alt={item.name}
                                                            className="order-item-img"
                                                        />
                                                        <div>
                                                            <p className="order-item-name">{item.name}</p>
                                                            <p className="order-item-meta">
                                                                Qty: {item.quantity} · ₹{item.price * item.quantity}
                                                            </p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Order total */}
                                            <div className="order-total">
                                                Total: ₹{order.totalAmount}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default ProfilePanel;