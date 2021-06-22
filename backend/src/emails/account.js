const sgMail = require("@sendgrid/mail");

const { generateJWT } = require("../utils/tokens");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendVerificationEmail = async (user) => {
  const verifyEmailToken = generateJWT(
    { _id: user._id },
    process.env.VERIFY_EMAIL_TOKEN_SECRET,
    "1 day"
  );
  const url = `${process.env.BACKEND_URI}/verification/${verifyEmailToken}`;
  sgMail.send({
    to: user.email,
    from: "sirpaulmcd@tutanota.com",
    subject: "Verify Your Email",
    html: `Please click <a href="${url}">here</a> to verify your email.`,
  });
};

const sendForgotPasswordEmail = async (user) => {
  const forgotPasswordToken = generateJWT(
    { _id: user._id },
    process.env.FORGOT_PASSWORD_TOKEN_SECRET,
    "15 minutes"
  );
  const url = `${process.env.BACKEND_URI}/verification/${forgotPasswordToken}`;
  sgMail.send({
    to: user.email,
    from: "sirpaulmcd@tutanota.com",
    subject: "Password Reset",
    html: `Please click <a href="${url}">here</a> to reset your password.`,
  });
};

module.exports = {
  sendVerificationEmail,
  sendForgotPasswordEmail,
};
