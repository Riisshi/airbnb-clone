const User = require("../models/User");

// Add to wishlist
exports.addToWishlist = async (req, res) => {
  try {
    const { listingId } = req.body;
    
    const user = await User.findById(req.user.id);
    
    if (user.wishlist.includes(listingId)) {
      return res.status(400).json({ error: "Already in wishlist" });
    }
    
    user.wishlist.push(listingId);
    await user.save();
    
    res.status(200).json({ message: "Added to wishlist" });
  } catch (error) {
    res.status(500).json({ error: "Failed to add to wishlist" });
  }
};

// Remove from wishlist
exports.removeFromWishlist = async (req, res) => {
  try {
    const { listingId } = req.params;
    
    const user = await User.findById(req.user.id);
    
    user.wishlist = user.wishlist.filter(id => id.toString() !== listingId);
    await user.save();
    
    res.status(200).json({ message: "Removed from wishlist" });
  } catch (error) {
    res.status(500).json({ error: "Failed to remove from wishlist" });
  }
};

// Get wishlist
exports.getWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate({
      path: 'wishlist',
      select: 'title images location pricePerNight rating'
    });
    
    res.status(200).json(user.wishlist);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch wishlist" });
  }
};

// Check if listing is in wishlist
exports.checkWishlist = async (req, res) => {
  try {
    const { listingId } = req.params;
    
    const user = await User.findById(req.user.id);
    const isInWishlist = user.wishlist.includes(listingId);
    
    res.status(200).json({ isInWishlist });
  } catch (error) {
    res.status(500).json({ error: "Failed to check wishlist" });
  }
};