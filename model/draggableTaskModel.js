const mongoose = require("mongoose");

const draggableTaskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    status: {
      type: String,
      enum: ["Task", "InProgress", "Done", "Rework"],
      default: "Task",
      required: true,
    },
    date: { type: Date, default: Date.now },
    userID: { type: String, required: true },
  },
  {
    versionKey: false,
  }
);

const draggableTaskModal = mongoose.model("draggableTask", draggableTaskSchema);

module.exports = draggableTaskModal;
