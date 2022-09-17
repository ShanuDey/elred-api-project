const mongoose = require("mongoose");

const TaskSchema = mongoose.Schema({
  date: {
    type: Date,
    required: [true, "date is required !!"],
  },
  task: {
    type: String,
    required: [true, "task is required !!"],
  },
  status: {
    type: String,
    required: [true, "status is required !!"],
    validate: {
      validator: (value) => /^(Completed|Incomplete)$/.test(value),
      message: "status can only be Completed or Incomplete",
    },
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
