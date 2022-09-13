const mongoose = require('mongoose');

const taskSchema = mongoose.Schema({
  date: {type:Date, default: Date.now},
  task: String,
  completed: {type:Boolean, default: false}
});

module.exports = mongoose.model('Task', taskSchema);
