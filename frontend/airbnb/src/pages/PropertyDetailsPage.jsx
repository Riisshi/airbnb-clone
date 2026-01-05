// src/components/pages/PropertyDetailsPage.jsx
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import './PropertyDetailsPage.css';

function PropertyDetailsPage() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('description');
  const [selectedDates, setSelectedDates] = useState({ checkIn: '', checkOut: '' });
  const [guests, setGuests] = useState(2);

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setSelectedDates(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="property-details-page">
      {/* Property Header */}
      <header className="property-header">
        <h1 className="property-title">Beautiful Beachfront Villa</h1>
        <div className="property-meta">
          <span className="rating-badge">
            ⭐ 4.8 (128 reviews)
          </span>
          <span className="location-info">
            📍 Miami, Florida
          </span>
        </div>
      </header>

      {/* Image Gallery */}
      <div className="image-gallery">
        <div className="main-image">
          <div className="image-placeholder">Main Image</div>
          <button className="show-all-button">Show all photos</button>
        </div>
        <div className="side-images">
          <div className="side-image">
            <div className="image-placeholder">Bedroom</div>
          </div>
          <div className="side-image">
            <div className="image-placeholder">Living Room</div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="details-layout">
        {/* Left Column */}
        <div className="details-left">
          <div className="host-info">
            <h2 className="host-title">Hosted by John Doe</h2>
            <div className="property-stats">
              <span>3 bedrooms</span>
              <span>2 bathrooms</span>
              <span>6 guests maximum</span>
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
                <p>Stunning beachfront villa with private pool and ocean view...</p>
              </div>
            )}
            
            {activeTab === 'amenities' && (
              <div className="amenities-content">
                <div className="amenities-grid">
                  {['WiFi', 'Pool', 'Kitchen', 'Parking', 'Air Conditioning'].map((amenity, index) => (
                    <div key={index} className="amenity-item">
                      <span className="amenity-icon">✓</span>
                      {amenity}
                    </div>
                  ))}
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
                  <p className="review-text">Amazing stay! The view was breathtaking...</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Booking Widget */}
        <div className="details-right">
          <div className="booking-widget">
            <div className="price-section">
              <span className="price-amount">$200</span>
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
                onChange={(e) => setGuests(parseInt(e.target.value))}
                min="1"
                max="6"
              />
            </div>
            
            <div className="price-breakdown">
              <div className="price-item">
                <span>$200 x 3 nights</span>
                <span>$600</span>
              </div>
              <div className="price-item total">
                <span>Total</span>
                <span>$600</span>
              </div>
            </div>
            
            <button className="reserve-button">
              Reserve
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
          <div className="host-avatar">JD</div>
          <div className="host-info-text">
            <h3>Hosted by John Doe</h3>
            <span className="host-badge">Superhost</span>
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
          {[1, 2, 3].map(item => (
            <div key={item} className="similar-card">
              <div className="similar-image"></div>
              <div className="similar-info">
                <h4>Beach House {item}</h4>
                <p className="similar-price">${180 + item * 20} / night</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default PropertyDetailsPage;