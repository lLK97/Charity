const { cacheTTL } = require("../config/sequelize");
const {
  limitPageAdministration,
  getCacheData,
  setCachedData,
} = require("../ultils/ultils");

const categories = require("../config/sequelize").categories;

/**
 * Fetch categories data with pagination
 *
 * @param {Number} offset - The offset of the first category to retrieve
 * @param {Number} limit - The maximum number of categories to retrieve
 * @returns {Object} - An object containing the retrieved data and the total count of categories
 */
const fetchDataCategory = async (offset, limit) => {
  // Retrieve categories with only the "id", "title", and "des" attributes, and with the given pagination parameters
  const result = await categories.findAndCountAll({
    attributes: ["id", "title", "des"],
    limit: limit,
    offset: offset,
  });

  let sum = await result.count;
  let count = Math.ceil(sum / limit);
  return { data: result.rows, count };
};

exports.categories = async (req, res, next) => {
  try {
    let page = parseInt(req.query.page);
    let offset = (page - 1) * limitPageAdministration;
    let cacheKey = `categoris_page_${page}`;
    // Attempt to get data from cache
    let cachedData = await getCacheData(cacheKey);

    // If data is found in cache, send it to the client
    if (cachedData != null) {
      res.send(JSON.parse(cachedData));
    } else {
      // If data is not found in cache, fetch it from the database
      const result = fetchDataCategory(offset, limitPageAdministration);

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

// Get all categories and return them with only the "id" and "title" attributes
exports.selectCategories = async (req, res, next) => {
  let cacheKey = `categoris_all`;
  let cachedData = await getCacheData(cacheKey);
  // If data is found in cache, send it to the client

  try {
    // If data is found in cache, send it to the client
    if (cachedData != null) {
      res.send(JSON.parse(cachedData));
    } else {
      // If data is not found in cache, fetch it from the database
      const result = await categories.findAll({
        attributes: ["id", "title"],
      });
      // Set the fetched data to cache for future requests
      await setCachedData(cacheKey, result, cacheTTL);

      // Send the fetched data to the client
      res.send(result);
    }
  } catch (err) {
    // Return an error message to the client
    res.status(500).send("Server Error");
    console.error(err);
  } finally {
    client.quit();
  }
};

// Delete a category with the given ID
exports.deleteCategories = async (req, res, next) => {
  try {
    const id = req.query.id;

    if (!id) {
      return res.status(400).send("ID is required");
    }

    const deletedCategory = await categories.destroy({ where: { id } });

    if (!deletedCategory) {
      return res.status(404).send("Category not found");
    }

    // Return success message to the client
    res.status(200).send("Delete Successful");
  } catch (err) {
    console.error(err);

    // Return an error message to the client
    res.status(500).send("Server Error");
  }
};

exports.insertCategories = async (req, res, next) => {
  exports.insertCategories = async (req, res, next) => {
    const itemInsert = req.body; // Get the data sent from the client and store it in the itemInsert variable
    try {
      categories.create({
        // Insert new data into the categories collection and wait for it to complete
        ...itemInsert,
      });
      res.status(200).send("Insert Successful"); // Send a success message to the client
    } catch (err) {
      console.log(err);
      res.status(500).send("Insert Failed"); // Send an error message to the client if the insertion fails
    }
  };
};

// Update categories with given ID
exports.updateCategories = async (req, res, next) => {
  try {
    const id = req.query.id; // Get ID from query parameter
    if (!id) {
      res.status(400).send("ID is required"); // Return error if ID is not provided
      return;
    }
    const itemUpdate = req.body; // Get updated item from request body
    const result = await categories.update(
      { ...itemUpdate },
      { where: { id: id } }
    ); // Update category in database
    if (result[0] === 0) {
      res.status(404).send("Category not found"); // Return error if category is not found
      return;
    }
    res.status(200).send("Update Successful"); // Return success message
  } catch (err) {
    console.error(err); // Log error to console
    res.status(500).send("Server Error"); // Return error message to client
  }
};
