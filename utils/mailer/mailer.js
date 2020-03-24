require("dotenv").config();
const nodemailer = require("nodemailer");

setup = () => {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.NODEMAILER_USER,
      pass: process.env.NODEMAILER_PASS
    }
  });
};

sendConfirmationEmail = async user => {
  const transport = setup();
  const email = {
    from: "MERN Boiler Plate | KL",
    to: user.email,
    subject: "Welcome to MERN Boiler Plate | KL",
    text: `
      Welcome to MERN Boiler Plate | KL. Please, confirm your email.
      ${`${process.env.NODEMAILER_HOST}/confirmation/${user.confirmationJWT}`}
      `
  };

  return new Promise((resolve, reject) => {
    transport.sendMail(email, (err, data) => {
      if (err) {
        console.error("Mail not sent", err);
        resolve(false);
      } else {
        console.log(`Email sent to ${user.email}`);
        resolve(true);
      }
    });
  });
};

sendResetPasswordLink = user => {
  const transport = setup();

  const email = {
    from: "MERN Boiler Plate | KL",
    to: user.email,
    subject: "Reset Password",
    text: `
    To reset your password follow this link
    ${`${process.env.NODEMAILER_HOST}/reset-pass/${user.resetJWT}`}
    `
  };

  return new Promise((resolve, reject) => {
    transport.sendMail(email, (err, data) => {
      if (err) {
        console.error("Mail not sent", err);
        resolve(false);
      } else {
        console.log(`Email sent to ${user.email}`);
        resolve(true);
      }
    });
  });
};

module.exports = { sendConfirmationEmail, sendResetPasswordLink };
