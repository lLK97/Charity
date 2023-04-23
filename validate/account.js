const { check, query, oneOf } = require("express-validator");

const account = [
  check("accountItem.*.username", "Not Empty").notEmpty(),
  oneOf(
    [
      check("accountItem.*.roles").equals(1),
      check("accountItem.*.roles").equals(0),
    ],
    "Must be correct Number"
  ),
  check("accountItem.*.password", "Not Empty").notEmpty(),
  check("accountItem.*.orgId", "Must be Number").isFloat(),
  check("accountInforItem.*.firstName").notEmpty(),
  check("accountInforItem.*.middleName").notEmpty(),
  check("accountInforItem.*.lastName").notEmpty(),
  check("accountInforItem.*.email").notEmpty(),
  check("accountInforItem.*.phone").isFloat(),
  check("accountInforItem.*.address").notEmpty(),
  check("accountInforItem.*.bankAccountNumber").isFloat(),
  check("accountInforItem.*.bankName").notEmpty(),
];
const accountRegister = [
  check("accountRegister.username", "Not Empty").notEmpty(),
  check("accountRegister.password", "Not Empty").notEmpty(),
  check("inforRegister.firstName").notEmpty(),
  check("inforRegister.middleName").notEmpty(),
  check("inforRegister.lastName").notEmpty(),
  check("inforRegister.email").notEmpty(),
  check("inforRegister.phone").isFloat(),
  check("inforRegister.address").notEmpty(),
];
const validateEachElement = {};

const checkId = [query("id").isFloat()];

const validate = {
  account: account,
  signup: accountRegister,
  checkId: checkId,
};

module.exports = {
  validate,
};
