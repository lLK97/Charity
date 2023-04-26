const { donors, users, inforusers, cacheTTL } = require("../config/sequelize");

const donations = require("../config/sequelize").donations;
const { Op } = require("sequelize");
const { validationResult } = require("express-validator");
const {
  checkPutData,
  checkPatchData,
  checkError,
  getCacheData,
  setCachedData,
  limitPageAdministration,
} = require("../ultils/ultils");
const validateDonation = require("../validate/donation");

const fetchDataDonation = async (offset, limit) => {
  const result = await donations.findAll({
    attributes: ["id", "campaignId", "amount", "notes"],
    include: [
      {
        model: donors,
        require: true,
        attributes: [
          "id",
          "isUser",
          "firstName",
          "middleName",
          "lastName",
          "phone",
          "email",
          "address",
        ],
        include: [
          {
            model: users,
            require: true,
            attributes: ["id"],
            include: [
              {
                model: inforusers,
                require: true,
                attributes: [
                  "firstName",
                  "middleName",
                  "lastName",
                  "phone",
                  "email",
                  "address",
                ],
              },
            ],
          },
        ],
      },
    ],
    limit: limit,
    offset: offset,
  });
  let sum = await donations.count();
  let count = Math.ceil(sum / limit);
  return { data: result, count };
};

exports.donations = async (req, res, next) => {
  try {
    let page = parseInt(req.query.page);
    let offset = (page - 1) * limitPageAdministration;
    let cacheKey = `donations_page_${page}`;
    // Attempt to get data from cache
    const cachedData = await getCacheData(cacheKey);

    // If data is found in cache, send it to the client
    if (cachedData != null) {
      res.send(JSON.parse(cachedData));
    } else {
      // If data is not found in cache, fetch it from the database
      const result = await fetchDataDonation(offset, limitPageAdministration);

      // Set the fetched data to cache for future requests
      await setCachedData(cacheKey, result, cacheTTL);

      // Send the fetched data to the client
      res.send(result);
    }
  } catch (err) {
    res.status(500).json({ error: "Unable to connect to cache server" });
    console.log(err);
  }
};

exports.insertDonations = (req, res, next) => {
  const isUser = req.query.isUser;
  const itemDonations = req.body;
  const error = validationResult(req);
  if (!error.isEmpty()) {
    res.status(501);
  }
  let lastCampaignId;
  try {
    if (isUser == 1) {
      donations
        .create({
          ...itemDonations,
          payment: "VND",
        })
        .then((result) => {
          res.status(200).send("Insert Successfull");
        });
    }
    if (isUser != 1) {
      donors
        .create({
          userId: null,
          isUser: 0,
          name: null,
          firstName: itemDonations.firstName,
          lastName: itemDonations.lastName,
          middleName: itemDonations.middleName,
          email: itemDonations.email,
          phone: itemDonations.phone,
          address: itemDonations.address,
        })
        .then((result) => {
          lastCampaignId = result.dataValues.id;
        })
        .then((result) => {
          donations.create({
            campaignId: itemDonations?.campaignId,
            donorId: lastCampaignId,
            userId: null,
            amount: itemDonations?.amount,
            notes: itemDonations?.notes,
          });
        })
        .then((result) => {
          res.status(200).send("Insert Sucessfull");
        });
    }
  } catch (error) {
    console.log(error);
  }
};
async function handleUserUpdate(id, itemUpdate, req) {
  const result = await donations.findOne({ id: id });
  if (req.method == "PUT") {
    if (!checkPutData(result.dataValues, itemUpdate.donation)) {
      throw new Error("Something wrong !!!");
    }
  }
  if (req.method == "PATCH") {
    if (!checkPatchData(result.dataValues, itemUpdate.donation)) {
      return Promise.reject(new Error("Something wrong !!!"));
    }
    if (
      checkError(
        validateDonation.validateEachElement,
        req,
        itemUpdate.donation
      ) != undefined
    ) {
      return Promise.reject(
        new Error(
          checkError(
            validateDonation.validateEachElement,
            req,
            itemUpdate.donation
          )
        )
      );
    }
  }

  await donations.update({ ...itemUpdate.donation }, { where: { id: id } });
  return "Update Successful";
}
async function handleNonUserUpdate(id, itemUpdate, req) {
  const donationResult = await donations.findOne({ id: id });
  if (req.method == "PUT") {
    if (!checkPutData(donationResult, itemUpdate.donation)) {
      return Promise.reject(new Error("Something wrong !!!"));
    }
  }
  if (req.method == "PATCH") {
    if (!checkPatchData(donationResult, itemUpdate.donation)) {
      return Promise.reject(new Error("Something wrong !!!"));
    }
  }

  const donorResult = await donors.findOne({
    donorId: donationResult.dataValues.donorId,
  });

  if (req.method == "PUT") {
    if (!checkPutData(donorResult, itemUpdate.donor)) {
      return Promise.reject(new Error("Something wrong !!!"));
    }
  }
  if (req.method == "PATCH") {
    if (!checkPatchData(donorResult, itemUpdate.donor)) {
      return Promise.reject(new Error("Something wrong !!!"));
    }
    if (
      checkError(validateDonation.validateEachElement, req, itemUpdate.donor) !=
      undefined
    ) {
      return Promise.reject(
        new Error(
          checkError(
            validateDonation.validateEachElement,
            req,
            itemUpdate.donor
          )
        )
      );
    }
  }

  if (Object.keys(itemUpdate.donation).length != 0) {
    await donations.update({ ...itemUpdate.donation }, { where: { id: id } });
  }

  if (Object.keys(itemUpdate.donor).length != 0) {
    await donors.update(
      { ...itemUpdate.donor },
      { where: { donorId: donationResult.dataValues.donorId } }
    );
  }

  return "Update Successful";
}
exports.updateDonations = async (req, res, next) => {
  const isUser = req.query.isUser;
  const id = req.query.id;
  const itemUpdate = req.body;

  try {
    if (isUser == 1) {
      const result = await handleUserUpdate(id, itemUpdate, req);
      res.status(200).send(result);
    } else {
      const result = await handleNonUserUpdate(id, itemUpdate, req);
      res.status(200).send(result);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error });
  }
};

exports.deleteDonations = (req, res, next) => {
  const id = req.query.id.split(",");
  try {
    donors
      .destroy({
        where: {
          id: {
            [Op.in]: id,
          },
        },
      })
      .then((result) => {
        res.status(200).send("Delete Sucessfull");
      });
  } catch (error) {
    console.log(error);
  }
};
