require("dotenv").config();
const passport = require("passport");
const LocalStrategy = require("passport-local");
const bcrypt = require("bcrypt");
const User = require("../models/user-model");

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then(user => {
    done(null, user);
  });
});

passport.use(
  new LocalStrategy(
    { usernameField: "email" },
    async (email, password, done) => {
      try {
        const user = await User.findOne({ email });
        if (!user) {
          const errorObj = {};
          errorObj.email = "There is no user with that email";
          return done(null, false, { errors: errorObj });
        }

        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) throw err;
          if (isMatch) {
            return done(null, user);
          } else {
            const errorObj = {};
            errorObj.password = "Wrong password";
            return done(null, false, { errors: errorObj });
          }
        });
      } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
      }
    }
  )
);
