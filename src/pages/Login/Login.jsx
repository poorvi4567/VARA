import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../Context/AuthContext';
import './Login.css';

const Login = () => {
  const { login, register, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Go back to where they came from, or home if they came directly
  const from = location.state?.from?.pathname || '/';

  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isRegister) {
        await register(name, email, password);
      } else {
        await login(email, password);
      }
      navigate(from, { replace: true }); // ← redirect to previous page
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError('');
    try {
      await loginWithGoogle();
      navigate(from, { replace: true }); // ← same redirect
    } catch (err) {
      console.error('Google auth error:', err);
      setError(err.message || 'Google sign in failed. Please try again.');
    }
  };

  return (
    <div className="login-container">
      <h2>{isRegister ? 'Create Account' : 'Welcome Back'}</h2>

      {error && (
        <p style={{ color: 'red', marginBottom: '1rem', fontSize: '0.9rem' }}>
          {error}
        </p>
      )}

      <form className="login-form" onSubmit={handleSubmit}>
        {isRegister && (
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        )}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? 'Please wait...' : isRegister ? 'Sign Up' : 'Login'}
        </button>

        <div className="divider"><span>or</span></div>

        <button type="button" className="google-login" onClick={handleGoogle}>
          {isRegister ? 'Sign up with Google' : 'Sign in with Google'}
        </button>

        <p className="signup-text">
          {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            type="button"
            onClick={() => setIsRegister(!isRegister)}
            style={{
              background: 'none',
              border: 'none',
              color: 'brown',
              cursor: 'pointer',
              padding: 0,
              fontSize: 'inherit'
            }}
          >
            {isRegister ? 'Login' : 'Sign up'}
          </button>
        </p>
      </form>
    </div>
  );
};

export default Login;