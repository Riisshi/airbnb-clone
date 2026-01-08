const express = require("express");
const auth = require("../middelware/authMiddleware");
const { createBooking } = require("../controllers/bookingController");

const router = express.Router();

router.post("/", auth, createBooking);

module.exports = router;
