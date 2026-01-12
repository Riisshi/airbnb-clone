const Review = require("../models/Review");
const Listing = require("../models/Listing");

// Create review
exports.createReview = async (req, res) => {
  try {
    const { listingId, rating, comment } = req.body;
    
    // Check if user has booking for this listing
    const hasBooking = true; // In real app, check if user booked this listing
    
    if (!hasBooking) {
      return res.status(400).json({ error: "You must book this property before reviewing" });
    }
    
    // Check if user already reviewed
    const existingReview = await Review.findOne({
      listing: listingId,
      user: req.user.id
    });
    
    if (existingReview) {
      return res.status(400).json({ error: "You have already reviewed this property" });
    }
    
    const review = new Review({
      listing: listingId,
      user: req.user.id,
      rating,
      comment
    });
    
    await review.save();
    
    // Update listing rating
    await updateListingRating(listingId);
    
    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ error: "Failed to create review" });
  }
};

// Get reviews for listing
exports.getListingReviews = async (req, res) => {
  try {
    const { listingId } = req.params;
    
    const reviews = await Review.find({ listing: listingId })
      .populate("user", "name")
      .sort({ createdAt: -1 });
    
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch reviews" });
  }
};

// Update listing rating
async function updateListingRating(listingId) {
  const reviews = await Review.find({ listing: listingId });
  
  if (reviews.length === 0) return;
  
  const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
  const averageRating = totalRating / reviews.length;
  
  await Listing.findByIdAndUpdate(listingId, {
    rating: averageRating,
    reviewsCount: reviews.length
  });
}