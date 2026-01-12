const express = require("express");
const auth = require("../middleware/authMiddleware");
const {
  getUserProfile,
  updateUserProfile,
  getUserListings
} = require("../controllers/userController");

const router = express.Router();

router.get("/profile", auth, getUserProfile);
router.put("/profile", auth, updateUserProfile);
router.get("/listings", auth, getUserListings);

module.exports = router;