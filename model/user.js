const mongoose = require("mongoose");

const TaskSchema = mongoose.Schema({
  date: {
    type: Date,
    required: [true, "date is required !!"],
  },
  task: {
    type: String,
    required: [true, "task string is required !!"],
  },
  completed: {
    type: Boolean,
    required: [true, "completed status is required !!"],
  },
});

const UserSchema = mongoose.Schema({
  first_name: String,
  last_name: String,
  email: { type: String, unique: true },
  password: String,
  token: String,
  verified: { type: Boolean, default: false },
  email_verification_token: String,
  tasks: [TaskSchema],
});

module.exports = mongoose.model("User", UserSchema);
