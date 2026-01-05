// src/components/pages/Login.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Login.css';

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle login logic
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <h1 className="login-title">Welcome back</h1>
          <p className="login-subtitle">Sign in to your account</p>
        </div>
        
        <form className="login-form" onSubmit={handleSubmit}>
          {message && (
            <div className={`login-message ${message.includes('success') ? 'success' : 'error'}`}>
              {message}
            </div>
          )}
          
          <div className="form-group">
            <label className="form-label">Email address</label>
            <input
              className="form-input"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              placeholder="you@example.com"
              required
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              className="form-input"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              placeholder="Enter your password"
              required
            />
          </div>
          
          <div className="checkbox-group">
            <input
              className="checkbox-input"
              type="checkbox"
              checked={formData.rememberMe}
              onChange={(e) => setFormData({...formData, rememberMe: e.target.checked})}
              id="remember"
            />
            <label className="checkbox-label" htmlFor="remember">
              Remember me
            </label>
          </div>
          
          <button className="login-button" type="submit">
            Sign in
          </button>
          
          <div className="login-divider">
            <span className="divider-text">Or continue with</span>
          </div>
          
          <div className="social-login">
            <button className="social-button google-button" type="button">
              <span className="social-icon">G</span>
              Google
            </button>
            <button className="social-button facebook-button" type="button">
              <span className="social-icon">f</span>
              Facebook
            </button>
          </div>
          
          <div className="login-footer">
            Don't have an account? 
            <Link to="/signup" className="login-link">
              Sign up
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;