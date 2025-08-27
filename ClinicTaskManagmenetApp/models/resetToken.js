// models/resetToken.js
const mongoose = require("mongoose");

const resetTokenSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User", // refers to the User collection
  },
  token: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
    expires: 3600, // token expires after 1 hour (3600 seconds)
  },
});


module.exports = mongoose.model("ResetToken", resetTokenSchema);
