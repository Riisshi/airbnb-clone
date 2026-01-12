import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function WishlistPage() {
  const { token } = useAuth();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/wishlist', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      setWishlist(data);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (listingId) => {
    try {
      await fetch(`http://localhost:5000/api/wishlist/${listingId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      // Update local state
      setWishlist(wishlist.filter(item => item._id !== listingId));
    } catch (error) {
      console.error('Error removing from wishlist:', error);
    }
  };

  if (loading) {
    return <div>Loading wishlist...</div>;
  }

  return (
    <div className="wishlist-page">
      <header className="wishlist-header">
        <h1>My Wishlist</h1>
        <p>{wishlist.length} saved properties</p>
      </header>

      {wishlist.length === 0 ? (
        <div className="empty-wishlist">
          <h2>Your wishlist is empty</h2>
          <p>Start exploring and save your favorite properties!</p>
          <Link to="/" className="primary-button">
            Browse Properties
          </Link>
        </div>
      ) : (
        <div className="wishlist-grid">
          {wishlist.map((listing) => (
            <div key={listing._id} className="wishlist-card">
              <Link to={`/property/${listing._id}`}>
                <div className="wishlist-image">
                  {listing.images && listing.images.length > 0 ? (
                    <img src={listing.images[0]} alt={listing.title} />
                  ) : (
                    <div className="image-placeholder">{listing.title}</div>
                  )}
                </div>
                <div className="wishlist-content">
                  <h3>{listing.title}</h3>
                  <p className="location">{listing.location}</p>
                  <p className="price">${listing.pricePerNight} / night</p>
                  {listing.rating > 0 && (
                    <div className="rating">
                      ⭐ {listing.rating}
                    </div>
                  )}
                </div>
              </Link>
              <button 
                className="remove-button"
                onClick={() => removeFromWishlist(listing._id)}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default WishlistPage;