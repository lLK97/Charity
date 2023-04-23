const routerCategories = require("express").Router();

const categoriesController = require("../controller/category");
const validateCategory = require("../validate/category");

routerCategories.get("/categories", categoriesController.categories);
routerCategories.get(
  "/SelectCategories",
  categoriesController.selectCategories
);
routerCategories.post(
  "/categories",
  validateCategory.validate.category,
  categoriesController.insertCategories
);
routerCategories.put(
  "/categories",
  validateCategory.validate.category,
  categoriesController.updateCategories
);
routerCategories.patch("/categories", categoriesController.updateCategories);
routerCategories.delete(
  "/categories",
  validateCategory.validate.checkId,
  categoriesController.deleteCategories
);

module.exports = routerCategories;
