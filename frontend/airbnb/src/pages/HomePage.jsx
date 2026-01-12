import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { properties } from '../data/properties';  // Import the properties
//import './App.css';

function HomePage() {
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const [searchData, setSearchData] = useState({
    location: '',
    checkIn: '',
    checkOut: '',
    guests: 2
  });
  
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', label: 'All' },
    { id: 'Beach', label: 'Beach' },
    { id: 'Mountain', label: 'Mountain' },
    { id: 'City', label: 'City' },
    { id: 'Countryside', label: 'Countryside' },
    { id: 'Lake', label: 'Lake' },
    { id: 'Desert', label: 'Desert' }
  ];

  useEffect(() => {
    // Load properties on component mount
    setListings(properties.slice(0, 8)); // Show only 8 on homepage
  }, []);

  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearchData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSearchSubmit = (e) => {
  e.preventDefault();
  
  // Create query parameters
  const params = new URLSearchParams();
  if (searchData.location) params.append('location', searchData.location);
  if (selectedCategory !== 'all') params.append('category', selectedCategory);
  if (searchData.checkIn) params.append('checkIn', searchData.checkIn);
  if (searchData.checkOut) params.append('checkOut', searchData.checkOut);
  if (searchData.guests > 2) params.append('guests', searchData.guests);
  
  console.log("Navigating to search with params:", params.toString());
  
  // Navigate to search results
  navigate(`/search?${params.toString()}`);
};

  const handleCategoryClick = (categoryId) => {
    setSelectedCategory(categoryId);
    
    // If clicking a category, navigate to search results with that category
    if (categoryId !== 'all') {
      navigate(`/search?category=${categoryId}`);
    }
  };

  // Filter properties by selected category for homepage display
  const filteredListings = selectedCategory === 'all' 
    ? listings 
    : listings.filter(listing => listing.category === selectedCategory);

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
                min={new Date().toISOString().split('T')[0]}
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
                min={searchData.checkIn || new Date().toISOString().split('T')[0]}
              />
            </div>
            
            <div className="search-field">
              <label className="search-label">Guests</label>
              <div className="guest-selector">
                <input
                  className="search-input"
                  type="number"
                  name="guests"
                  value={searchData.guests}
                  onChange={handleSearchChange}
                  min="1"
                  max="16"
                  style={{ padding: 0 }}
                />
              </div>
            </div>
            
            <button className="search-button" type="submit">
              🔍 Search
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
              onClick={() => handleCategoryClick(category.id)}
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
          {filteredListings.map(listing => (
            <div key={listing._id} className="property-card">
              <Link to={`/property/${listing._id}`}>
                <div className="property-image">
                  {listing.images && listing.images.length > 0 ? (
                    <div className="property-image-placeholder" 
                         style={{ 
                           background: `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`,
                           width: '100%',
                           height: '100%',
                           display: 'flex',
                           alignItems: 'center',
                           justifyContent: 'center',
                           color: 'white',
                           fontSize: '20px',
                           fontWeight: '600'
                         }}>
                      {listing.title}
                    </div>
                  ) : (
                    <div className="property-image-placeholder">
                      {listing.title}
                    </div>
                  )}
                </div>
                <div className="property-content">
                  <h3 className="property-title">{listing.title}</h3>
                  <p className="property-location">📍 {listing.location}</p>
                  <p className="property-category" style={{ 
                    display: 'inline-block',
                    background: '#F7F7F7',
                    padding: '4px 12px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: '600',
                    marginBottom: '10px'
                  }}>
                    {listing.category}
                  </p>
                  {listing.rating > 0 && (
                    <p className="property-rating">⭐ {listing.rating} ({listing.reviewsCount} reviews)</p>
                  )}
                  <p className="property-price"><strong>${listing.pricePerNight}</strong> / night</p>
                  <div className="property-details" style={{ 
                    display: 'flex',
                    gap: '10px',
                    color: '#717171',
                    fontSize: '14px',
                    marginTop: '10px'
                  }}>
                    <span>{listing.bedrooms} bedroom{listing.bedrooms !== 1 ? 's' : ''}</span>
                    <span>•</span>
                    <span>{listing.beds} bed{listing.beds !== 1 ? 's' : ''}</span>
                    <span>•</span>
                    <span>{listing.bathrooms} bathroom{listing.bathrooms !== 1 ? 's' : ''}</span>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
        
        {filteredListings.length > 0 && (
          <div className="view-all-container" style={{ textAlign: 'center', marginTop: '40px' }}>
            <Link to="/search" className="view-all-button" style={{
              background: '#FF385C',
              color: 'white',
              padding: '15px 30px',
              borderRadius: '12px',
              fontWeight: '600',
              textDecoration: 'none',
              display: 'inline-block'
            }}>
              View all properties →
            </Link>
          </div>
        )}
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