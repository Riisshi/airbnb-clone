const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  wishlist: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Listing"
  }],
  isHost: {
    type: Boolean,
    default: false
  },
  profileImage: String,
  phone: String,
  about: String
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);