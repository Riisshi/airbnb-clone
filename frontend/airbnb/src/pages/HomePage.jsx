// src/components/pages/HomePage.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

function HomePage() {
  const [searchData, setSearchData] = useState({
    location: '',
    checkIn: '',
    checkOut: '',
    guests: 1
  });
  
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', label: 'All' },
    { id: 'beach', label: 'Beach' },
    { id: 'mountain', label: 'Mountain' },
    { id: 'city', label: 'City' }
  ];

  const properties = [
    { id: 1, title: 'Cozy Beach House', city: 'Miami', rating: 4.8, price: 150 },
    { id: 2, title: 'Mountain Cabin', city: 'Denver', rating: 4.9, price: 200 }
  ];

  const filteredProperties = selectedCategory === 'all' 
    ? properties 
    : properties.filter(p => p.category === selectedCategory);

  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearchData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    console.log('Search submitted:', searchData);
    // Add navigation or search logic here
  };

  return (
    <div className="homepage">
      <header className="homepage-header">
        <h1>Find your next unforgettable stay</h1>
        <p>Discover unique homes, experiences, and places around the world.</p>
      </header>

      {/* Search Section */}
      <section className="search-section">
        <form onSubmit={handleSearchSubmit}>
          <div className="search-container">
            <div className="search-field">
              <label className="search-label">Location</label>
              <input
                className="search-input"
                type="text"
                name="location"
                value={searchData.location}
                onChange={handleSearchChange}
                placeholder="Where are you going?"
              />
            </div>
            
            <div className="search-field">
              <label className="search-label">Check in</label>
              <input
                className="search-input"
                type="date"
                name="checkIn"
                value={searchData.checkIn}
                onChange={handleSearchChange}
              />
            </div>
            
            <div className="search-field">
              <label className="search-label">Check out</label>
              <input
                className="search-input"
                type="date"
                name="checkOut"
                value={searchData.checkOut}
                onChange={handleSearchChange}
              />
            </div>
            
            <div className="search-field">
              <label className="search-label">Guests</label>
              <input
                className="search-input"
                type="number"
                name="guests"
                value={searchData.guests}
                onChange={handleSearchChange}
                min="1"
                max="16"
              />
            </div>
            
            <button className="search-button" type="submit">
              Search
            </button>
          </div>
        </form>
      </section>

      {/* Categories */}
      <section className="categories-section">
        <h2 className="section-title">Explore by category</h2>
        <div className="categories-container">
          {categories.map(category => (
            <button
              key={category.id}
              className={`category-button ${selectedCategory === category.id ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category.id)}
            >
              {category.label}
            </button>
          ))}
        </div>
      </section>

      {/* Property Listings */}
      <section className="properties-section">
        <h2 className="section-title">Popular properties</h2>
        <div className="properties-grid">
          {filteredProperties.map(property => (
            <div key={property.id} className="property-card">
              <div className="property-image">
                <div className="property-image-placeholder">
                  {property.title}
                </div>
              </div>
              <div className="property-content">
                <h3 className="property-title">{property.title}</h3>
                <p className="property-location">📍 {property.city}</p>
                <p className="property-rating">⭐ {property.rating}</p>
                <p className="property-price"><strong>${property.price}</strong> / night</p>
                <Link to={`/property/${property.id}`}>
                  <button className="property-button">
                    View details
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="homepage-footer">
        <div className="footer-content">
          <div className="footer-column">
            <h4>Support</h4>
            <ul className="footer-links">
              <li className="footer-link"><button>Help Center</button></li>
              <li className="footer-link"><button>Safety information</button></li>
            </ul>
          </div>
          <div className="footer-column">
            <h4>Community</h4>
            <ul className="footer-links">
              <li className="footer-link"><button>Diversity & Belonging</button></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p className="copyright">© 2024 Airbnb, Inc. All rights reserved</p>
          <div className="footer-links-bottom">
            <button>Privacy</button>
            <button>Terms</button>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default HomePage;