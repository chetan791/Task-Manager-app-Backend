const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    status: { type: Boolean, default: false },
    priority: { type: String, enum: ["High", "Medium", "Low"], required: true },
    date: { type: Date, default: Date.now },
    userID: { type: String, required: true },
  },
  {
    versionKey: false,
  }
);

const taskModal = mongoose.model("task", taskSchema);

module.exports = taskModal;
