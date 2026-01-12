import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Dashboard() {
  const { user } = useAuth();
  const [listings, setListings] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Fetch user listings
      const listingsResponse = await fetch('http://localhost:5000/api/users/listings', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const listingsData = await listingsResponse.json();
      
      // Fetch user bookings
      const bookingsResponse = await fetch('http://localhost:5000/api/bookings/my-bookings', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const bookingsData = await bookingsResponse.json();
      
      setListings(listingsData);
      setBookings(bookingsData);
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return <div>Loading dashboard...</div>;
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Welcome back, {user?.name}</h1>
        <p>Manage your listings and bookings</p>
      </header>

      <div className="dashboard-grid">
        {/* Listings Section */}
        <section className="dashboard-section">
          <div className="section-header">
            <h2>My Listings</h2>
            <Link to="/create-listing" className="create-button">
              + Create New Listing
            </Link>
          </div>
          
          {listings.length === 0 ? (
            <div className="empty-state">
              <p>You haven't created any listings yet.</p>
              <Link to="/create-listing" className="primary-button">
                Create your first listing
              </Link>
            </div>
          ) : (
            <div className="listings-grid">
              {listings.map((listing) => (
                <div key={listing._id} className="listing-card">
                  <div className="listing-image">
                    {listing.images && listing.images.length > 0 ? (
                      <img src={listing.images[0]} alt={listing.title} />
                    ) : (
                      <div className="image-placeholder">{listing.title}</div>
                    )}
                  </div>
                  <div className="listing-content">
                    <h3>{listing.title}</h3>
                    <p className="location">{listing.location}</p>
                    <p className="price">${listing.pricePerNight} / night</p>
                    <div className="listing-actions">
                      <Link to={`/property/${listing._id}`} className="view-button">
                        View
                      </Link>
                      <button className="edit-button">Edit</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Bookings Section */}
        <section className="dashboard-section">
          <h2>My Bookings</h2>
          
          {bookings.length === 0 ? (
            <div className="empty-state">
              <p>You haven't made any bookings yet.</p>
              <Link to="/" className="primary-button">
                Browse listings
              </Link>
            </div>
          ) : (
            <div className="bookings-list">
              {bookings.map((booking) => (
                <div key={booking._id} className="booking-card">
                  <div className="booking-info">
                    <h3>{booking.listing?.title}</h3>
                    <p className="location">{booking.listing?.location}</p>
                    <div className="booking-dates">
                      <span>Check-in: {formatDate(booking.checkIn)}</span>
                      <span>Check-out: {formatDate(booking.checkOut)}</span>
                    </div>
                    <p className="total-price">Total: ${booking.totalPrice}</p>
                  </div>
                  <div className="booking-status">
                    <span className="status-badge">Confirmed</span>
                    <button className="cancel-button">Cancel</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Profile Section */}
        <section className="dashboard-section">
          <h2>Profile Information</h2>
          <div className="profile-card">
            <div className="profile-info">
              <p><strong>Name:</strong> {user?.name}</p>
              <p><strong>Email:</strong> {user?.email}</p>
              <p><strong>Member since:</strong> {formatDate(user?.createdAt)}</p>
            </div>
            <button className="edit-profile-button">Edit Profile</button>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Dashboard;