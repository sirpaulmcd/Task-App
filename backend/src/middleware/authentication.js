const jwt = require("jsonwebtoken");

const User = require("../models/user");

const auth = async (req, res, next) => {
  try {
    const accessToken = req.header("Authorization").replace("Bearer ", "");
    const payload = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findOne({
      _id: payload._id,
    });
    if (!user) {
      throw new Error();
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(401).send({ error: "Not authenticated." });
  }
};

module.exports = auth;
