const User = require("../models/User");
const Listing = require("../models/Listing");

// Get user profile
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user profile" });
  }
};

// Update user profile
exports.updateUserProfile = async (req, res) => {
  try {
    const { name, email } = req.body;
    
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    
    user.name = name || user.name;
    user.email = email || user.email;
    
    await user.save();
    
    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email
    };
    
    res.status(200).json(userResponse);
  } catch (error) {
    res.status(500).json({ error: "Failed to update profile" });
  }
};

// Get user's listings
exports.getUserListings = async (req, res) => {
  try {
    const listings = await Listing.find({ host: req.user.id });
    res.status(200).json(listings);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user listings" });
  }
};