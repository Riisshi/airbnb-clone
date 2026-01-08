// src/components/pages/Signup.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Signup.css';

function Signup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    if (!formData.agreeTerms) newErrors.agreeTerms = 'You must agree to the terms';

    setErrors(newErrors);
    if (Object.keys(newErrors).length !== 0) return;

    try {
      setLoading(true);
      setServerError("");

      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          password: formData.password
        })
      });

      const data = await res.json();

      if (!res.ok) {
        setServerError(data.message || "Registration failed");
        setLoading(false);
        return;
      }

      alert("Registration successful. Please login.");
      navigate("/login");

    } catch (error) {
      setServerError("Server error. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-container">
        <div className="signup-header">
          <h1 className="signup-title">Create account</h1>
          <p className="signup-subtitle">Join our community today</p>
        </div>
        
        <form className="signup-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">First name</label>
              <input
                className={`form-input ${errors.firstName ? 'error' : ''}`}
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
              {errors.firstName && (
                <div className="error-message">
                  {errors.firstName}
                </div>
              )}
            </div>
            
            <div className="form-group">
              <label className="form-label">Last name</label>
              <input
                className={`form-input ${errors.lastName ? 'error' : ''}`}
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
              {errors.lastName && (
                <div className="error-message">
                  {errors.lastName}
                </div>
              )}
            </div>
          </div>
          
          <div className="form-group">
            <label className="form-label">Email address</label>
            <input
              className={`form-input ${errors.email ? 'error' : ''}`}
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            {errors.email && (
              <div className="error-message">
                {errors.email}
              </div>
            )}
          </div>
          
          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              className={`form-input ${errors.password ? 'error' : ''}`}
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            {errors.password && (
              <div className="error-message">
                {errors.password}
              </div>
            )}
          </div>
          
          <div className="form-group">
            <label className="form-label">Confirm password</label>
            <input
              className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
            {errors.confirmPassword && (
              <div className="error-message">
                {errors.confirmPassword}
              </div>
            )}
          </div>
          
          <div className="terms-group">
            <div className="terms-checkbox">
              <input
                type="checkbox"
                name="agreeTerms"
                checked={formData.agreeTerms}
                onChange={handleChange}
                required
              />
              <label className="terms-label">
                I agree to the <a href="#" className="terms-link">Terms of Service</a> and 
                <a href="#" className="terms-link"> Privacy Policy</a>
              </label>
            </div>
            {errors.agreeTerms && (
              <div className="error-message">
                {errors.agreeTerms}
              </div>
            )}
          </div>
          
          <button 
            className="signup-button" 
            type="submit"
            disabled={!formData.agreeTerms}
          >
            Create account
          </button>
          
          <div className="signup-footer">
            Already have an account? 
            <Link to="/login" className="signup-link">
              Sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Signup;