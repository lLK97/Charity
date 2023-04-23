const { check, query } = require("express-validator");
const inforOrg = {
  id: check("id", "Must be Number").isFloat(),
  title: check("title", "Not Empty").notEmpty(),
  imageData: check("imageData", "Not Empty").notEmpty(),
  address: check("address", "Not Empty").notEmpty(),
  phone: check("phone", "Must be number").isFloat(),
  linkWebsite: check("linkWebsite", "Not Empty").notEmpty(),
};

module.exports = { inforOrg };
