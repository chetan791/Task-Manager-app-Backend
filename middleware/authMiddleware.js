const jwt = require("jsonwebtoken");
require("dotenv").config();

const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized please Login" });
  }

  const decoded = jwt.verify(token, process.env.secretkey);
  if (!decoded) {
    return res.status(401).json({ message: "Unauthorized please Login" });
  }

  req.body.userID = decoded.userID;
  next();
};

module.exports = auth;
