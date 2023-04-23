const users = require("../config/sequelize").users;
const jwt = require("jsonwebtoken");

exports.checkUser = async (req, res, next) => {
  let user = await users.findOne({
    where: {
      username: req.query.username,
    },
  });
  if (user?.dataValues == null) {
    await res.status(401).send({
      success: false,
      msg: "Authentication failed. User not found.",
    });
  } else {
    next();
  }
};

exports.checkTokenCsrf = async (req, res, next) => {
  let user = await users.findOne({
    where: {
      username: req.query.username,
    },
  });

  if (user?.dataValues?.csrfToken == req.cookies["csrfToken"]) {
    next();
  } else {
    const cookies = Object.keys(req.cookies);
    cookies.forEach((cookie) => {
      res.clearCookie(cookie);
    });
    return res.status(401).json({ success: false, msg: "Csrf Not Correct" });
  }
};
