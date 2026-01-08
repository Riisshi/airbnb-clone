const mongoose = require("mongoose");

const listingSchema = new mongoose.Schema({
  title: String,
  description: String,
  location: {
    type: String,
    required: true
  },
  category: {
    type: String, // Beach, Mountain, City
    enum: ["Beach", "Mountain", "City"]
  },
  pricePerNight: Number,
  images: [String]
}, { timestamps: true });

module.exports = mongoose.model("Listing", listingSchema);
