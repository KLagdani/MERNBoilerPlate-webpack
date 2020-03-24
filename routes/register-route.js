require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user-model");
const express = require("express");
const router = express.Router();
const {
  userValidationRules,
  validateUser,
  resetValidationRules,
  forgotValidationRules,
  validateParams
} = require("../validators/user-validator");
const {
  sendConfirmationEmail,
  sendResetPasswordLink
} = require("../utils/mailer/mailer");

// @route   POST api/register/test
// @desc    Testing route
// @access  Public
router.get("/test", (req, res) => {
  res.send({ msg: "working" });
});

// @route   POST api/register/local
// @desc    Creating a new user locally
// @access  Public
router.post("/local", userValidationRules(), validateUser, async (req, res) => {
  const { username, email, password } = req.body;

  const confirmationJWT = jwt.sign(
    { username, email, confirmed: false },
    process.env.JWT_SECRET
  );

  const newUser = new User({
    username,
    email,
    password,
    confirmationJWT
  });

  const resMSG = {};

  try {
    bcrypt.hash(newUser.password, 10, async (err, hash) => {
      if (err) throw err;
      newUser.password = hash;
      user = await newUser.save();

      resMSG.user = user;

      const emailSent = await sendConfirmationEmail(newUser);
      resMSG.emailSent = emailSent;

      return res.send(resMSG);
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

router.post("/new-confirmation", async (req, res) => {
  const { email } = req.body;
  let user = await User.findOne({ email });

  if (!user) {
    const errorObj = {};
    errorObj.email = "No user found with that email";
    return res.status(400).send({ errors: errorObj });
  }

  if (user.confirmed) {
    const errorObj = {};
    errorObj.email = "Email already confirmed";
    return res.status(400).send({ errors: errorObj });
  }

  const confirmationJWT = jwt.sign(
    { username: user.username, email: user.email, confirmed: false },
    process.env.JWT_SECRET
  );

  user = await User.findOneAndUpdate(
    { _id: user._id },
    { confirmationJWT },
    { new: true }
  );

  const resMSG = {};
  resMSG.user = user;
  const emailSent = await sendConfirmationEmail(user);
  resMSG.emailSent = emailSent;

  return res.send(resMSG);
});

// @route   POST api/register/confirmation
// @desc    Confirm newly created user
// @access  Public
router.post("/confirmation", async (req, res) => {
  const token = req.body.token;
  try {
    user = await User.findOneAndUpdate(
      { confirmationJWT: token },
      { confirmationJWT: "", confirmed: true },
      { new: true }
    );
    if (user) {
      return res.json({ confirmation: "Success" });
    }
    const errorObj = {};
    errorObj.confirmation = "Token is invalid";
    return res.status(400).send({ errors: errorObj });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   POST api/register/isconfirmed
// @desc    Check if user email is confirmed
// @access  Public
router.post("/isconfirmed", async (req, res) => {
  const email = req.body.email;
  try {
    user = await User.findOne({ email });
    if (user) {
      return res.json({ isConfirmed: user.confirmed });
    }
    const errorObj = {};
    errorObj.email = "Email not found";
    return res.status(400).send({ errors: errorObj });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   POST api/register/forgot
// @desc    Send forgotten password mail
// @access  Public
router.post(
  "/forgot",
  forgotValidationRules(),
  validateParams,
  async (req, res) => {
    let user = await User.findOne({ email: req.body.email });

    if (!user) {
      const errorObj = {};
      errorObj.email = "No user found with that email";
      return res.status(400).send({ errors: errorObj });
    }

    const resetJWT = jwt.sign(
      {
        id: user._id,
        email: user.email
      },
      process.env.JWT_SECRET
    );

    try {
      user = await User.findOneAndUpdate(
        { _id: user._id },
        { resetJWT },
        { new: true }
      );

      if (!user) {
        const errorObj = {};
        errorObj.forgot = "Something went wrong";
        return res.status(400).send({ errors: errorObj });
      }

      const resMSG = {};
      resMSG.user = user;
      const emailSent = await sendResetPasswordLink(user);
      resMSG.emailSent = emailSent;

      return res.send(resMSG);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// @route   POST api/register/init-reset
// @desc    Checks if token is valid for reset
// @access  Public
router.post("/init-reset", async (req, res) => {
  const token = req.body.token;
  const user = await User.findOne({ resetJWT: token });

  if (!user) {
    const errorObj = {};
    errorObj.token = "Invalid or expired token";
    return res.status(400).send({ errors: errorObj });
  }

  return res.json({ token: true, email: user.email });
});

// @route   POST api/register/reset
// @desc    Reset Forgotten Password
// @access  Public
router.post(
  "/reset",
  resetValidationRules(),
  validateParams,
  async (req, res) => {
    const { email, password, password2, token } = req.body;
    try {
      let user = await User.findOne({ resetJWT: token });

      if (!user) {
        const errorObj = {};
        errorObj.token = "Invalid or expired token";
        return res.status(400).send({ errors: errorObj });
      }

      if (password !== password2) {
        const errorObj = {};
        errorObj.password2 = "Passwords must match";
        return res.status(400).send({ errors: errorObj });
      }

      if (email !== user.email) {
        const errorObj = {};
        errorObj.email = "You cannot reset password for this email";
        return res.status(400).send({ errors: errorObj });
      }

      bcrypt.hash(password, 10, async (err, hash) => {
        if (err) throw err;

        user = await User.findOneAndUpdate(
          { email },
          { password: hash, resetJWT: "" },
          { new: true }
        );

        if (user) {
          return res.send({ user });
        }
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

module.exports = router;
