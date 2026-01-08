const express = require("express");
const auth = require("../middelware/authMiddleware");

const {
  createListing,
  getAllListings,
  getListingsByLocation
} = require("../controllers/listController");

const router = express.Router();

router.post("/", auth, createListing);
router.get("/", getAllListings);
router.get("/",getListingsByLocation);
module.exports = router;
