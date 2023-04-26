const { cacheTTL } = require("../config/sequelize");
const {
  limitPageAdministration,
  setCachedData,
  getCacheData,
} = require("../ultils/ultils");

const articles = require("../config/sequelize").articles;
const categories = require("../config/sequelize").categories;
const users = require("../config/sequelize").users;
const orgs = require("../config/sequelize").orgs;

// Define an asynchronous function named fetchDataArticles that takes two parameters - offset and limit
const fetchDataArticles = async (offset, limit) => {
  // Use the Sequelize ORM to fetch data from the "articles" table and join it with the "categories", "users", and "orgs" tables
  const result = await articles.findAll({
    attributes: [
      "id",
      "campaignId",
      "title",
      "imageData",
      "datePublished",
      "content",
      "desShort",
    ],
    include: [
      {
        model: categories,
        required: true,
        attributes: ["title"],
      },
      {
        model: users,
        required: true,
        attributes: ["username"],
      },
      {
        model: orgs,
        required: true,
        attributes: ["title", "imageData"],
      },
    ],
    // Use the "limit" and "offset" parameters to control the amount of data returned
    limit: limit,
    offset: offset,
  });
  // Get the total number of records in the "articles" table
  const count = await articles.count();
  // Return an object containing the fetched data and the total record count
  return { data: result, count };
};

exports.articles = async (req, res, next) => {
  try {
    let page = parseInt(req.query.page);
    let offset = (page - 1) * limitPageAdministration;
    let cacheKey = `articles_page_${page}`;

    // Attempt to get data from cache
    const cachedData = await getCacheData(cacheKey);

    // If data is found in cache, send it to the client
    if (cachedData != null) {
      res.send(JSON.parse(cachedData));
    } else {
      // If data is not found in cache, fetch it from the database
      let result = await fetchDataArticles(offset, limitPageAdministration);

      // Set the fetched data to cache for future requests
      await setCachedData(cacheKey, result, cacheTTL);

      // Send the fetched data to the client
      res.send(result);
    }
  } catch (err) {
    res.status(500).send({ error: "Unable to connect to cache server" });
    console.log(err);
  } finally {
    client.quit();
  }
};
// Insert a new article into the database
exports.insertArticles = async (req, res, next) => {
  try {
    const article = await articles.create(req.body);
    res.status(200).send(article);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

// Update an existing article in the database
exports.updateArticles = async (req, res, next) => {
  try {
    const id = req.query.id;
    await articles.update(req.body, {
      where: {
        id: id,
      },
    });
    res.status(200).send("Article updated successfully");
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

// Delete one or more articles from the database
exports.deleteArticles = async (req, res, next) => {
  const ids = req.query.id.split(",").map((id) => parseInt(id));
  try {
    await articles.destroy({
      where: {
        id: {
          [Op.in]: ids,
        },
      },
    });

    res.status(200).send("Articles deleted successfully");
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

exports.selectCardCampaign = (req, res, next) => {};
