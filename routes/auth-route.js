require("dotenv").config();
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const passport = require("passport");
const {
  authValidationRules,
  validateParams
} = require("../validators/user-validator");
const auth = require("../middleware/auth");
const User = require("../models/user-model");

// @route   POST api/auth/test
// @desc    Testing route
// @access  Public
router.get("/test", (req, res) => {
  return res.send({ msg: "working" });
});

// @route   POST api/auth/test-private
// @desc    Testing route
// @access  Private
router.get("/test-private", auth, async (req, res) => {
  const user = await User.findById(req.id);
  return res.send({ msg: "you're in private", user });
});

// @route   POST api/auth/local
// @desc    Authenticate using local Strategy
// @access  Public
router.post(
  "/local",
  authValidationRules(),
  validateParams,
  (req, res, next) => {
    passport.authenticate("local", { session: false }, (err, user, info) => {
      if (err || !user) {
        return res.status(400).json(info);
      }

      req.login(user, { session: false }, err => {
        if (err) {
          res.send(err);
        }

        const payload = {
          id: user._id,
          username: user.username,
          email: user.email
        };

        try {
          jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: 360000 },
            (err, token) => {
              if (err) throw err;
              return res.json({
                success: true,
                token: "Bearer " + token
              });
            }
          );
        } catch (err) {
          console.log(err.message);
          return res.status(500).json("Server error");
        }
      });
    })(req, res);
  }
);

// @route   POST api/auth/logout
// @desc    Logout User
// @access  Private
router.get("/logout", auth, (req, res) => {
  req.logout();
  return res.redirect("/");
});

module.exports = router;
