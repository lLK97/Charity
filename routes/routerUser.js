const routerUser = require("express").Router();
const validateUsers = require("../validate/account");

const userController = require("../controller/user");

routerUser.get("/users", userController.users);
routerUser.get("/users/SelectUsers", userController.selectUser);
routerUser.post(
  "/users",
  validateUsers.validate.account,
  userController.insertUsers
);
routerUser.put(
  "/users",
  validateUsers.validate.account,
  userController.updateUsers
);
routerUser.patch("/users", userController.updateUsers);
routerUser.delete(
  "/users",
  validateUsers.validate.checkId,
  userController.deleteUsers
);

module.exports = routerUser;
