const express = require("express");
const auth = require("../middleware/authMiddleware");

const {
  createListing,
  getAllListings,
  getListingsByLocation,
  getListingById,
  updateListing,
  deleteListing,
  getListingsByCategory
} = require("../controllers/listController");

const router = express.Router();

router.post("/", auth, createListing);
router.get("/", getAllListings);
router.get("/search", getListingsByLocation);
router.get("/category/:category", getListingsByCategory);
router.get("/:id", getListingById);
router.put("/:id", auth, updateListing);
router.delete("/:id", auth, deleteListing);

module.exports = router;