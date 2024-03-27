const express = require("express");
const userModal = require("../model/userModel");
const userRoutes = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

userRoutes.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const verify = await userModal.findOne({ email });
    if (verify) {
      return res.status(401).send({ msg: "user already exists please login" });
    } else {
      bcrypt.hash(password, 5, async (err, hash) => {
        if (err) {
          res.status(500).json({ message: err.message });
        } else {
          const newUser = userModal({
            name,
            email,
            password: hash,
          });
          await newUser.save();
          res.send({ msg: "user created successfully" });
        }
      });
    }
  } catch (error) {
    res.status(500).send({ msg: "internal server error" });
  }
});

userRoutes.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await userModal.findOne({ email });
    if (user) {
      bcrypt.compare(password, user.password, (err, result) => {
        if (result) {
          const token = jwt.sign({ userID: user._id }, process.env.secretkey, {
            expiresIn: "30d",
          });
          res.send({ msg: "login successfull", token: token, name: user.name });
        } else {
          res.send({ msg: "wrong credentials" });
        }
      });
    } else {
    }
  } catch (error) {
    res.status(500).send({ msg: "internal server error" });
  }
});

module.exports = userRoutes;
