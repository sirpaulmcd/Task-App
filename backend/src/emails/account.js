const sgMail = require("@sendgrid/mail");

const { generateJWT } = require("../utils/tokens");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendVerificationEmail = async (user) => {
  const emailToken = generateJWT(
    { _id: user._id },
    process.env.EMAIL_TOKEN_SECRET,
    "1 day"
  );
  const url = `http://localhost:8000/verification/${emailToken}`;
  sgMail.send({
    to: "sirpaulmcd@tutanota.com",
    from: "sirpaulmcd@tutanota.com",
    subject: "Verify Your Email",
    html: `Please click <a href="${url}">here</a> to verify your email.`,
  });
};

module.exports = {
  sendVerificationEmail,
};
