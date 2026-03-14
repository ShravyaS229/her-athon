const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema({
  title: String,
  description: String,
  latitude: Number,
  longitude: Number,
  status: {
    type: String,
    default: "pending"
  }
});

module.exports = mongoose.model("Request", requestSchema);