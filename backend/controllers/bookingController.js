const Booking = require("../models/Booking");

exports.createBooking = async (req, res) => {
  const booking = await Booking.create({
    ...req.body,
    user: req.user.id
  });

  res.status(201).json(booking);
};
