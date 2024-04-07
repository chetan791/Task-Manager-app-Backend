const express = require("express");
const auth = require("../middleware/authMiddleware");
const draggableTaskModal = require("../model/draggableTaskModel");
const draggableTaskRoutes = express.Router();
const fs = require("fs");
const PDFDocument = require("pdfkit");

draggableTaskRoutes.use(auth);
// endpoints to get all task of the user
draggableTaskRoutes.get("/", async (req, res) => {
  const { userID } = req.body;
  try {
    const data = await draggableTaskModal.find({ userID });
    res.send(data);
  } catch (error) {
    res.status(500).send({ msg: "internal server error" });
  }
});

// endpoints to create task for the user
draggableTaskRoutes.post("/create", async (req, res) => {
  const { title, description, status, userID } = req.body;
  try {
    const newTask = await draggableTaskModal({
      title,
      description,
      status,
      userID,
    });
    newTask.save();
    res.send({ msg: "task created successfully", data: newTask });
  } catch (error) {
    res.status(500).send({ msg: "internal server error" });
  }
});

// endpoints to update task for the user
draggableTaskRoutes.patch("/update/:taskId", async (req, res) => {
  const { userID } = req.body;
  const { taskId } = req.params;
  try {
    const task = await draggableTaskModal.findOne({ _id: taskId });
    if (task) {
      if (task.userID == userID) {
        let updatedtask = await draggableTaskModal.findByIdAndUpdate(
          { _id: taskId },
          req.body,
          { new: true }
        );
        res.send({ msg: "task updated successfully", data: updatedtask });
      } else {
        res.send({ msg: "you are not authorized to update this task" });
      }
    } else {
      res.send({ msg: "task not found" });
    }
  } catch (error) {
    res.status(500).send({ msg: "internal server error" });
  }
});

// endpoints to delete task for the user
draggableTaskRoutes.delete("/delete/:taskId", async (req, res) => {
  const { taskId } = req.params;
  const { userID } = req.body;
  try {
    const task = await draggableTaskModal.findOne({ _id: taskId });
    if (task) {
      if (task.userID == userID) {
        await draggableTaskModal.findByIdAndDelete({ _id: taskId });
        res.send({ msg: "task deleted successfully", data: task._id });
      } else {
        res.send({ msg: "you are not authorized to delete this task" });
      }
    } else {
      res.send({ msg: "task not found" });
    }
  } catch (error) {
    res.status(500).send({ msg: "internal server error" });
  }
});

// endpoints to download task of the user
// draggableTaskRoutes.get("/download", async (req, res) => {
//   const { userID } = req.body;
//   try {
//     const data = await draggableTaskModal.find({ userID });
//     const pdfDoc = new PDFDocument();
//     pdfDoc.pipe(fs.createWriteStream("task.pdf"));

//     data.forEach((task) => {
//       pdfDoc.fontSize(12).text(`Task ID: ${task._id}`);
//       pdfDoc.fontSize(10).text(`Title: ${task.title}`);
//       pdfDoc.fontSize(10).text(`Description: ${task.description}`);
//       pdfDoc.moveDown();
//     });

//     pdfDoc.end();
//     res.download("task.pdf");
//     fs.unlinkSync("task.pdf");
//   } catch (error) {
//     res.status(500).send({ msg: "Internal server error" });
//   }
// });
draggableTaskRoutes.get("/download", async (req, res) => {
  const { userID } = req.body;
  try {
    const data = await draggableTaskModal.find({ userID });
    const pdfDoc = new PDFDocument();
    pdfDoc.pipe(fs.createWriteStream("task.pdf"));
    pdfDoc.text(JSON.stringify(data));
    pdfDoc.end();
    res.download("task.pdf");
  } catch (error) {
    res.status(500).send({ msg: "internal server error" });
  }
});

module.exports = draggableTaskRoutes;
