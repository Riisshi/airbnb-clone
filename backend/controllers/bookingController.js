const Booking = require("../models/Booking");
const Listing = require("../models/Listing");

// Create booking
exports.createBooking = async (req, res) => {
  try {
    const { listingId, checkIn, checkOut, totalPrice } = req.body;
    
    // Check if listing exists
    const listing = await Listing.findById(listingId);
    if (!listing) {
      return res.status(404).json({ error: "Listing not found" });
    }
    
    // Check if dates are available (simplified check)
    const existingBooking = await Booking.findOne({
      listing: listingId,
      $or: [
        { checkIn: { $lte: checkOut }, checkOut: { $gte: checkIn } }
      ]
    });
    
    if (existingBooking) {
      return res.status(400).json({ error: "Dates are not available" });
    }
    
    const booking = await Booking.create({
      listing: listingId,
      user: req.user.id,
      checkIn: new Date(checkIn),
      checkOut: new Date(checkOut),
      totalPrice
    });
    
    res.status(201).json(booking);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create booking" });
  }
};

// Get user bookings
exports.getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .populate("listing", "title images location pricePerNight")
      .sort({ createdAt: -1 });
    
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
};

// Get listing bookings
exports.getListingBookings = async (req, res) => {
  try {
    const { listingId } = req.params;
    
    // Check if user owns the listing
    const listing = await Listing.findById(listingId);
    if (!listing || listing.host.toString() !== req.user.id) {
      return res.status(403).json({ error: "Not authorized" });
    }
    
    const bookings = await Booking.find({ listing: listingId })
      .populate("user", "name email")
      .sort({ checkIn: 1 });
    
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch listing bookings" });
  }
};

// Cancel booking
exports.cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;
    
    const booking = await Booking.findById(id);
    
    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }
    
    // Check if user owns the booking
    if (booking.user.toString() !== req.user.id) {
      return res.status(403).json({ error: "Not authorized" });
    }
    
    // Check if booking can be cancelled (at least 2 days before check-in)
    const checkInDate = new Date(booking.checkIn);
    const now = new Date();
    const daysDifference = (checkInDate - now) / (1000 * 60 * 60 * 24);
    
    if (daysDifference < 2) {
      return res.status(400).json({ error: "Cannot cancel booking within 48 hours of check-in" });
    }
    
    await Booking.findByIdAndDelete(id);
    res.status(200).json({ message: "Booking cancelled successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to cancel booking" });
  }
};