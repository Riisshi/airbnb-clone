import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  
  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="navbar-container">
      <nav className="navbar">
        <Link to="/" className={`navbar-logo ${isActive('/')}`}>
          AirBNB
        </Link>
        <div className="navbar-links">
          {isAuthenticated ? (
            <>
              <Link 
                to="/dashboard" 
                className={`navbar-link ${isActive('/dashboard')}`}
              >
                Dashboard
              </Link>
              <Link 
                to="/create-listing" 
                className={`navbar-link ${isActive('/create-listing')}`}
              >
                Become a Host
              </Link>
              <Link 
                to="/my-bookings" 
                className={`navbar-link ${isActive('/my-bookings')}`}
              >
                My Bookings
              </Link>
              <Link 
                to="/wishlist" 
                className={`navbar-link ${isActive('/wishlist')}`}
              >
                Wishlist
              </Link>
              <div className="user-menu">
                <button className="user-button">
                  {user?.name?.charAt(0) || 'U'}
                </button>
                <div className="user-dropdown">
                  <div className="user-info">
                    <p className="user-name">{user?.name}</p>
                    <p className="user-email">{user?.email}</p>
                  </div>
                  <Link to="/profile" className="dropdown-link">
                    Profile
                  </Link>
                  <button onClick={handleLogout} className="logout-button">
                    Logout
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
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
            </>
          )}
        </div>
      </nav>
    </div>
  );
};

export default Navbar;