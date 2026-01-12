const Listing = require("../models/Listing");

// GET /api/listings/search?location=Bangalore
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

// GET /api/listings/category/:category
exports.getListingsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const listings = await Listing.find({ category });
    res.status(200).json(listings);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch properties by category" });
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

// GET /api/listings/:id
exports.getListingById = async (req, res) => {
  try {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    
    if (!listing) {
      return res.status(404).json({ error: "Listing not found" });
    }
    
    res.status(200).json(listing);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch listing" });
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
      images,
      host: req.user.id
    });

    await listing.save();
    res.status(201).json(listing);
  } catch (error) {
    res.status(500).json({ error: "Failed to create listing" });
  }
};

// PUT /api/listings/:id
exports.updateListing = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, location, category, pricePerNight, images } = req.body;
    
    const listing = await Listing.findById(id);
    
    if (!listing) {
      return res.status(404).json({ error: "Listing not found" });
    }
    
    // Check if user is the host
    if (listing.host.toString() !== req.user.id) {
      return res.status(403).json({ error: "Not authorized to update this listing" });
    }
    
    listing.title = title || listing.title;
    listing.description = description || listing.description;
    listing.location = location || listing.location;
    listing.category = category || listing.category;
    listing.pricePerNight = pricePerNight || listing.pricePerNight;
    listing.images = images || listing.images;
    
    await listing.save();
    res.status(200).json(listing);
  } catch (error) {
    res.status(500).json({ error: "Failed to update listing" });
  }
};

// DELETE /api/listings/:id
exports.deleteListing = async (req, res) => {
  try {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    
    if (!listing) {
      return res.status(404).json({ error: "Listing not found" });
    }
    
    // Check if user is the host
    if (listing.host.toString() !== req.user.id) {
      return res.status(403).json({ error: "Not authorized to delete this listing" });
    }
    
    await Listing.findByIdAndDelete(id);
    res.status(200).json({ message: "Listing deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete listing" });
  }
};

// Advanced search
exports.searchListings = async (req, res) => {
  try {
    const { location, category, minPrice, maxPrice, guests } = req.query;
    
    let query = {};
    
    if (location) {
      query.location = { $regex: location, $options: "i" };
    }
    
    if (category && category !== 'all') {
      query.category = category;
    }
    
    if (minPrice || maxPrice) {
      query.pricePerNight = {};
      if (minPrice) query.pricePerNight.$gte = parseInt(minPrice);
      if (maxPrice) query.pricePerNight.$lte = parseInt(maxPrice);
    }
    
    const listings = await Listing.find(query);
    res.status(200).json(listings);
  } catch (error) {
    res.status(500).json({ error: "Failed to search listings" });
  }
};