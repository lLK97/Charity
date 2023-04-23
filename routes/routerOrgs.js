const routerOrgs = require("express").Router();
const validate = require("../validate/orgs");

const orgsController = require("../controller/orgs");

routerOrgs.get("/orgs", orgsController.orgs);
routerOrgs.get("/listOrgs", orgsController.listOrgs);
routerOrgs.post("/orgs", validate.validate.org, orgsController.insertOrgs);
routerOrgs.put("/orgs", validate.validate.org, orgsController.updateOrgs);
routerOrgs.patch("/orgs", orgsController.updateOrgs);
routerOrgs.delete(
  "/orgs",
  validate.validate.checkId,
  orgsController.deleteOrgs
);

module.exports = routerOrgs;
