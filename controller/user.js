const { users, inforusers, cacheTTL } = require("../config/sequelize");
const {
  limitPageAdministration,
  getCacheData,
  setCachedData,
} = require("../ultils/ultils");

// This function fetches data of users with their corresponding information
const fetchDataUser = async (offset, limit) => {
  try {
    // Use destructuring to only retrieve necessary attributes from the users table
    const result = await users.findAndCountAll({
      attributes: ["id", "roles", "username", "password"],
      include: [
        {
          // Define a required one-to-one association between users and inforusers
          model: inforusers,
          required: true,
          attributes: [
            "firstName",
            "middleName",
            "lastName",
            "email",
            "phone",
            "address",
            "bankAccountNumber",
            "bankName",
          ],
        },
      ],
      // Set limit and offset for pagination
      limit: limit,
      offset: offset,
    });
    // Use count() method to get the total number of users
    let sum = await result.count;
    let count = Math.ceil(sum / limit);
    return { data: result.rows, count };
  } catch (error) {
    console.log(error);
    throw new Error("Failed to fetch data for users");
  }
};

exports.users = async (req, res, next) => {
  try {
    let page = parseInt(req.query.page);
    let offset = (page - 1) * limitPageAdministration;
    let cacheKey = `users_page_${page}`;
    // Attempt to get data from cache
    const cachedData = await getCacheData(cacheKey);

    // If data is found in cache, send it to the client
    if (cachedData != null) {
      res.send(JSON.parse(cachedData));
    } else {
      // If data is not found in cache, fetch it from the database
      const result = await fetchDataUser(offset, limitPageAdministration);

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

// Select users from the 'inforusers' table and send the result to the client
exports.selectUser = async (req, res, next) => {
  try {
    const result = await inforusers.findAll({
      attributes: ["id", "firstName", "middleName", "lastName"],
    });
    res.send(result);
  } catch (err) {
    console.log(err);
  }
};

// Insert a new user into the 'users' and 'inforusers' tables
exports.insertUsers = async (req, res, next) => {
  try {
    let password = await bcrypt.hash(req.body.accountRegister.password, 10);
    let userResult = await users.create({
      password: password,
      csrfToken: req.crsfToken(),
      ...req.body.accountRegister,
    });
    let lastNameId = await userResult.dataValues.id;
    await inforusers.create({
      userId: lastNameId,
      ...req.body.inforRegister,
    });
    await res.cookie("crsfToken", req.crsfToken());
    return res.status(200).send({ msg: "Successful" });
  } catch (error) {
    res.status(500).json({
      error: "An error occurred during the process of creating the user",
    });
  }
};

// Delete users from the 'users' and 'inforusers' tables
exports.deleteUsers = async (req, res, next) => {
  const id = req.query.id.split(",");
  try {
    await users.destroy({
      where: {
        id: {
          [Op.in]: id,
        },
      },
    });
    await inforusers.destroy({
      where: {
        userId: {
          [Op.in]: id,
        },
      },
    });
    res.status(200).send("Delete Successful");
  } catch (error) {
    console.log(error);
  }
};

// Update users from the 'users' and 'inforusers' tables
exports.updateUsers = async (req, res, next) => {
  const id = req.query.id;
  const itemUpdate = req.body;

  try {
    // Check if both accountItem and accountInforItem are present in request body
    if (itemUpdate.accountItem != null && itemUpdate.accountInforItem != null) {
      await updateUserAndUserInfo(
        id,
        itemUpdate.accountItem,
        itemUpdate.accountInforItem
      );
    }
    // Check if only accountItem is present in request body
    else if (
      itemUpdate.accountItem != null &&
      itemUpdate.accountInforItem == null
    ) {
      await updateUser(id, itemUpdate.accountItem);
    }
    // Check if only accountInforItem is present in request body
    else if (
      itemUpdate.accountItem == null &&
      itemUpdate.accountInforItem != null
    ) {
      await updateUserInfo(id, itemUpdate.accountInforItem);
    }

    // Send response with status code and message
    res.status(200).send("Update Successful");
  } catch (error) {
    console.log(error);
    res.status(500).send("Update Failed");
  }
};

// Function to update both user and user information
const updateUserAndUserInfo = async (id, accountItem, accountInforItem) => {
  await Promise.all([
    users.update({ ...accountItem }, { where: { id: id } }),
    inforusers.update({ ...accountInforItem }, { where: { userId: id } }),
  ]);
};

// Function to update user only
const updateUser = async (id, accountItem) => {
  await users.update({ ...accountItem }, { where: { id: id } });
};

// Function to update user information only
const updateUserInfo = async (id, accountInforItem) => {
  await inforusers.update({ ...accountInforItem }, { where: { userId: id } });
};
