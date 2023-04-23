const routerArticle = require("express").Router();

const articleController = require("../controller/article");

routerArticle.get("/articles", articleController.articles);
routerArticle.post("/articles", articleController.insertArticles);
routerArticle.delete("/articles", articleController.deleteArticles);
routerArticle.put("/articles", articleController.updateArticles);
routerArticle.patch("/articles", articleController.updateArticles);

module.exports = routerArticle;
