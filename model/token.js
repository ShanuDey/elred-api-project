const mongoose = require("mongoose");

const TokenSchema = mongoose.Schema({
  createdAt: { type: Date, expires: "30s", default: Date.now() },
  token: String,
});

module.exports = mongoose.model("Token", TokenSchema);
