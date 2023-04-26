const {
  categories,
  campaigns,
  articles,
  users,
  orgs,
  cacheTTL,
} = require("../config/sequelize");

const { Op } = require("sequelize");
const {
  checkPutData,
  checkPatchData,
  checkError,
  limitPageAdministration,
  getCacheData,
  setCachedData,
} = require("../ultils/ultils");
const { validationResult } = require("express-validator");
const { validateEachElement } = require("../validate/campaign");

// Function to fetch data from the database with offset and limit

/**
 * Fetches data from four tables joined by foreign keys: articles, categories, campaigns, and users.
 * @param {number} offset - The starting point to retrieve data.
 * @param {number} limit - The maximum number of results to return.
 * @returns {Object} An object with two properties: data and count. Data is the result of the database query and count is the total number of rows in the articles table.
 */
const fetchDataCampaigns = async (offset, limit) => {
  let result = await articles.findAndCountAll({
    attributes: ["title", "desShort", "content", "datePublished"],
    include: [
      {
        model: categories,
        required: true,
        attributes: ["id", "title"],
      },
      {
        model: campaigns,
        required: true,
        attributes: ["id", "startDate", "endDate", "target"],
      },
      {
        model: users,
        required: true,
        attributes: ["id", "username"],
        include: [
          {
            model: orgs,
            required: true,
            attributes: ["title", "detail"],
          },
        ],
      },
    ],
    limit: limit,
    offset: offset,
  });
  let sum = await result.count;
  let count = Math.ceil(sum / limit);
  return { data: result.rows, count };
};

exports.campaigns = async (req, res, next) => {
  try {
    let page = parseInt(req.query.page);
    let offset = (page - 1) * limitPageAdministration;
    let cacheKey = `campaigns_page_${page}`;
    // Attempt to get data from cache
    let cachedData = await getCacheData(cacheKey);

    // If data is found in cache, send it to the client
    if (cachedData != null) {
      res.send(JSON.parse(cachedData));
    } else {
      // If data is not found in cache, fetch it from the database
      let result = fetchDataCampaigns(offset, limitPageAdministration);
      // Set the fetched data to cache for future requests
      await setCachedData(cacheKey, result, cacheTTL);

      // Send the fetched data to the client
      res.send(result);
    }
  } catch (err) {
    res.status(500).send({ error: err });
    console.log(err);
  } finally {
    client.quit();
  }
};

exports.insertCampaigns = async (req, res, next) => {
  try {
    // Use the "validationResult" function to check for errors in the request data
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // If there are errors, return a 501 status code along with an array of error messages
      return res.status(501).json({ errors: errors.array() });
    }

    // Create a new campaign using the "create" function, which likely inserts data into a Sequelize database
    const campaign = await campaigns.create({
      userId: req.body.userId,
      categoryId: req.body.categoryId,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      target: req.body.target,
      currentUnit: "VND", // Set a default value for the "currentUnit" field
    });

    // Store the ID of the newly created campaign
    const lastCampaignId = campaign.dataValues.id;

    // Create a new article associated with the campaign
    const article = await articles.create({
      userId: req.body.userId,
      campaignId: lastCampaignId,
      title: req.body.title,
      datePublished: null, // Set the "datePublished" field to null
      imageData: "", // Set the "imageData" field to an empty string
    });

    // Send a 200 status code along with the newly created article object
    res.status(200).send(article);
  } catch (error) {
    // If there is an error, log it to the console and return a 500 status code along with an error message
    console.log(error);
    res.status(500).json({
      error:
        "An error occurred during the process of creating the campaign and article",
    });
  }
};

exports.updateCampaigns = async (req, res, next) => {
  const id = req.query.id;
  const itemUpdate = req.body;
  let error = validationResult(req);

  // Check if there is any validation error, return the error and terminate the request
  if (!error.isEmpty()) {
    res.status(400).send(error);
    return;
  }

  try {
    // Find the campaign with the given ID
    const campaign = await campaigns.findOne({ where: { id } });

    // Check if the update method is PUT, and if so, validate the update data
    if (req.method === "PUT") {
      if (!checkPutData(campaign, itemUpdate)) {
        throw new Error("Something is wrong with the update data");
      }
    }

    // Check if the update method is PATCH, validate the update data and each element in the update data
    if (req.method === "PATCH") {
      if (!checkPatchData(campaign, itemUpdate)) {
        throw new Error("Something is wrong with the update data");
      }
      const elementError = checkError(validateEachElement, req, itemUpdate);
      if (elementError) {
        throw new Error(elementError);
      }
    }

    // Update the campaign with the new data
    await campaigns.update({ ...itemUpdate.campaign }, { where: { id } });

    // If the title is included in the update, update the corresponding articles' title
    if (itemUpdate.article !== null) {
      await articles.update(
        { ...itemUpdate.article },
        { where: { campaignId: id } }
      );
    }

    // Return the success message
    console.log("Update successful");
    res.status(200).send("Update successful");
  } catch (error) {
    console.log(error);
    // If there is any error, return the error message
    res.status(500).send(error.message);
  }
};

exports.deleteCampaigns = async (req, res, next) => {
  // Get the array of IDs to be deleted from query params
  const ids = req.query.id.split(",");

  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Return a 400 Bad Request status with the errors object
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // Use the bulkDelete method of sequelize to delete multiple records
    let result = await campaigns.destroy({
      where: { id: { [Op.in]: ids } },
    });

    // Check if any records were deleted
    if (result === 0) {
      // Return a 404 Not Found status if no records were deleted
      return res.status(404).send("No records found for deletion");
    }

    // Return a 200 OK status with a success message
    res.status(200).send("Deletion successful");
  } catch (error) {
    // Return a 500 Internal Server Error status with the error message
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
};

// This function selects all the campaigns from the "articles" table and returns their "campaignId" and "title" attributes
exports.selectCampaign = (req, res, next) => {
  try {
    articles
      .findAll({
        attributes: ["campaignId", "title"],
      })
      .then((result) => {
        res.status(200).send(result);
      });
  } catch (err) {
    console.log(err);
  }
};
