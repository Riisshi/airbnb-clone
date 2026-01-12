import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

function WishlistButton({ listingId }) {
  const { isAuthenticated, token } = useAuth();
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated && listingId) {
      checkWishlistStatus();
    }
  }, [isAuthenticated, listingId]);

  const checkWishlistStatus = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/wishlist/check/${listingId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      setIsInWishlist(data.isInWishlist);
    } catch (error) {
      console.error('Error checking wishlist:', error);
    }
  };

  const toggleWishlist = async () => {
    if (!isAuthenticated) {
      alert('Please login to save to wishlist');
      return;
    }

    setLoading(true);
    try {
      if (isInWishlist) {
        await fetch(`http://localhost:5000/api/wishlist/${listingId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setIsInWishlist(false);
      } else {
        await fetch('http://localhost:5000/api/wishlist', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ listingId })
        });
        setIsInWishlist(true);
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button 
      className={`wishlist-button ${isInWishlist ? 'active' : ''}`}
      onClick={toggleWishlist}
      disabled={loading}
      aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      {isInWishlist ? '♥' : '♡'}
    </button>
  );
}

export default WishlistButton;