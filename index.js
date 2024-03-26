const express = require("express");
const app = express();
const cors = require("cors");
// const userRoutes = require("./Routes/userRoutes");
// const taskRoutes = require("./Routes/taskRoutes");
const connection = require("./DB");
require("dotenv").config();

app.use(express.json());
app.use(cors());

// importing routes
// app.use("/user", userRoutes);

// app.use("/task", taskRoutes);

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
