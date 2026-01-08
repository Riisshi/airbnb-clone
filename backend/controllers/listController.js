const Listing = require("../models/Listing");

// GET /api/listings?location=Bangalore
exports.getListingsByLocation = async (req, res) => {
  try {
    const { location } = req.query;

    let query = {};

    if (location) {
      query.location = { $regex: location, $options: "i" };
    }

    const listings = await Listing.find(query);

    res.status(200).json(listings);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch properties" });
  }
};

// GET /api/listings
exports.getAllListings = async (req, res) => {
  try {
    const listings = await Listing.find();
    res.status(200).json(listings);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch properties" });
  }
};

// POST /api/listings
exports.createListing = async (req, res) => {
  try {
    const { title, description, location, category, pricePerNight, images } = req.body;

    const listing = new Listing({
      title,
      description,
      location,
      category,
      pricePerNight,
      images
    });

    await listing.save();

    res.status(201).json(listing);
  } catch (error) {
    res.status(500).json({ error: "Failed to create listing" });
  }
};
