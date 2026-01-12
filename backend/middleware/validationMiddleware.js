const { body, validationResult } = require('express-validator');

// Register validation
exports.validateRegister = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
];

// Login validation
exports.validateLogin = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
];

// Listing validation
exports.validateListing = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('location').trim().notEmpty().withMessage('Location is required'),
  body('category').isIn(['Beach', 'Mountain', 'City', 'Countryside', 'Lake', 'Desert'])
    .withMessage('Invalid category'),
  body('pricePerNight').isNumeric().withMessage('Price must be a number'),
];

// Booking validation
exports.validateBooking = [
  body('listingId').notEmpty().withMessage('Listing ID is required'),
  body('checkIn').isDate().withMessage('Valid check-in date is required'),
  body('checkOut').isDate().withMessage('Valid check-out date is required'),
];

// Review validation
exports.validateReview = [
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('comment').trim().notEmpty().withMessage('Comment is required'),
];

// Handle validation errors
exports.handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      errors: errors.array().map(err => ({
        field: err.param,
        message: err.msg
      }))
    });
  }
  next();
};