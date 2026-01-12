const express = require("express");
const auth = require("../middleware/authMiddleware");
const {
  addToWishlist,
  removeFromWishlist,
  getWishlist,
  checkWishlist
} = require("../controllers/wishlistController");

const router = express.Router();

router.post("/", auth, addToWishlist);
router.delete("/:listingId", auth, removeFromWishlist);
router.get("/", auth, getWishlist);
router.get("/check/:listingId", auth, checkWishlist);

module.exports = router;