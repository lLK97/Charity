/**
 * @param {number} limit - The maximum number of results to return.
 */
const sequelize = require("../config/sequelize").sequelizeConnect;
const sqlQuery = require("../config/sqlQuery");
const { QueryTypes } = require("sequelize");
const { orgs, cacheTTL } = require("../config/sequelize");
const { checkError, getCacheData, setCachedData } = require("../ultils/ultils");
const { inforOrg } = require("../validate/queryRam");

exports.CardCampaign = async (req, res, next) => {
  try {
    let limit = parseInt(req.query.limit);
    let cacheKey = `card_campaign`;
    let cacheLimit = `card_campaign_limit`;
    // Attempt to get data from cache
    let cachedData = await getCacheData(cacheKey);
    let cacheDataLimit = await getCacheData(cacheLimit);
    // If data is found in cache, send it to the client
    if (cachedData != null && cacheDataLimit == limit) {
      res.send(JSON.parse(cachedData));
    } else {
      // If data is not found in cache, fetch it from the database
      let result = await sequelize.query(sqlQuery.CardCampaign(limit), {
        type: QueryTypes.SELECT,
      });

      // Set the fetched data to cache for future requests
      await setCachedData(cacheKey, result, cacheTTL);
      // Send the fetched data to the client
      res.send(result);
    }
  } catch (error) {
    res.status(500).json({ error: "Unable to connect to cache server" });
    console.log(error);
  } finally {
    client.quit();
  }
};

exports.CardOrgs = async (req, res, next) => {
  try {
    let limit = parseInt(req.query.limit);
    let cacheKey = `card_org`;
    let cachedData = await getCacheData(cacheKey);
    if (cachedData != null) {
      res.send(JSON.parse(cachedData));
    } else {
      let result = await sequelize.query(sqlQuery.CardOrgs(limit), {
        type: QueryTypes.SELECT,
      });
      await setCachedData(cacheKey, result, cacheTTL);
      res.send(result);
    }
  } catch (error) {
    res.status(500).json({ error: "Unable to connect to cache server" });
    console.log(error);
  } finally {
    client.quit();
  }
};

exports.CardBanner = async (req, res, next) => {
  try {
    let id = req.query.id;
    let sql =
      id == "null" ? sqlQuery.CardBannerNotId : sqlQuery.CardBannerId(id);
    let cacheKey = `card_banner`;
    let cacheKeyid = `id_category_card_banner`;
    let cachedData = await getCacheData(cacheKey);
    let cachedDataId = await getCacheData(cacheKeyid);
    if (cachedData != null && id == cachedDataId) {
      res.send(JSON.parse(cachedData));
    } else {
      let result = await sequelize.query(sql, {
        type: QueryTypes.SELECT,
      });
      await setCachedData(cacheKey, result, cacheTTL);
      await setCachedData(cacheKeyid, id, cacheTTL);
      res.send(result);
    }
  } catch (error) {
    res.status(500).json({ error: "Unable to connect to cache server" });
    console.log(error);
  } finally {
    client.quit();
  }
};

exports.CardCategories = async (req, res, next) => {
  try {
    let cacheKey = `card_categories`;
    let cachedData = await getCacheData(cacheKey);
    if (cachedData != null) {
      res.send(JSON.parse(cachedData));
    } else {
      let result = await sequelize.query(sqlQuery.CardCategories, {
        type: QueryTypes.SELECT,
      });
      await setCachedData(cacheKey, result, cacheTTL);
      res.send(result);
    }
  } catch (error) {
    res.status(500).json({ error: "Unable to connect to cache server" });
    console.log(error);
  } finally {
    client.quit();
  }
};

exports.CardArticles = async (req, res, next) => {
  try {
    let limit = parseInt(req.query.limit);
    let cacheKey = `card_article`;
    let cachedData = await getCacheData(cacheKey);
    if (cachedData != null) {
      res.send(JSON.parse(cachedData));
    } else {
      let result = await sequelize.query(sqlQuery.CardArticle(limit), {
        type: QueryTypes.SELECT,
      });
      await setCachedData(cacheKey, result, cacheTTL);
      res.send(result);
    }
  } catch (error) {
    res.status(500).json({ error: "Unable to connect to cache server" });
    console.log(error);
  } finally {
    client.quit();
  }
};

exports.CampaignDetail = async (req, res, next) => {
  try {
    let id = parseInt(req.query.id);
    let cacheKey = `card_campaign_detail`;
    let cachedData = await getCacheData(cacheKey);
    let cacheKeyId = `card_campaign_detail_id`;
    let cachedDataId = await getCacheData(cacheKeyId);
    if (cachedData != null && cachedDataId == id) {
      res.send(JSON.parse(cachedData));
    } else {
      let result = await sequelize.query(sqlQuery.CampaignDetail + `${id}`, {
        type: QueryTypes.SELECT,
      });
      await setCachedData(cacheKeyId, id, cacheTTL);
      await setCachedData(cacheKey, result, cacheTTL);
      res.send(result);
    }
  } catch (error) {
    res.status(500).json({ error: "Unable to connect to cache server" });
    console.log(error);
  } finally {
    client.quit();
  }
};

exports.ArticlesDetail = async (req, res, next) => {
  try {
    let id = parseInt(req.query.id);
    let cacheKey = `article_detail`;
    let cachedData = await getCacheData(cacheKey);
    let cacheKeyId = `article_detail_id`;
    let cachedDataId = await getCacheData(cacheKeyId);
    if (cachedData != null && cachedDataId == id) {
      res.send(JSON.parse(cachedData));
    } else {
      console.log(id);
      let result = await sequelize.query(sqlQuery.ArticleDetail + `${id}`, {
        type: QueryTypes.SELECT,
      });
      await setCachedData(cacheKeyId, id, cacheTTL);
      await setCachedData(cacheKey, result, cacheTTL);
      res.send(result);
    }
  } catch (error) {
    res.status(500).json({ error: "Unable to connect to cache server" });
    console.log(error);
  } finally {
    client.quit();
  }
};

exports.OrgsDetail = async (req, res, next) => {
  try {
    let id = parseInt(req.query.id);
    let cacheKey = `org_detail`;
    let cachedData = await getCacheData(cacheKey);
    let cacheKeyId = `org_detail_id`;
    let cachedDataId = await getCacheData(cacheKeyId);
    if (cachedData != null && cachedDataId == id) {
      res.send(JSON.parse(cachedData));
    } else {
      let result = await sequelize.query(sqlQuery.OrgDetail(id), {
        type: QueryTypes.SELECT,
      });
      await setCachedData(cacheKeyId, id, cacheTTL);
      await setCachedData(cacheKey, result, cacheTTL);
      res.send(result);
    }
  } catch (error) {
    res.status(500).json({ error: "Unable to connect to cache server" });
    console.log(error);
  } finally {
    client.quit();
  }
};

exports.CampaignRelated = async (req, res, next) => {
  try {
    let idOrg = parseInt(req.query.idOrg);
    let idArticle = parseInt(req.query.idArticle);
    let cacheKey = `campaign_related`;
    let cachedData = await getCacheData(cacheKey);
    let cacheKeyIdOrg = `campaign_related_idOrg`;
    let cachedDataIdOrg = await getCacheData(cacheKeyIdOrg);
    let cacheKeyIdArticle = `campaign_related_idArticle`;
    let cachedDataIdArticle = await getCacheData(cacheKeyIdArticle);
    if (
      cachedData != null &&
      cacheKeyIdOrg == idOrg &&
      cacheKeyIdArticle == idArticle
    ) {
      res.send(JSON.parse(cachedData));
    } else {
      let result = await sequelize.query(
        sqlQuery.CampaignRelative(idOrg, idArticle),
        {
          type: QueryTypes.SELECT,
        }
      );
      await setCachedData(cachedDataIdOrg, idOrg, cacheTTL);
      await setCachedData(cachedDataIdArticle, idArticle, cacheTTL);
      await setCachedData(cacheKey, result, cacheTTL);
      res.send(result);
    }
  } catch (error) {
    res.status(500).json({ error: "Unable to connect to cache server" });
    console.log(error);
  } finally {
    client.quit();
  }
};

exports.AccountDetail = async (req, res, next) => {
  try {
    let username = req.query.username;
    let cacheKey = `account_detail`;
    let cachedData = await getCacheData(cacheKey);
    if (cachedData != null) {
      res.send(JSON.parse(cachedData));
    } else {
      let result = await sequelize.query(sqlQuery.AccountDetail(username), {
        type: QueryTypes.SELECT,
      });
      await setCachedData(cacheKey, result, cacheTTL);
      res.send(result);
    }
  } catch (error) {
    res.status(500).json({ error: "Unable to connect to cache server" });
    console.log(error);
  } finally {
    client.quit();
  }
};

exports.CampaignsOfOrg = async (req, res, next) => {
  try {
    let username = req.query.username;
    let cacheKey = `campaign_of_orgs`;
    let cachedData = await getCacheData(cacheKey);
    let cacheUser = `campaign_of_orgs_user`;
    let cachedDataUser = await getCacheData(cacheUser);
    if (cachedData != null && cachedDataUser == username) {
      res.send(JSON.parse(cachedData));
    } else {
      let result = await sequelize.query(sqlQuery.CampaignsOfOrg(username), {
        type: QueryTypes.SELECT,
      });
      await setCachedData(cacheUser, username, cacheTTL);
      await setCachedData(cacheKey, result, cacheTTL);
      res.send(result);
    }
  } catch (error) {
    res.status(500).json({ error: "Unable to connect to cache server" });
    console.log(error);
  } finally {
    client.quit();
  }
};

exports.DonationsOfUser = async (req, res, next) => {
  try {
    let username = req.query.username;
    let cacheKey = `donation_of_users`;
    let cachedData = await getCacheData(cacheKey);
    let cacheUser = `donation_username`;
    let cachedDataUser = await getCacheData(cacheUser);
    if (cachedData != null && cachedDataUser == username) {
      res.send(JSON.parse(cachedData));
    } else {
      let result = await sequelize.query(sqlQuery.DonationsOfUser(username), {
        type: QueryTypes.SELECT,
      });
      await setCachedData(cacheKey, result, cacheTTL);
      res.send(result);
    }
  } catch (error) {
    res.status(500).json({ error: "Unable to connect to cache server" });
    console.log(error);
  } finally {
    client.quit();
  }
};

exports.updateInforOrgs = async (req, res, next) => {
  try {
    let id = parseInt(req.body.id);
    let itemUpdate = req.body;
    if (checkError(inforOrg, req, itemUpdate)) {
      return res
        .status(500)
        .send(new Error(checkError(inforOrg, req, itemUpdate)));
    }
    let result = await orgs.update(
      {
        ...itemUpdate,
      },
      {
        where: { id: id },
      }
    );
    res.send(result);
  } catch (error) {
    res.status(500).json({ error: "Unable to connect to cache server" });
    console.log(error);
  } finally {
    client.quit();
  }
};

exports.articleCategories = async (req, res, next) => {
  try {
    let id = parseInt(req.query.id);
    let cacheKey = `articles_categories`;
    let cacheKeyId = `articles_categories_id`;
    let cachedData = await getCacheData(cacheKey);
    let cachedDataId = await getCacheData(cacheKeyId);
    if (cachedData != null && cachedDataId == id) {
      res.send(JSON.parse(cachedData));
    } else {
      let result = await sequelize.query(sqlQuery.CardArticlesCategory(id), {
        type: QueryTypes.SELECT,
      });
      await setCachedData(cacheKey, result, cacheTTL);
      await setCachedData(cacheKeyId, cachedDataId, cacheTTL);
      res.send(result);
    }
  } catch (error) {
    res.status(500).json({ error: "Unable to connect to cache server" });
    console.log(error);
  } finally {
    client.quit();
  }
};
