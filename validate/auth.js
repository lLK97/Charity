const { check } = require("express-validator");
const login = [
  check("username", "Not Empty").notEmpty(),
  check("password", "Not Empty").notEmpty(),
];

let validate = {
  login: login,
};
module.exports = { validate };
