const express = require("express");
const auth = require("../middleware/authMiddleware");
const {
  createReview,
  getListingReviews
} = require("../controllers/reviewController");

const router = express.Router();

router.post("/", auth, createReview);
router.get("/listing/:listingId", getListingReviews);

module.exports = router;