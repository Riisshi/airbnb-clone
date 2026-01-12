import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function MyBookings() {
  const { token } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/bookings/my-bookings', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch bookings');
      }

      setBookings(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/bookings/${bookingId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to cancel booking');
      }

      // Refresh bookings list
      fetchBookings();
      alert('Booking cancelled successfully');
    } catch (error) {
      alert(error.message);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getBookingStatus = (checkIn) => {
    const now = new Date();
    const checkInDate = new Date(checkIn);
    
    if (checkInDate < now) {
      return { status: 'Completed', class: 'completed' };
    } else if ((checkInDate - now) / (1000 * 60 * 60 * 24) <= 7) {
      return { status: 'Upcoming', class: 'upcoming' };
    } else {
      return { status: 'Confirmed', class: 'confirmed' };
    }
  };

  if (loading) {
    return <div>Loading bookings...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="my-bookings">
      <header className="bookings-header">
        <h1>My Bookings</h1>
        <p>Manage and view all your bookings</p>
      </header>

      {bookings.length === 0 ? (
        <div className="empty-state">
          <h2>No bookings yet</h2>
          <p>Start exploring amazing places to stay!</p>
          <Link to="/" className="primary-button">
            Browse Listings
          </Link>
        </div>
      ) : (
        <div className="bookings-container">
          {/* Upcoming Bookings */}
          <section className="bookings-section">
            <h2>Upcoming Bookings</h2>
            <div className="bookings-list">
              {bookings
                .filter(booking => {
                  const status = getBookingStatus(booking.checkIn);
                  return status.class === 'upcoming' || status.class === 'confirmed';
                })
                .map((booking) => {
                  const status = getBookingStatus(booking.checkIn);
                  
                  return (
                    <div key={booking._id} className="booking-card">
                      <div className="booking-image">
                        {booking.listing?.images && booking.listing.images.length > 0 ? (
                          <img src={booking.listing.images[0]} alt={booking.listing.title} />
                        ) : (
                          <div className="image-placeholder">{booking.listing?.title}</div>
                        )}
                      </div>
                      <div className="booking-details">
                        <h3>{booking.listing?.title}</h3>
                        <p className="location">{booking.listing?.location}</p>
                        
                        <div className="booking-info">
                          <div className="info-group">
                            <span className="info-label">Check-in</span>
                            <span className="info-value">{formatDate(booking.checkIn)}</span>
                          </div>
                          <div className="info-group">
                            <span className="info-label">Check-out</span>
                            <span className="info-value">{formatDate(booking.checkOut)}</span>
                          </div>
                          <div className="info-group">
                            <span className="info-label">Guests</span>
                            <span className="info-value">2</span>
                          </div>
                          <div className="info-group">
                            <span className="info-label">Total</span>
                            <span className="info-value price">${booking.totalPrice}</span>
                          </div>
                        </div>
                        
                        <div className="booking-actions">
                          <span className={`status-badge ${status.class}`}>
                            {status.status}
                          </span>
                          <button 
                            onClick={() => handleCancelBooking(booking._id)}
                            className="cancel-button"
                          >
                            Cancel Booking
                          </button>
                          <Link 
                            to={`/property/${booking.listing?._id}`}
                            className="view-button"
                          >
                            View Property
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </section>

          {/* Past Bookings */}
          <section className="bookings-section">
            <h2>Past Bookings</h2>
            <div className="bookings-list">
              {bookings
                .filter(booking => getBookingStatus(booking.checkIn).class === 'completed')
                .map((booking) => (
                  <div key={booking._id} className="booking-card past">
                    <div className="booking-image">
                      {booking.listing?.images && booking.listing.images.length > 0 ? (
                        <img src={booking.listing.images[0]} alt={booking.listing.title} />
                      ) : (
                        <div className="image-placeholder">{booking.listing?.title}</div>
                      )}
                    </div>
                    <div className="booking-details">
                      <h3>{booking.listing?.title}</h3>
                      <p className="location">{booking.listing?.location}</p>
                      
                      <div className="booking-info">
                        <div className="info-group">
                          <span className="info-label">Stayed</span>
                          <span className="info-value">
                            {formatDate(booking.checkIn)} - {formatDate(booking.checkOut)}
                          </span>
                        </div>
                        <div className="info-group">
                          <span className="info-label">Total Paid</span>
                          <span className="info-value price">${booking.totalPrice}</span>
                        </div>
                      </div>
                      
                      <div className="booking-actions">
                        <span className="status-badge completed">
                          Completed
                        </span>
                        <button className="review-button">
                          Leave a Review
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

export default MyBookings;