const User = require("../../models/user-model");
var sinon = require("sinon");
var { deleteMeUser, alreadyExistUser, testUser } = require("./root.mytest");

let chai = require("chai");
let chaiHttp = require("chai-http");
let chaiMatch = require("chai-match");
let should = chai.should();
var expect = chai.expect;
chai.use(chaiHttp);
chai.use(chaiMatch);

var { app } = require("../../server");

var testUserAuthToken = "";

describe("api/auth", () => {
  before(done => {
    chai
      .request(app)
      .post("/api/register/local")
      .send(testUser)
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
    await User.deleteOne({ email: testUser.email }, err => {
      if (err) console.log("testUser user not found");
    });
  });

  describe("#get/api/auth/test", () => {
    it("should return working", done => {
      chai
        .request(app)
        .get("/api/auth/test")
        .end((err, res) => {
          res.should.have.status(200);
          res.body.msg.should.equal("working");
          done();
        });
    });
  });

  describe("#get/api/auth/local", () => {
    it("should return errors", done => {
      const expectedErr = {
        errors: {
          email: "Please enter a valid email",
          password: "Please enter your password with minimum 5 characters"
        }
      };
      chai
        .request(app)
        .post("/api/auth/local")
        .send({})
        .end((err, res) => {
          res.should.have.status(422);
          expect(res.body).to.deep.equal(expectedErr);
          done();
        });
    });

    it("should return no user with that email", done => {
      const expectedErr = {
        errors: {
          email: "There is no user with that email"
        }
      };
      chai
        .request(app)
        .post("/api/auth/local")
        .send({
          email: "invalidMail@mail.com",
          password: testUser.password
        })
        .end((err, res) => {
          res.should.have.status(400);
          expect(res.body).to.deep.equal(expectedErr);
          done();
        });
    });

    it("should return invalid pass", done => {
      const expectedErr = {
        errors: {
          password: "Wrong password"
        }
      };
      chai
        .request(app)
        .post("/api/auth/local")
        .send({
          email: testUser.email,
          password: "invalidPass"
        })
        .end((err, res) => {
          res.should.have.status(400);
          expect(res.body).to.deep.equal(expectedErr);
          done();
        });
    });

    it("should authenticate user", done => {
      chai
        .request(app)
        .post("/api/auth/local")
        .send({
          email: testUser.email,
          password: testUser.password
        })
        .end((err, res) => {
          res.should.have.status(200);
          expect(res.body.success).to.equal(true);
          expect(res.body.token).to.match(/Bearer (\w+)/);
          testUserAuthToken = res.body.token.split(" ")[1];
          done();
        });
    });
  });

  describe("#get/api/auth/test-private", () => {
    it("should let private pass", done => {
      chai
        .request(app)
        .get("/api/auth/test-private")
        .set("x-auth-token", testUserAuthToken)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.msg.should.equal("you're in private");
          done();
        });
    });

    it("should return token is invalid", done => {
      chai
        .request(app)
        .get("/api/auth/test-private")
        .set("x-auth-token", "invalid Token")
        .end((err, res) => {
          res.should.have.status(401);
          res.body.errors.token.should.equal("Token is not valid");
          done();
        });
    });

    it("should return no token error", done => {
      chai
        .request(app)
        .get("/api/auth/test-private")
        .end((err, res) => {
          res.should.have.status(401);
          res.body.errors.token.should.equal("No authorization token");
          done();
        });
    });
  });
});
