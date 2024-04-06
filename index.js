const express = require("express");
const app = express();
const cors = require("cors");
const connection = require("./DB");
const userRoutes = require("./Routes/userRoutes");
const taskRoutes = require("./Routes/taskRoutes");
const draggableTaskRoutes = require("./Routes/draggableTaskRoutes");
require("dotenv").config();

app.use(express.json());
app.use(cors());

// importing routes
app.use("/user", userRoutes);

app.use("/task", taskRoutes);

app.use("/draggabletask", draggableTaskRoutes);

// listening to all requests
app.listen(process.env.port, async () => {
  try {
    console.log("trying to connect to db");
    await connection;
    console.log("connected to db");
  } catch (error) {
    console.log(error);
  }
});
