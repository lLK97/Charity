const { cacheTTL } = require("../config/sequelize");
const {
  limitPageAdministration,
  getCacheData,
  setCachedData,
} = require("../ultils/ultils");

const orgs = require("../config/sequelize").orgs;

const fetchDataOrgs = async (offset, limit) => {
  const result = await orgs.findAll({
    attributes: ["id", "userId", "title", "address", "detail", "linkWebsite"],
    limit: limit,
    offset: offset,
  });
  let sum = await orgs.count();
  let count = Math.ceil(sum / limit);
  return { data: result, count };
};

exports.orgs = async (req, res, next) => {
  try {
    let page = parseInt(req.query.page);
    let offset = (page - 1) * limitPageAdministration;
    let cacheKey = `orgs_page_${page}`;
    // Attempt to get data from cache
    const cachedData = await getCacheData(cacheKey);

    // If data is found in cache, send it to the client
    if (cachedData != null) {
      res.send(JSON.parse(cachedData));
    } else {
      // If data is not found in cache, fetch it from the database
      const result = await fetchDataOrgs(offset, limitPageAdministration);

      // Set the fetched data to cache for future requests
      await setCachedData(cacheKey, result, cacheTTL);

      // Send the fetched data to the client
      res.send(result);
    }
  } catch (err) {
    res.status(500).json({ error: "Unable to connect to cache server" });
    console.log(err);
  } finally {
    client.quit();
  }
};

// Retrieve a list of organizations from the database
exports.listOrgs = async (req, res, next) => {
  try {
    const orgList = await orgs.findAll({
      attributes: ["id", "title"],
    });
    res.status(200).send(orgList);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

// Insert a new organization into the database
exports.insertOrgs = async (req, res, next) => {
  try {
    const newOrg = await orgs.create(req.body);
    res.status(200).send(newOrg);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

// Update an existing organization in the database
exports.updateOrgs = async (req, res, next) => {
  const id = req.query.id;
  const orgUpdate = req.body;
  try {
    const updatedOrg = await orgs.update(orgUpdate, {
      where: {
        id: id,
      },
      returning: true,
    });
    res.status(200).send(updatedOrg[1][0]);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

// Delete one or more organizations from the database
exports.deleteOrgs = async (req, res, next) => {
  const ids = req.query.id.split(",").map((id) => parseInt(id));
  try {
    await orgs.destroy({
      where: {
        id: {
          [Op.in]: ids,
        },
      },
    });
    res.status(200).send("Organizations deleted successfully");
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};
