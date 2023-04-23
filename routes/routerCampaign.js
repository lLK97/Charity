const routerCampaigns = require("express").Router();
const validateCampaign = require("../validate/campaign");

const campaignController = require("../controller/campaign");

routerCampaigns.get("/campaigns", campaignController.campaigns);
routerCampaigns.post(
  "/campaigns",
  validateCampaign.validate.campaign,
  campaignController.insertCampaigns
);
routerCampaigns.delete(
  "/campaigns",
  validateCampaign.validate.chechId,
  campaignController.deleteCampaigns
);
routerCampaigns.put(
  "/campaigns",
  validateCampaign.validate.campaign,
  campaignController.updateCampaigns
);
routerCampaigns.patch("/campaigns", campaignController.updateCampaigns);
routerCampaigns.get(
  "/campaigns/SelectCampaign",
  campaignController.selectCampaign
);
module.exports = routerCampaigns;
