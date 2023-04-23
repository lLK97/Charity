const { check, query } = require("express-validator");

const org = [
  check("userId", "Must be Number"),
  check("title", "Not Empty").notEmpty(),
  check("address", "Not Empty").notEmpty(),
  check("detail", "Not Empty").notEmpty(),
  check("linkWebsite").isURL(),
];

const validateElement = {};

const checkId = [query("id").isFloat()];

const validate = {
  org: org,
  checkId: checkId,
};

module.exports = {
  validate,
};
