const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
  first_name: String,
  last_name: String,
  email: { type: String, unique: true },
  password: String,
  token: String,
});

module.exports = mongoose.model("User", UserSchema);
