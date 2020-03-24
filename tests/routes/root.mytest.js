const User = require("../../models/user-model");
var sinon = require("sinon");

const deleteMeUser = {
  username: "deleteMe",
  email: "deleteMe@gmail.com",
  password: "deleteMe",
  password2: "deleteMe"
};

const alreadyExistUser = {
  username: "alreadyExistUser",
  email: "alreadyExistUser@gmail.com",
  password: "alreadyExistUser",
  password2: "alreadyExistUser"
};

const testUser = {
  username: "testUser",
  email: "testUser@gmail.com",
  password: "testUser",
  password2: "testUser"
};

before(async () => {
  await User.deleteOne({ email: deleteMeUser.email }, err => {
    if (err) console.log("deleteMe user not found");
  });
  sinon.stub(console, "log");
});

after(async () => {
  if (!console.log.restore) sinon.stub(console, "log");
  await User.deleteOne({ email: deleteMeUser.email }, err => {
    if (err) console.log("deleteMe user not found");
  });
});

module.exports = { deleteMeUser, alreadyExistUser, testUser };
