const { check, query } = require("express-validator");
const campaign = [
  check("userId", "Must be number").isFloat(),
  check("categoryId", "Must be number").isFloat(),
  check("title", "Not Empty").notEmpty(),
  check("target", "Must be number").isFloat(),
  check("startDate", "Must be date").isISO8601().toDate(),
  check("endDate", "Must be date").isISO8601().toDate(),
];
const checkId = [query("id").isFloat()];

let validate = {
  campaign: campaign,
  chechId: checkId,
};

let validateEachElement = {
  userId: check("userId", "Must be number").isFloat(),
  categoryId: check("categoryId", "Must be number").isFloat(),
  title: check("title", "Not Empty").notEmpty(),
  target: check("target", "Must be number").isFloat(),
  startDate: check("startDate", "Must be date").isISO8601().toDate(),
  endDate: check("endDate", "Must be date").isISO8601().toDate(),
};

module.exports = { validate, validateEachElement };
