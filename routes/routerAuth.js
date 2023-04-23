const routerAuth = require("express").Router();

const authController = require("../controller/auth");

const validate = require("../validate/account");
const passport = require("passport").authenticate("jwt", { session: false });

const moment = require("moment");
const expires = moment().add(1, "week").valueOf();
const middleWare = require("../midleware/midleware");

const csrf = require("csurf");
const csrfProtection = csrf({
  cookie: {
    maxAge: 3600000,
    secure: true,
    httpOnly: true,
    sameSite: "strict",
  },
});

routerAuth.post("/signin", validate.validate.account, authController.signin);
routerAuth.post("/signup", validate.validate.signup, authController.signup);
routerAuth.post("/logout", authController.logout);
routerAuth.get(
  "/csrfToken",
  middleWare.checkUser,
  csrfProtection,
  authController.crfsToken
);
routerAuth.get(
  "/csrfToken/refresh",
  middleWare.checkTokenCsrf,
  csrfProtection,
  authController.refreshCrsfToken
);
routerAuth.get("/auth/protected", authController.protectedAuth);
module.exports = routerAuth;
