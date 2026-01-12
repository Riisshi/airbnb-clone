const mongoose = require("mongoose");

const listingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ["Beach", "Mountain", "City", "Countryside", "Lake", "Desert"],
    required: true
  },
  pricePerNight: {
    type: Number,
    required: true,
    min: 0
  },
  images: [String],
  host: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  amenities: [String],
  maxGuests: {
    type: Number,
    default: 2
  },
  bedrooms: {
    type: Number,
    default: 1
  },
  beds: {
    type: Number,
    default: 1
  },
  bathrooms: {
    type: Number,
    default: 1
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviewsCount: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

module.exports = mongoose.model("Listing", listingSchema);