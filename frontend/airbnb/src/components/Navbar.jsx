// src/components/Navbar.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const location = useLocation();
  
  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <div className="navbar-container">
      <nav className="navbar">
        <Link to="/" className={`navbar-logo ${isActive('/')}`}>
          AirBNB
        </Link>
        <div className="navbar-links">
          <Link 
            to="/login" 
            className={`navbar-link ${isActive('/login')}`}
          >
            Login
          </Link>
          <Link 
            to="/signup" 
            className={`navbar-link ${isActive('/signup')}`}
          >
            Signup
          </Link>
          <Link 
            to="/property/1" 
            className={`navbar-link ${isActive('/property/1')}`}
          >
            Property Details
          </Link>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;