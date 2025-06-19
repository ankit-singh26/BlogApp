const mongoose = require("mongoose");

const User = mongoose.Schema({
  name: String,
  email: String,
  desciption: String,
  password: String,
  phoneNumber: Number,
  isAdmin: {
    type: Boolean,
    default: false,
  },
  description: {
    type: String,
    default: "",
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("User", User);
