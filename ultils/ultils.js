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

// Function to get data from cache by cacheKey
exports.getCacheData = async (cacheKey) => {
  return new Promise((resolve, reject) => {
    client.on("ready", async () => {
      try {
        client.get(cacheKey, (err, data) => {
          if (err) {
            reject(err);
          }
          resolve(data);
        });
      } catch (err) {
        console.error(err);
      }
    });
  });
};
// Function to set data to cache with cacheKey and time-to-live (TTL)
exports.setCachedData = async (cacheKey, data, ttl) => {
  return new Promise((resolve, reject) => {
    client.on("ready", async () => {
      try {
        client.hmset(cacheKey, ttl, JSON.stringify(data), (err) => {
          if (err) {
            reject(err);
          }
          resolve();
        });
      } catch (err) {
        console.error(err);
      }
    });
  });
};
