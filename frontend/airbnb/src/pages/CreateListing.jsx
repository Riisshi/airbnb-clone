import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function CreateListing() {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    category: 'City',
    pricePerNight: '',
    images: ['', '', ''],
    amenities: [],
    maxGuests: 2,
    bedrooms: 1,
    beds: 1,
    bathrooms: 1
  });

  const categories = ['Beach', 'Mountain', 'City', 'Countryside', 'Lake', 'Desert'];
  const amenitiesList = ['WiFi', 'Pool', 'Kitchen', 'Parking', 'Air Conditioning', 'TV', 'Washer', 'Dryer', 'Hot Tub', 'BBQ Grill'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (index, value) => {
    const newImages = [...formData.images];
    newImages[index] = value;
    setFormData(prev => ({
      ...prev,
      images: newImages
    }));
  };

  const handleAmenityToggle = (amenity) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Filter out empty image URLs
      const filteredImages = formData.images.filter(img => img.trim() !== '');
      
      const response = await fetch('http://localhost:5000/api/listings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          images: filteredImages,
          pricePerNight: parseInt(formData.pricePerNight)
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create listing');
      }

      // Redirect to the new listing
      navigate(`/property/${data._id}`);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-listing">
      <header className="create-header">
        <h1>Create a New Listing</h1>
        <p>Share your space with travelers from around the world</p>
      </header>

      <form onSubmit={handleSubmit} className="listing-form">
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <div className="form-section">
          <h2>Basic Information</h2>
          
          <div className="form-group">
            <label>Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Cozy beachfront apartment"
              required
            />
          </div>

          <div className="form-group">
            <label>Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe your space..."
              rows="4"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Location *</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="City, Country"
                required
              />
            </div>

            <div className="form-group">
              <label>Category *</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Price per night ($) *</label>
            <input
              type="number"
              name="pricePerNight"
              value={formData.pricePerNight}
              onChange={handleChange}
              min="1"
              required
            />
          </div>
        </div>

        <div className="form-section">
          <h2>Images</h2>
          <p>Add at least 3 images of your space</p>
          
          {[0, 1, 2].map((index) => (
            <div key={index} className="form-group">
              <label>Image URL {index + 1}</label>
              <input
                type="url"
                value={formData.images[index]}
                onChange={(e) => handleImageChange(index, e.target.value)}
                placeholder="https://example.com/image.jpg"
              />
            </div>
          ))}
        </div>

        <div className="form-section">
          <h2>Amenities</h2>
          <div className="amenities-grid">
            {amenitiesList.map(amenity => (
              <div key={amenity} className="amenity-checkbox">
                <input
                  type="checkbox"
                  id={amenity}
                  checked={formData.amenities.includes(amenity)}
                  onChange={() => handleAmenityToggle(amenity)}
                />
                <label htmlFor={amenity}>{amenity}</label>
              </div>
            ))}
          </div>
        </div>

        <div className="form-section">
          <h2>Accommodation Details</h2>
          
          <div className="form-row">
            <div className="form-group">
              <label>Max Guests</label>
              <input
                type="number"
                name="maxGuests"
                value={formData.maxGuests}
                onChange={handleChange}
                min="1"
              />
            </div>

            <div className="form-group">
              <label>Bedrooms</label>
              <input
                type="number"
                name="bedrooms"
                value={formData.bedrooms}
                onChange={handleChange}
                min="1"
              />
            </div>

            <div className="form-group">
              <label>Beds</label>
              <input
                type="number"
                name="beds"
                value={formData.beds}
                onChange={handleChange}
                min="1"
              />
            </div>

            <div className="form-group">
              <label>Bathrooms</label>
              <input
                type="number"
                name="bathrooms"
                value={formData.bathrooms}
                onChange={handleChange}
                min="1"
                step="0.5"
              />
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button 
            type="button" 
            className="cancel-button"
            onClick={() => navigate('/dashboard')}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="submit-button"
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create Listing'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateListing;