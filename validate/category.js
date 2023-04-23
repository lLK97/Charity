const { check, query } = require("express-validator");

const category = [
  check("title", "Not Empty").isEmpty(),
  check("des", "Not Empty").isEmpty(),
];

const checkId = [query("id", "Must be Number").isFloat()];

const validateEachElement = {
  title: check("title", "Not Empty").notEmpty(),
  des: check("des", "Not Empty").notEmpty(),
};

const validate = {
  category: category,
  checkId: checkId,
};

module.exports = { validate };
