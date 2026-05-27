import React, { createContext, useState, useContext, useEffect } from 'react';
import { auth, googleProvider } from '../config/firebase';
import { signInWithPopup, signOut, browserPopupRedirectResolver } from 'firebase/auth';
import API_URL from '../config/api';
export const AuthContext = createContext();

const AuthContextProvider = ({ children }) => {
    const [user, setUser] = useState(null);       // The logged-in user object
    const [token, setToken] = useState(null);     // Your JWT token
    const [loading, setLoading] = useState(true); // True while checking localStorage

    // On app load, restore session from localStorage if it exists
    useEffect(() => {
        const savedUser = localStorage.getItem('vara_user');
        const savedToken = localStorage.getItem('vara_token');
        if (savedUser && savedToken) {
            setUser(JSON.parse(savedUser));
            setToken(savedToken);
        }
        setLoading(false);
    }, []);

    // Saves user + token to state AND localStorage
    const saveSession = (userData, jwtToken) => {
        setUser(userData);
        setToken(jwtToken);
        localStorage.setItem('vara_user', JSON.stringify(userData));
        localStorage.setItem('vara_token', jwtToken);
    };

    // Email/password login
    const login = async (email, password) => {
        const res = await fetch(`${API_URL}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        saveSession(data, data.token);
        return data;
    };

    // Email/password register
    const register = async (name, email, password) => {
        const res = await fetch(`${API_URL}/api/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        saveSession(data, data.token);
        return data;
    };

    // Google Sign In
    const loginWithGoogle = async () => {
        // Using explicit resolver to avoid "missing initial state" in storage-partitioned browsers
        const result = await signInWithPopup(auth, googleProvider, browserPopupRedirectResolver);
        // Step 2: Get the Firebase ID token
        const idToken = await result.user.getIdToken();
        // Step 3: Send it to your Express backend to verify
        const res = await fetch(`${API_URL}/api/auth/google`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ idToken }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        // Step 4: Save your own JWT (not Firebase's token)
        saveSession(data, data.token);
        return data;
    };

    const logout = async () => {
        await signOut(auth); // Sign out from Firebase too
        setUser(null);
        setToken(null);
        localStorage.removeItem('vara_user');
        localStorage.removeItem('vara_token');
    };

    return (
        <AuthContext.Provider value={{ user, token, login, register, loginWithGoogle, logout, loading, setUser }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook — cleaner to use in components
export const useAuth = () => useContext(AuthContext);
export default AuthContextProvider;