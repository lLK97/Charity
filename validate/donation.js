const { check, query, oneOf } = require("express-validator");
const arrayDonation = [
  check("campaignId").isFloat(),
  check("donorId").isFloat(),
  check("amount").isFloat(),
];
const Add = oneOf(
  [...arrayDonation, check("userId").isFloat()],
  [...arrayDonation]
);

const checkRoleUser = oneOf(
  [query("isUser").equals(1)],
  [query("isUser").equals(0)]
);

const update = [
  check("campaignId").isFloat(),
  check("donorId").isFloat(),
  check("firstName").notEmpty(),
  check("middleName").notEmpty(),
  check("lastName").notEmpty(),
  check("email").notEmpty(),
  check("phone").notEmpty(),
  check("address").notEmpty(),
  check("notes").notEmpty(),
  check("amount").isFloat(),
];

const checkId = [query("id").isFloat()];

let validateEachElement = {
  campaignId: check("campaignId").isFloat(),
  donorId: check("donorId").isFloat(),
  firstName: check("firstName").notEmpty(),
  middleName: check("middleName").notEmpty(),
  lastName: check("lastName").notEmpty(),
  email: check("email").notEmpty(),
  phone: check("phone").notEmpty(),
  address: check("address").notEmpty(),
  notes: check("notes").notEmpty(),
  amount: check("amount").isFloat(),
};

let validate = {
  Add: Add,
  checkId: checkId,
  update: update,
};

module.exports = { validate, validateEachElement };
