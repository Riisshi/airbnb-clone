const express = require("express");
const auth = require("../middleware/authMiddleware");
const {
  createBooking,
  getUserBookings,
  getListingBookings,
  cancelBooking
} = require("../controllers/bookingController");

const router = express.Router();

router.post("/", auth, createBooking);
router.get("/my-bookings", auth, getUserBookings);
router.get("/listing/:listingId", auth, getListingBookings);
router.delete("/:id", auth, cancelBooking);

module.exports = router;