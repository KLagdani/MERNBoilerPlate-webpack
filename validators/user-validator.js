const { body, validationResult } = require("express-validator");
const User = require("../models/user-model");

const userValidationRules = () => {
  return [
    body("username", "Please enter a username")
      .not()
      .isEmpty(),
    body("email", "Please enter a valid email").isEmail(),
    body(
      "password",
      "Please enter your password with minimum 5 characters"
    ).isLength({ min: 5 }),
    body("password2", "Please confirm your password")
      .not()
      .isEmpty()
  ];
};

const validateUser = (req, res, next) => {
  const errors = validationResult(req);
  if (req.body.password !== req.body.password2) {
    errors.errors.push({
      value: undefined,
      msg: "Passwords must match",
      param: "password2",
      location: "body"
    });
  }
  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      errors.errors.push({
        value: req.body.email,
        msg: "Email already exists",
        param: "email",
        location: "body"
      });
    }

    if (errors.isEmpty()) {
      return next();
    }
    const errorObj = {};
    errors.array().map(err => (errorObj[err.param] = err.msg));

    return res.status(422).json({
      errors: errorObj
    });
  });
};

const resetValidationRules = () => {
  return [
    body("email", "Please enter a valid email").isEmail(),
    body(
      "password",
      "Please enter your password with minimum 5 characters"
    ).isLength({ min: 5 }),
    body("password2", "Please confirm your password")
      .not()
      .isEmpty()
  ];
};

const authValidationRules = () => {
  return [
    body("email", "Please enter a valid email").isEmail(),
    body(
      "password",
      "Please enter your password with minimum 5 characters"
    ).isLength({ min: 5 })
  ];
};

const forgotValidationRules = () => {
  return [body("email", "Please enter a valid email").isEmail()];
};

const validateParams = (req, res, next) => {
  const errors = validationResult(req);

  if (errors.isEmpty()) {
    return next();
  }

  const errorObj = {};
  errors.array().map(err => (errorObj[err.param] = err.msg));

  return res.status(422).json({
    errors: errorObj
  });
};

module.exports = {
  userValidationRules,
  validateUser,
  resetValidationRules,
  authValidationRules,
  forgotValidationRules,
  validateParams
};
