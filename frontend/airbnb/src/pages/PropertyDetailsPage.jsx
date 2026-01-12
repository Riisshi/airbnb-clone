import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { properties } from '../data/properties'; // Import the properties
import './PropertyDetailsPage.css';

function PropertyDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, token } = useAuth();
  
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);
  
  const [activeTab, setActiveTab] = useState('description');
  const [selectedDates, setSelectedDates] = useState({ 
    checkIn: '', 
    checkOut: '' 
  });
  const [guests, setGuests] = useState(2);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    fetchListing();
  }, [id]);

  useEffect(() => {
    calculateTotalPrice();
  }, [selectedDates, listing]);

  const fetchListing = async () => {
    try {
      setLoading(true);
      
      // Find the property from our local data
      const foundProperty = properties.find(p => p._id === id);
      
      if (!foundProperty) {
        throw new Error("Property not found");
      }
      
      setListing(foundProperty);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotalPrice = () => {
    if (!selectedDates.checkIn || !selectedDates.checkOut || !listing) {
      setTotalPrice(0);
      return;
    }
    
    const checkIn = new Date(selectedDates.checkIn);
    const checkOut = new Date(selectedDates.checkOut);
    const nights = (checkOut - checkIn) / (1000 * 60 * 60 * 24);
    
    if (nights > 0) {
      setTotalPrice(nights * listing.pricePerNight);
    } else {
      setTotalPrice(0);
    }
  };

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setSelectedDates(prev => ({ ...prev, [name]: value }));
  };

  const handleBooking = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    if (!selectedDates.checkIn || !selectedDates.checkOut) {
      alert('Please select check-in and check-out dates');
      return;
    }
    
    if (guests < 1) {
      alert('Please select at least 1 guest');
      return;
    }
    
    if (listing && guests > (listing?.maxGuests || 2)) {
      alert(`Maximum ${listing.maxGuests} guests allowed`);
      return;
    }
    
    try {
      setBookingLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      alert('Booking successful! Check your bookings in the dashboard.');
      navigate('/my-bookings');
      
    } catch (error) {
      alert('Booking failed: ' + error.message);
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="search-loading" style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '400px',
        gap: '20px'
      }}>
        <div className="loading-spinner" style={{
          width: '50px',
          height: '50px',
          border: '3px solid #F7F7F7',
          borderTop: '3px solid #FF385C',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        <p style={{ fontSize: '18px', color: '#717171' }}>Loading property details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-message" style={{
        maxWidth: '800px',
        margin: '100px auto',
        padding: '40px',
        background: '#FEF2F2',
        color: '#DC2626',
        borderRadius: '16px',
        textAlign: 'center'
      }}>
        <h2 style={{ marginBottom: '20px' }}>Property Not Found</h2>
        <p style={{ marginBottom: '30px' }}>{error}</p>
        <button 
          onClick={() => navigate('/')}
          style={{
            background: '#FF385C',
            color: 'white',
            padding: '15px 30px',
            borderRadius: '12px',
            fontWeight: '600',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          Back to Home
        </button>
      </div>
    );
  }

  if (!listing) {
    return <div>Property not found</div>;
  }

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="property-details-page">
      {/* Property Header */}
      <header className="property-header">
        <h1 className="property-title">{listing.title}</h1>
        <div className="property-meta">
          {listing.rating > 0 && (
            <span className="rating-badge">
              ⭐ {listing.rating} ({listing.reviewsCount} reviews)
            </span>
          )}
          <span className="location-info">
            📍 {listing.location}
          </span>
          <span className="category-badge" style={{
            background: '#F7F7F7',
            color: '#717171',
            padding: '4px 12px',
            borderRadius: '20px',
            fontSize: '12px',
            fontWeight: '600'
          }}>
            {listing.category}
          </span>
        </div>
      </header>

      {/* Image Gallery */}
      <div className="image-gallery">
        <div className="main-image">
          <div className="image-placeholder" style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '24px',
            fontWeight: '600'
          }}>
            {listing.title}
          </div>
          <button className="show-all-button">Show all photos</button>
        </div>
        <div className="side-images">
          {[1, 2].map((index) => (
            <div key={index} className="side-image">
              <div className="image-placeholder" style={{
                background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '18px',
                fontWeight: '600'
              }}>
                {index === 1 ? 'Living Room' : 'Bedroom'}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="details-layout">
        {/* Left Column */}
        <div className="details-left">
          <div className="host-info">
            <h2 className="host-title">Hosted by {listing.host}</h2>
            <div className="property-stats">
              <span>{listing.bedrooms || 1} bedroom{listing.bedrooms !== 1 ? 's' : ''}</span>
              <span>{listing.beds || 1} bed{listing.beds !== 1 ? 's' : ''}</span>
              <span>{listing.bathrooms || 1} bathroom{listing.bathrooms !== 1 ? 's' : ''}</span>
              <span>Up to {listing.maxGuests || 2} guests</span>
            </div>
          </div>

          {/* Tabs */}
          <div className="details-tabs">
            <button 
              className={`tab-button ${activeTab === 'description' ? 'active' : ''}`}
              onClick={() => setActiveTab('description')}
            >
              Description
            </button>
            <button 
              className={`tab-button ${activeTab === 'amenities' ? 'active' : ''}`}
              onClick={() => setActiveTab('amenities')}
            >
              Amenities
            </button>
            <button 
              className={`tab-button ${activeTab === 'reviews' ? 'active' : ''}`}
              onClick={() => setActiveTab('reviews')}
            >
              Reviews
            </button>
          </div>

          {/* Tab Content */}
          <div className="tab-content">
            {activeTab === 'description' && (
              <div className="description-content">
                <p style={{ fontSize: '16px', lineHeight: '1.7', marginBottom: '20px' }}>
                  {listing.description}
                </p>
                <div style={{ marginTop: '30px' }}>
                  <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '15px' }}>About this space</h3>
                  <ul style={{ listStyle: 'none' }}>
                    <li style={{ marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ color: '#FF385C' }}>✓</span> Entire {listing.category.toLowerCase()} property
                    </li>
                    <li style={{ marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ color: '#FF385C' }}>✓</span> Self check-in
                    </li>
                    <li style={{ marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ color: '#FF385C' }}>✓</span> Free cancellation
                    </li>
                  </ul>
                </div>
              </div>
            )}
            
            {activeTab === 'amenities' && (
              <div className="amenities-content">
                <div className="amenities-grid">
                  {listing.amenities && listing.amenities.length > 0 ? (
                    listing.amenities.map((amenity, index) => (
                      <div key={index} className="amenity-item">
                        <span className="amenity-icon">✓</span>
                        {amenity}
                      </div>
                    ))
                  ) : (
                    <p>No amenities listed</p>
                  )}
                </div>
              </div>
            )}
            
            {activeTab === 'reviews' && (
              <div className="reviews-content">
                <div className="review-item">
                  <div className="review-header">
                    <div className="reviewer">
                      <div className="reviewer-avatar">S</div>
                      <div className="reviewer-info">
                        <h4>Sarah Johnson</h4>
                        <span className="review-date">January 2024</span>
                      </div>
                    </div>
                    <div className="review-rating">
                      ⭐ 5.0
                    </div>
                  </div>
                  <p className="review-text">"Amazing stay! The property was exactly as described and the host was very responsive. Would definitely book again!"</p>
                </div>
                
                <div className="review-item" style={{ marginTop: '20px' }}>
                  <div className="review-header">
                    <div className="reviewer">
                      <div className="reviewer-avatar">M</div>
                      <div className="reviewer-info">
                        <h4>Michael Chen</h4>
                        <span className="review-date">December 2023</span>
                      </div>
                    </div>
                    <div className="review-rating">
                      ⭐ 4.8
                    </div>
                  </div>
                  <p className="review-text">"Great location and beautiful property. Everything was clean and well-maintained. Highly recommended!"</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Booking Widget */}
        <div className="details-right">
          <div className="booking-widget">
            <div className="price-section">
              <span className="price-amount">${listing.pricePerNight}</span>
              <span className="price-unit"> / night</span>
            </div>
            
            <div className="date-selector">
              <div className="date-grid">
                <div className="date-input-group">
                  <label className="date-label">CHECK-IN</label>
                  <input
                    className="date-input"
                    type="date"
                    name="checkIn"
                    value={selectedDates.checkIn}
                    onChange={handleDateChange}
                    min={today}
                  />
                </div>
                <div className="date-input-group">
                  <label className="date-label">CHECK-OUT</label>
                  <input
                    className="date-input"
                    type="date"
                    name="checkOut"
                    value={selectedDates.checkOut}
                    onChange={handleDateChange}
                    min={selectedDates.checkIn || today}
                  />
                </div>
              </div>
            </div>
            
            <div className="guests-selector">
              <label className="guests-label">GUESTS</label>
              <input
                className="guests-input"
                type="number"
                value={guests}
                onChange={(e) => setGuests(parseInt(e.target.value) || 1)}
                min="1"
                max={listing.maxGuests || 6}
              />
            </div>
            
            {totalPrice > 0 && (
              <div className="price-breakdown">
                <div className="price-item">
                  <span>${listing.pricePerNight} x {totalPrice / listing.pricePerNight} nights</span>
                  <span>${totalPrice}</span>
                </div>
                <div className="price-item total">
                  <span>Total</span>
                  <span>${totalPrice}</span>
                </div>
              </div>
            )}
            
            <button 
              className="reserve-button"
              onClick={handleBooking}
              disabled={bookingLoading}
              style={{
                opacity: bookingLoading ? 0.7 : 1,
                cursor: bookingLoading ? 'not-allowed' : 'pointer'
              }}
            >
              {bookingLoading ? 'Processing...' : 'Reserve'}
            </button>
            
            <p className="booking-note">
              You won't be charged yet
            </p>
          </div>
        </div>
      </div>

      {/* Host Contact Section */}
      <section className="host-contact">
        <div className="host-contact-header">
          <div className="host-avatar" style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #667eea, #764ba2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '32px',
            fontWeight: '700'
          }}>
            {listing.host?.charAt(0) || 'H'}
          </div>
          <div className="host-info-text">
            <h3>Hosted by {listing.host}</h3>
            <span className="host-badge" style={{
              display: 'inline-block',
              background: '#FF385C',
              color: 'white',
              padding: '4px 12px',
              borderRadius: '20px',
              fontSize: '12px',
              fontWeight: '600',
              marginBottom: '10px'
            }}>
              Superhost
            </span>
            <p className="host-details">
              Superhost · 5 years hosting · Response time: within an hour
            </p>
          </div>
        </div>
        <div className="contact-actions">
          <button className="contact-button message-button">
            Message host
          </button>
          <button className="contact-button call-button">
            Call host
          </button>
        </div>
      </section>

      {/* Similar Listings */}
      <section className="similar-listings">
        <h2 className="similar-title">Similar listings</h2>
        <div className="similar-grid">
          {properties
            .filter(p => p.category === listing.category && p._id !== listing._id)
            .slice(0, 3)
            .map(property => (
              <div key={property._id} className="similar-card">
                <div className="similar-image" style={{
                  height: '200px',
                  background: 'linear-gradient(135deg, #667eea, #764ba2)',
                  borderRadius: '12px',
                  marginBottom: '15px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: '600',
                  fontSize: '16px',
                  textAlign: 'center',
                  padding: '20px'
                }}>
                  {property.title}
                </div>
                <div className="similar-info">
                  <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>
                    {property.title}
                  </h4>
                  <p className="similar-price" style={{ fontSize: '18px', fontWeight: '700', color: '#222222' }}>
                    ${property.pricePerNight} / night
                  </p>
                </div>
              </div>
            ))}
        </div>
      </section>
    </div>
  );
}

export default PropertyDetailsPage;