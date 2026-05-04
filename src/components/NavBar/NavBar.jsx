import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShopContext } from '../../Context/ShopContext';       // ← was ../Context
import { useAuth } from '../../Context/AuthContext';           // ← was ../Context
import ProfilePanel from '../ProfilePanel/ProfilePanel';       // ← this one is correct
import shopping_cart from '../Assets/images/shopping_cart.jpg'; // ← was ../Assets
import vara_logo from '../Assets/images/light_mode_logo.png';   // ← was ../Assets
import './NavBar.css';

const NavBar = () => {
    const { getTotalItems } = useContext(ShopContext);
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [panelOpen, setPanelOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <>
            <div className='navbar'>
                <Link to='/'><img src={vara_logo} className='nav-logo' alt='VARA' /></Link>

                <ul className='nav-menu'>
                    <li><Link to='/'>Home</Link></li>
                    <li><Link to='/toys'>Toys</Link></li>
                    <li><Link to='/accessories'>Accessories</Link></li>
                    <li><Link to='/decor'>Decor</Link></li>
                    <li><Link to='/subscription-box'>Subscription Box</Link></li>
                    <li><Link to='/about'>About</Link></li>
                </ul>

                <div className='nav-right'>
                    {user ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            {/* Clicking the name opens the profile panel */}
                            <button
                                onClick={() => setPanelOpen(true)}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    color: 'brown',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    fontSize: '0.95rem',
                                    padding: 0,
                                }}
                            >
                                Hi, {user.name?.split(' ')[0]} ▾
                            </button>
                            <button className='login-btn' onClick={handleLogout}>
                                Logout
                            </button>
                        </div>
                    ) : (
                        <Link to='/login'>
                            <button className='login-btn'>Login</button>
                        </Link>
                    )}

                    <div className='cart-wrapper'>
                        <Link to='/cart'>
                            <img src={shopping_cart} alt="" className='cart-icon' />
                        </Link>
                        <div className='cart-count'>{getTotalItems()}</div>
                    </div>
                </div>
            </div>

            {/* Profile panel lives outside navbar so it overlays the full page */}
            <ProfilePanel
                isOpen={panelOpen}
                onClose={() => setPanelOpen(false)}
            />
        </>
    );
};

export default NavBar;