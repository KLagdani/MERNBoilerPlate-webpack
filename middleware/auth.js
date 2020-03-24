require("dotenv").config();
const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  //Get token from header
  const token = req.header("x-auth-token");

  //Check if no token
  if (!token) {
    const errorObj = {};
    errorObj.token = "No authorization token";
    return res.status(401).json({ errors: errorObj });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.id = decoded.id;
    next();
  } catch (err) {
    const errorObj = {};
    errorObj.token = "Token is not valid";
    return res.status(401).json({ errors: errorObj });
  }
};
