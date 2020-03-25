require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");
const passport = require("passport");
const passportSetup = require("./config/passport-setup");

const register = require("./routes/register-route");
const auth = require("./routes/auth-route");

//ENV
const port = process.env.PORT || 5000;

//Express
const app = express();
app.use(bodyParser.json());

//Passport setup
app.use(passport.initialize());
app.use(passport.session());

//DB
var db = process.env.MongoURI;
if (process.env.NODE_ENV === "production") {
  console.log("Running in prod");
  db = db.concat("prod");
} else if (process.env.NODE_ENV === "test") {
  console.log("Running in test");
  db = db.concat("test");
} else {
  console.log("Running in dev");
  db = db.concat("dev");
}

mongoose
  .connect(db, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true
  })
  .then(() => console.log("MongoDB connected..."))
  .catch(err => console.log(err));

//Routes
app.use("/api/register", register);
app.use("/api/auth", auth);

//Static folder set
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "client/public")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "public", "index.html"));
  });
}

app.listen(port, () => console.log(`Server started on port ${port}`));

module.exports = { app };
