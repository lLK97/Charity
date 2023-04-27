const { validationResult } = require("express-validator");
const { client } = require("../config/sequelize");
exports.limitPageAdministration = 10;
exports.checkPutData = (dataOld, dataNew) => {
  return JSON.stringify(dataOld) !== JSON.stringify(dataNew);
};

exports.checkPatchData = (dataOld, dataNew) => {
  for (const key in dataOld) {
    if (dataOld[key] == dataNew[key]) return false;
  }
  return true;
};

exports.checkError = (validationRules, req, body) => {
  return Object.keys(body).reduce((errors, field) => {
    if (validationRules[field]) {
      const fieldErrors = validationResult(req, validationRules[field]);
      if (!fieldErrors.isEmpty()) {
        errors[field] = fieldErrors.array();
      }
    }
    return errors;
  }, {});
};

const createRedisClient = async () => {
  return new Promise((resolve, reject) => {
    client.setMaxListeners(20);
    client.on("ready", () => {
      resolve(client);
    });

    client.on("error", (err) => {
      reject(err);
    });
  });
};
exports.getCacheData = async (cacheKey) => {
  try {
    const cachedData = await client.get(cacheKey);
    return cachedData;
  } catch (error) {
    console.log(error);
  }
};

exports.setCachedData = async (cacheKey, data, ttl) => {
  try {
    await client.set(cacheKey, JSON.stringify(data), "EX", ttl, (err) => {
      console.log(err);
    });
  } catch (error) {
    console.log(error);
  }
};
