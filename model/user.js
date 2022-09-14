const mongoose = require("mongoose");

const TaskSchema = mongoose.Schema({
  date: {type:Date, default: Date.now},
  task: String,
  completed: {type:Boolean, default: false}
});

const UserSchema = mongoose.Schema({
  first_name: String,
  last_name: String,
  email: { type: String, unique: true },
  password: String,
  token: String,
  tasks: [TaskSchema]
});

module.exports = mongoose.model("User", UserSchema);
