const User = require("../../models/user-model");
var { deleteMeUser, alreadyExistUser } = require("./root.mytest");

let chai = require("chai");
let chaiHttp = require("chai-http");
let should = chai.should();
var expect = chai.expect;
chai.use(chaiHttp);

var { app } = require("../../server");

var alreadyExistUserConfJWT = "";
var alreadyExistUserResetJWT = "";

describe("api/register", () => {
  before(done => {
    chai
      .request(app)
      .post("/api/register/local")
      .send(alreadyExistUser)
      .end((err, res) => {
        res.should.have.status(200);
        expect(res.body.user)
          .to.be.an("object")
          .that.has.all.keys(
            "confirmed",
            "_id",
            "username",
            "email",
            "password",
            "confirmationJWT",
            "__v"
          );
        expect(res.body.user.confirmed).to.equal(false);
        expect(res.body.emailSent).to.equal(true);
        User.findOne({ email: res.body.user.email })
          .then(dbUser => {
            expect(dbUser.confirmationJWT).to.equal(
              res.body.user.confirmationJWT
            );
            expect(dbUser.confirmed).to.equal(false);
            done();
          })
          .catch(done);
      });
  });
  after(async () => {
    await User.deleteOne({ email: alreadyExistUser.email }, err => {
      if (err) console.log("alreadyExistUser user not found");
    });
  });
  describe("#get/api/register/test", () => {
    it("should return working", done => {
      chai
        .request(app)
        .get("/api/register/test")
        .end((err, res) => {
          res.should.have.status(200);
          res.body.msg.should.equal("working");
          done();
        });
    });
  });

  describe("#post/api/register/local", () => {
    it("should return empty fields errors", done => {
      const expectedRes = {
        username: "Please enter a username",
        email: "Please enter a valid email",
        password: "Please enter your password with minimum 5 characters",
        password2: "Please confirm your password"
      };
      chai
        .request(app)
        .post("/api/register/local")
        .send({})
        .end((err, res) => {
          res.should.have.status(422);
          expect(res.body.errors).to.deep.equal(expectedRes);
          done();
        });
    });

    it("should create user", done => {
      chai
        .request(app)
        .post("/api/register/local")
        .send(deleteMeUser)
        .end((err, res) => {
          res.should.have.status(200);
          expect(res.body.user)
            .to.be.an("object")
            .that.has.all.keys(
              "confirmed",
              "_id",
              "username",
              "email",
              "password",
              "confirmationJWT",
              "__v"
            );
          expect(res.body.user.confirmed).to.equal(false);
          expect(res.body.emailSent).to.equal(true);
          User.findOne({ email: res.body.user.email })
            .then(dbUser => {
              expect(dbUser.confirmationJWT).to.equal(
                res.body.user.confirmationJWT
              );
              expect(dbUser.confirmed).to.equal(false);
              done();
            })
            .catch(done);
        });
    });

    it("should return already exists error", done => {
      const expectedErr = {
        email: "Email already exists"
      };

      chai
        .request(app)
        .post("/api/register/local")
        .send(alreadyExistUser)
        .end((err, res) => {
          res.should.have.status(422);
          expect(res.body.errors).to.deep.equal(expectedErr);
          done();
        });
    });
  });

  describe("#post/api/register/confirmation", () => {
    it("should return user not confirmed", done => {
      chai
        .request(app)
        .post("/api/register/isconfirmed")
        .send({ email: alreadyExistUser.email })
        .end((err, res) => {
          res.should.have.status(200);
          expect(res.body.isConfirmed).to.equal(false);
          done();
        });
    });

    it("should send new confirmation mail to user", done => {
      chai
        .request(app)
        .post("/api/register/new-confirmation")
        .send({ email: alreadyExistUser.email })
        .end((err, res) => {
          res.should.have.status(200);
          expect(res.body.user)
            .to.be.an("object")
            .that.has.all.keys(
              "confirmed",
              "_id",
              "username",
              "email",
              "password",
              "confirmationJWT",
              "__v"
            );
          expect(res.body.user.confirmed).to.equal(false);
          expect(res.body.emailSent).to.equal(true);
          done();
        });
    });

    it("should confirm user", done => {
      User.findOne({ email: alreadyExistUser.email }).then(user => {
        alreadyExistUserConfJWT = user.confirmationJWT;
        chai
          .request(app)
          .post("/api/register/confirmation")
          .send({ token: alreadyExistUserConfJWT })
          .end((err, res) => {
            res.should.have.status(200);
            expect(res.body.confirmation).to.equal("Success");
            User.findOne({ email: user.email }).then(dbUser => {
              expect(dbUser.confirmationJWT).to.equal("");
              expect(dbUser.confirmed).to.equal(true);
              done();
            });
          });
      });
    });

    it("should return error token invalid", done => {
      chai
        .request(app)
        .post("/api/register/confirmation")
        .send({ token: alreadyExistUserConfJWT })
        .end((err, res) => {
          res.should.have.status(400);
          expect(res.body.errors.confirmation).to.equal("Token is invalid");
          done();
        });
    });
  });

  describe("#post/api/register/isconfirmed", () => {
    it("should return user confirmed", done => {
      chai
        .request(app)
        .post("/api/register/isconfirmed")
        .send({ email: alreadyExistUser.email })
        .end((err, res) => {
          res.should.have.status(200);
          expect(res.body.isConfirmed).to.equal(true);
          done();
        });
    });

    it("should return error no email found for isconfirmed", done => {
      chai
        .request(app)
        .post("/api/register/isconfirmed")
        .send({ email: "invalidEmail@gmail.com" })
        .end((err, res) => {
          res.should.have.status(400);
          expect(res.body.errors.email).to.equal("Email not found");
          done();
        });
    });
  });

  describe("#post/api/register/new-confirmation", () => {
    it("should return user already confirmed", done => {
      chai
        .request(app)
        .post("/api/register/new-confirmation")
        .send({ email: alreadyExistUser.email })
        .end((err, res) => {
          res.should.have.status(400);
          expect(res.body.errors.email).to.equal("Email already confirmed");
          done();
        });
    });

    it("should return no email found for new confirmation mail", done => {
      chai
        .request(app)
        .post("/api/register/new-confirmation")
        .send({ email: "invalid@mail.com" })
        .end((err, res) => {
          res.should.have.status(400);
          expect(res.body.errors.email).to.equal(
            "No user found with that email"
          );
          done();
        });
    });
  });

  describe("#post/api/register/forgot", () => {
    it("should send forgot email", done => {
      chai
        .request(app)
        .post("/api/register/forgot")
        .send({ email: alreadyExistUser.email })
        .end((err, res) => {
          res.should.have.status(200);
          expect(res.body.user)
            .to.be.an("object")
            .that.has.all.keys(
              "confirmed",
              "_id",
              "username",
              "email",
              "password",
              "confirmationJWT",
              "resetJWT",
              "__v"
            );
          expect(res.body.user.resetJWT).to.not.equal("");
          expect(res.body.emailSent).to.equal(true);
          alreadyExistUserResetJWT = res.body.user.resetJWT;
          done();
        });
    });

    it("should return error email not valid", done => {
      chai
        .request(app)
        .post("/api/register/forgot")
        .send({ email: "notValidEmail" })
        .end((err, res) => {
          res.should.have.status(422);
          expect(res.body.errors.email).to.equal("Please enter a valid email");
          done();
        });
    });

    it("should return error no user found", done => {
      chai
        .request(app)
        .post("/api/register/forgot")
        .send({ email: "notValidUser@mail.com" })
        .end((err, res) => {
          res.should.have.status(400);
          expect(res.body.errors.email).to.equal(
            "No user found with that email"
          );
          done();
        });
    });
  });

  describe("#post/api/register/init-reset", () => {
    it("should validate token", done => {
      chai
        .request(app)
        .post("/api/register/init-reset")
        .send({ token: alreadyExistUserResetJWT })
        .end((err, res) => {
          res.should.have.status(200);
          expect(res.body.token).to.equal(true);
          expect(res.body.email).to.be.a("string");
          done();
        });
    });

    it("should return invalid token", done => {
      chai
        .request(app)
        .post("/api/register/init-reset")
        .send({ token: "invalidToken" })
        .end((err, res) => {
          res.should.have.status(400);
          expect(res.body.errors.token).to.equal("Invalid or expired token");
          done();
        });
    });
  });

  describe("#post/api/register/reset", () => {
    it("should return errors", done => {
      const expectedErr = {
        errors: {
          email: "Please enter a valid email",
          password: "Please enter your password with minimum 5 characters",
          password2: "Please confirm your password"
        }
      };
      chai
        .request(app)
        .post("/api/register/reset")
        .send({})
        .end((err, res) => {
          res.should.have.status(422);
          expect(res.body).to.deep.equal(expectedErr);
          done();
        });
    });

    it("should return invalid token", done => {
      const user = {
        email: alreadyExistUser.email,
        password: "password2",
        password2: "password2",
        token: "invalid token"
      };
      chai
        .request(app)
        .post("/api/register/reset")
        .send(user)
        .end((err, res) => {
          res.should.have.status(400);
          expect(res.body.errors.token).to.equal("Invalid or expired token");
          done();
        });
    });

    it("should return cannot reset this email", done => {
      const user = {
        email: "another@mail.com",
        password: "password2",
        password2: "password2",
        token: alreadyExistUserResetJWT
      };
      chai
        .request(app)
        .post("/api/register/reset")
        .send(user)
        .end((err, res) => {
          res.should.have.status(400);
          expect(res.body.errors.email).to.equal(
            "You cannot reset password for this email"
          );
          done();
        });
    });

    it("should reset password", done => {
      const user = {
        email: alreadyExistUser.email,
        password: "password2",
        password2: "password2",
        token: alreadyExistUserResetJWT
      };
      chai
        .request(app)
        .post("/api/register/reset")
        .send(user)
        .end((err, res) => {
          res.should.have.status(200);
          expect(res.body.user)
            .to.be.an("object")
            .that.has.all.keys(
              "confirmed",
              "_id",
              "username",
              "email",
              "password",
              "confirmationJWT",
              "resetJWT",
              "__v"
            );
          expect(res.body.user.resetJWT).to.equal("");
          done();
        });
    });

    it("should return invalid token as already set", done => {
      const user = {
        email: alreadyExistUser.email,
        password: "password2",
        password2: "password2",
        token: alreadyExistUserResetJWT
      };
      chai
        .request(app)
        .post("/api/register/reset")
        .send(user)
        .end((err, res) => {
          res.should.have.status(400);
          expect(res.body.errors.token).to.equal("Invalid or expired token");
          done();
        });
    });
  });
});
