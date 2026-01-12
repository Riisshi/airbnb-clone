import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { properties } from '../data/properties';

function SearchResults() {
  const location = useLocation();
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    location: '',
    category: 'all',
    minPrice: '',
    maxPrice: '',
    guests: 2
  });

  // Extract search parameters from URL
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    
    const locationParam = searchParams.get('location') || '';
    const categoryParam = searchParams.get('category') || 'all';
    const minPriceParam = searchParams.get('minPrice') || '';
    const maxPriceParam = searchParams.get('maxPrice') || '';
    const guestsParam = searchParams.get('guests') || '2';
    
    setFilters({
      location: locationParam,
      category: categoryParam,
      minPrice: minPriceParam,
      maxPrice: maxPriceParam,
      guests: parseInt(guestsParam) || 2
    });
    
    // Perform search with the parameters
    performSearch(locationParam, categoryParam, minPriceParam, maxPriceParam, guestsParam);
  }, [location]);

  const performSearch = (location, category, minPrice, maxPrice, guests) => {
    setLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      let results = [...properties];
      
      console.log("Initial properties:", results.length);
      console.log("Search filters:", { location, category, minPrice, maxPrice, guests });
      
      // Filter by location (case-insensitive partial match)
      if (location) {
        results = results.filter(property => 
          property.location.toLowerCase().includes(location.toLowerCase())
        );
        console.log("After location filter:", results.length);
      }
      
      // Filter by category
      if (category && category !== 'all') {
        results = results.filter(property => property.category === category);
        console.log("After category filter:", results.length);
      }
      
      // Filter by guests
      if (guests) {
        results = results.filter(property => property.maxGuests >= parseInt(guests));
        console.log("After guests filter:", results.length);
      }
      
      // Filter by price range
      if (minPrice) {
        results = results.filter(property => property.pricePerNight >= parseInt(minPrice));
        console.log("After min price filter:", results.length);
      }
      
      if (maxPrice) {
        results = results.filter(property => property.pricePerNight <= parseInt(maxPrice));
        console.log("After max price filter:", results.length);
      }
      
      console.log("Final results:", results);
      setSearchResults(results);
      setLoading(false);
    }, 300);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    
    const queryParams = new URLSearchParams();
    if (filters.location) queryParams.append('location', filters.location);
    if (filters.category !== 'all') queryParams.append('category', filters.category);
    if (filters.minPrice) queryParams.append('minPrice', filters.minPrice);
    if (filters.maxPrice) queryParams.append('maxPrice', filters.maxPrice);
    if (filters.guests > 2) queryParams.append('guests', filters.guests);
    
    // Update URL without page reload
    window.history.pushState({}, '', `/search?${queryParams.toString()}`);
    
    // Trigger search with new filters
    performSearch(filters.location, filters.category, filters.minPrice, filters.maxPrice, filters.guests);
  };

  const handleClearFilters = () => {
    setFilters({
      location: '',
      category: 'all',
      minPrice: '',
      maxPrice: '',
      guests: 2
    });
    
    // Clear URL parameters
    window.history.pushState({}, '', '/search');
    
    // Reset to show all properties
    setSearchResults(properties);
  };

  if (loading) {
    return (
      <div className="search-results">
        <header className="search-header">
          <h1>Search Results</h1>
        </header>
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
          <p style={{ fontSize: '18px', color: '#717171' }}>Finding amazing places for you...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="search-results">
      <header className="search-header">
        <h1>Search Results</h1>
        <p className="results-count">
          <strong>{searchResults.length}</strong> properties found
          {filters.location && ` in ${filters.location}`}
          {filters.category !== 'all' && ` (${filters.category})`}
        </p>
      </header>

      {/* Clear filters button if any filters are active */}
      {(filters.location || filters.category !== 'all' || filters.minPrice || filters.maxPrice || filters.guests > 2) && (
        <button className="clear-filters" onClick={handleClearFilters} style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          background: '#F7F7F7',
          color: '#222222',
          padding: '12px 20px',
          borderRadius: '25px',
          fontWeight: '600',
          marginBottom: '30px',
          border: 'none',
          cursor: 'pointer'
        }}>
          ✕ Clear all filters
        </button>
      )}

      <div className="search-layout">
        {/* Filters Sidebar */}
        <aside className="filters-sidebar" style={{
          background: 'white',
          border: '1px solid #DDDDDD',
          borderRadius: '20px',
          padding: '30px',
          height: 'fit-content',
          position: 'sticky',
          top: '100px'
        }}>
          <form onSubmit={handleSearch}>
            <div className="filter-section" style={{ marginBottom: '30px' }}>
              <h3 style={{ fontSize: '22px', fontWeight: '600', marginBottom: '25px', color: '#222222' }}>Filters</h3>
              
              <div className="filter-group" style={{ marginBottom: '25px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '10px', color: '#222222' }}>Location</label>
                <input
                  type="text"
                  name="location"
                  value={filters.location}
                  onChange={handleFilterChange}
                  placeholder="Where are you going?"
                  style={{
                    width: '100%',
                    padding: '15px',
                    border: '2px solid #DDDDDD',
                    borderRadius: '10px',
                    fontSize: '16px',
                    color: '#222222',
                    background: 'white',
                    transition: 'border-color 0.2s'
                  }}
                />
              </div>

              <div className="filter-group" style={{ marginBottom: '25px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '10px', color: '#222222' }}>Category</label>
                <select
                  name="category"
                  value={filters.category}
                  onChange={handleFilterChange}
                  style={{
                    width: '100%',
                    padding: '15px',
                    border: '2px solid #DDDDDD',
                    borderRadius: '10px',
                    fontSize: '16px',
                    color: '#222222',
                    background: 'white',
                    transition: 'border-color 0.2s'
                  }}
                >
                  <option value="all">All Categories</option>
                  <option value="Beach">Beach</option>
                  <option value="Mountain">Mountain</option>
                  <option value="City">City</option>
                  <option value="Countryside">Countryside</option>
                  <option value="Lake">Lake</option>
                  <option value="Desert">Desert</option>
                </select>
              </div>

              <div className="filter-group" style={{ marginBottom: '25px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '10px', color: '#222222' }}>Price Range ($)</label>
                <div className="price-inputs" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <input
                    type="number"
                    name="minPrice"
                    value={filters.minPrice}
                    onChange={handleFilterChange}
                    placeholder="Min"
                    min="0"
                    style={{
                      flex: '1',
                      padding: '12px',
                      border: '2px solid #DDDDDD',
                      borderRadius: '8px',
                      fontSize: '14px'
                    }}
                  />
                  <span style={{ color: '#717171', fontSize: '14px' }}>to</span>
                  <input
                    type="number"
                    name="maxPrice"
                    value={filters.maxPrice}
                    onChange={handleFilterChange}
                    placeholder="Max"
                    min="0"
                    style={{
                      flex: '1',
                      padding: '12px',
                      border: '2px solid #DDDDDD',
                      borderRadius: '8px',
                      fontSize: '14px'
                    }}
                  />
                </div>
              </div>

              <div className="filter-group" style={{ marginBottom: '25px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '10px', color: '#222222' }}>Guests</label>
                <input
                  type="number"
                  name="guests"
                  value={filters.guests}
                  onChange={handleFilterChange}
                  min="1"
                  max="16"
                  style={{
                    width: '100%',
                    padding: '15px',
                    border: '2px solid #DDDDDD',
                    borderRadius: '10px',
                    fontSize: '16px',
                    color: '#222222',
                    background: 'white',
                    transition: 'border-color 0.2s'
                  }}
                />
              </div>

              <button type="submit" className="apply-filters" style={{
                width: '100%',
                background: '#FF385C',
                color: 'white',
                padding: '18px',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: '600',
                marginTop: '10px',
                border: 'none',
                cursor: 'pointer',
                transition: 'background 0.2s'
              }}>
                Apply Filters
              </button>
            </div>
          </form>
        </aside>

        {/* Results Main */}
        <main className="results-main" style={{ width: '100%' }}>
          {/* Sort Options */}
          <div className="sort-options" style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '30px',
            paddingBottom: '20px',
            borderBottom: '1px solid #DDDDDD'
          }}>
            <span className="sort-label" style={{ fontSize: '16px', fontWeight: '600', color: '#222222' }}>Sort by:</span>
            <select className="sort-select" style={{
              padding: '12px 20px',
              border: '2px solid #DDDDDD',
              borderRadius: '10px',
              fontSize: '16px',
              color: '#222222',
              background: 'white',
              cursor: 'pointer'
            }}>
              <option>Recommended</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Rating: High to Low</option>
            </select>
          </div>

          {/* Results Grid */}
          {searchResults.length === 0 ? (
            <div className="no-results" style={{
              textAlign: 'center',
              padding: '80px 40px',
              background: '#F7F7F7',
              borderRadius: '20px'
            }}>
              <h2 style={{ fontSize: '32px', fontWeight: '600', marginBottom: '15px', color: '#222222' }}>No properties found</h2>
              <p style={{ color: '#717171', fontSize: '18px', marginBottom: '20px' }}>Try adjusting your search filters or try a different location.</p>
              <button onClick={handleClearFilters} style={{
                background: '#FF385C',
                color: 'white',
                padding: '12px 24px',
                borderRadius: '12px',
                fontWeight: '600',
                border: 'none',
                cursor: 'pointer',
                marginTop: '20px'
              }}>
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="results-grid" style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '30px'
            }}>
              {searchResults.map((property) => (
                <div key={property._id} className="result-card" style={{
                  border: '1px solid #DDDDDD',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  background: 'white'
                }}>
                  <Link to={`/property/${property._id}`} style={{
                    display: 'block',
                    textDecoration: 'none',
                    color: 'inherit'
                  }}>
                    <div className="result-image" style={{
                      height: '240px',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      position: 'relative',
                      overflow: 'hidden'
                    }}>
                      <div className="image-placeholder" style={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '18px',
                        fontWeight: '600',
                        padding: '20px',
                        textAlign: 'center'
                      }}>
                        {property.title}
                      </div>
                    </div>
                    <div className="result-content" style={{ padding: '25px' }}>
                      <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '12px', color: '#222222', lineHeight: '1.3' }}>
                        {property.title}
                      </h3>
                      <p className="location" style={{ color: '#717171', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                        📍 {property.location}
                      </p>
                      <span className="category" style={{
                        display: 'inline-block',
                        background: '#F7F7F7',
                        color: '#717171',
                        padding: '5px 12px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: '600',
                        marginBottom: '15px'
                      }}>
                        {property.category}
                      </span>
                      <p className="price" style={{ fontSize: '22px', fontWeight: '700', color: '#222222', marginBottom: '15px' }}>
                        ${property.pricePerNight} / night
                      </p>
                      <div className="listing-details" style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        color: '#717171',
                        fontSize: '14px',
                        marginBottom: '15px',
                        flexWrap: 'wrap'
                      }}>
                        <span style={{ display: 'flex', alignItems: 'center' }}>
                          {property.bedrooms} bedroom{property.bedrooms !== 1 ? 's' : ''}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center' }}>•</span>
                        <span style={{ display: 'flex', alignItems: 'center' }}>
                          {property.beds} bed{property.beds !== 1 ? 's' : ''}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center' }}>•</span>
                        <span style={{ display: 'flex', alignItems: 'center' }}>
                          {property.bathrooms} bathroom{property.bathrooms !== 1 ? 's' : ''}
                        </span>
                      </div>
                      {property.rating > 0 && (
                        <div className="rating" style={{ display: 'flex', alignItems: 'center', gap: '5px', fontWeight: '600', color: '#222222' }}>
                          ⭐ {property.rating} ({property.reviewsCount})
                        </div>
                      )}
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {searchResults.length > 0 && (
            <div className="pagination" style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '15px',
              marginTop: '50px',
              paddingTop: '30px',
              borderTop: '1px solid #DDDDDD'
            }}>
              <button className="pagination-button" disabled style={{
                padding: '12px 20px',
                border: '1px solid #DDDDDD',
                borderRadius: '8px',
                fontWeight: '600',
                color: '#222222',
                background: 'white',
                opacity: '0.5',
                cursor: 'not-allowed'
              }}>← Previous</button>
              <button className="pagination-button active" style={{
                padding: '12px 20px',
                border: '1px solid #FF385C',
                borderRadius: '8px',
                fontWeight: '600',
                color: 'white',
                background: '#FF385C'
              }}>1</button>
              <button className="pagination-button" style={{
                padding: '12px 20px',
                border: '1px solid #DDDDDD',
                borderRadius: '8px',
                fontWeight: '600',
                color: '#222222',
                background: 'white',
                cursor: 'pointer'
              }}>2</button>
              <button className="pagination-button" style={{
                padding: '12px 20px',
                border: '1px solid #DDDDDD',
                borderRadius: '8px',
                fontWeight: '600',
                color: '#222222',
                background: 'white',
                cursor: 'pointer'
              }}>3</button>
              <button className="pagination-button" style={{
                padding: '12px 20px',
                border: '1px solid #DDDDDD',
                borderRadius: '8px',
                fontWeight: '600',
                color: '#222222',
                background: 'white',
                cursor: 'pointer'
              }}>Next →</button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default SearchResults;