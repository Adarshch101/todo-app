const mongoose = require("mongoose");

const todoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: false
  },
  dueDate:{
    type: Date,
    required: false
  },
  completed: {
    type: Boolean,
    default: false
  },
  category:{
    type: String,
    required: false
  },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
});

const Todo = mongoose.model("Todo", todoSchema);

module.exports = Todo;