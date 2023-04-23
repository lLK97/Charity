const routerQuery = require("express").Router();

const queryController = require("../controller/queryRam");

routerQuery.get("/CardCampaigns", queryController.CardCampaign);
routerQuery.get("/CardOrgs", queryController.CardOrgs);
routerQuery.get("/CardBanners", queryController.CardBanner);
routerQuery.get("/CardCategories", queryController.CardCategories);
routerQuery.get("/CardArticles", queryController.CardArticles);
routerQuery.get("/CampaignDetail", queryController.CampaignDetail);
routerQuery.get("/CampaignRelated", queryController.CampaignRelated);
routerQuery.get("/ArticleRelated", queryController.articleCategories);
routerQuery.get("/ArticleDetail", queryController.ArticlesDetail);
routerQuery.get("/OrgDetail", queryController.OrgsDetail);
routerQuery.get("/AccountDetail", queryController.AccountDetail);
routerQuery.patch("/AccountDetail", queryController.updateInforOrgs);
routerQuery.get("/CampaignsOfOrg", queryController.CampaignsOfOrg);
routerQuery.get("/DonationsOfUser", queryController.DonationsOfUser);

module.exports = routerQuery;
