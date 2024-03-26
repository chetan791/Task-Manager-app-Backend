const express = require("express");
const taskModal = require("../model/taskModel");
const auth = require("../middleware/authMiddleware");
const taskRoutes = express.Router();

taskRoutes.use(auth);
// endpoints to get all task of the user
taskRoutes.get("/", async (req, res) => {
  const { userID } = req.body;
  try {
    const data = await taskModal.find({ userID });
    res.send(data);
  } catch (error) {
    res.status(500).send({ msg: "internal server error" });
  }
});

// endpoints to create task for the user
taskRoutes.post("/create", async (req, res) => {
  const { title, description, priority, userID } = req.body;
  try {
    const newTask = await taskModal({
      title,
      description,
      priority,
      userID,
    });
    newTask.save();
    res.send({ msg: "task created successfully" });
  } catch (error) {
    res.status(500).send({ msg: "internal server error" });
  }
});

// endpoints to update task for the user
taskRoutes.patch("/update/:taskId", async (req, res) => {
  const { userID } = req.body;
  const { taskId } = req.params;
  try {
    const task = await taskModal.findOne({ _id: taskId });
    if (task) {
      if (task.userID == userID) {
        await taskModal.findByIdAndUpdate({ _id: taskId }, req.body);
        res.send({ msg: "task updated successfully" });
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
taskRoutes.delete("/delete/:taskId", async (req, res) => {
  const { taskId } = req.params;
  const { userID } = req.body;
  try {
    const task = await taskModal.findOne({ _id: taskId });
    if (task) {
      if (task.userID == userID) {
        await taskModal.findByIdAndDelete({ _id: taskId });
        res.send({ msg: "task deleted successfully" });
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

module.exports = taskRoutes;
