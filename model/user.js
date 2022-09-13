const mongoose = require("mongoose");
const Task = require("./task");

const UserSchema = mongoose.Schema({
  first_name: String,
  last_name: String,
  email: { type: String, unique: true },
  password: String,
  token: String,
  tasks: [Task.schema]
});

module.exports = mongoose.model("User", UserSchema);
