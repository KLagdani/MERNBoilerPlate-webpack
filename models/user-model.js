const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: String,
  googleId: {
    type: String,
    required: false
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  thumbnail: String,
  password: {
    type: String,
    required: false
  },
  confirmed: {
    type: Boolean,
    required: true,
    default: false
  },
  confirmationJWT: {
    type: String
  },
  resetJWT: {
    type: String
  }
});

const User = mongoose.model("user", userSchema);

module.exports = User;
