const routerDonation = require("express").Router();
const validateDonation = require("../validate/donation");

const donationController = require("../controller/donation");

routerDonation.get("/donations", donationController.donations);
routerDonation.post(
  "/donations",
  validateDonation.validate.Add,
  donationController.insertDonations
);
routerDonation.put(
  "/donations",
  validateDonation.validate.update,
  donationController.updateDonations
);
routerDonation.patch("/donations", donationController.updateDonations);
routerDonation.delete(
  "/donations",
  validateDonation.validate.checkId,
  donationController.deleteDonations
);

module.exports = routerDonation;
