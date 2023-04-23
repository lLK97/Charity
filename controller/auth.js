let config = require("../config/config.json"),
  jwt = require("jsonwebtoken"),
  bcrypt = require("bcrypt"),
  { validationResult } = require("express-validator");
const { users, inforusers } = require("../config/sequelize");

// Define the signin function
exports.signin = async (req, res, next) => {
  try {
    // Get the username and password from the request body
    let username = req.body?.username,
      password = req.body?.password;

    // Validate the request body
    let error = validationResult(req);
    if (!error.isEmpty()) {
      // If there are validation errors, send a 422 error response
      res.status(422);
    }

    // Check if the username and password are defined
    if (username == undefined || password == undefined) {
      // If they are not defined, send a "not logged in" response
      res.status(22).send({ msg: "not logged in" });
    }

    // Find the user with the given username
    let user = await users.findOne({
      where: {
        username: username,
      },
    });

    // Check if the user is already logged in
    if (req.cookies["accessToken"] != undefined) {
      // If the user is already logged in, send a "loading" response
      res.json({ msg: "loading" });
    }

    // Check if the password is defined
    if (password == undefined) {
      // If the password is not defined, send a "Not Logged" response
      res.status(422).send({ msg: "Not Logged" });
    }

    // Compare the password with the hashed password stored in the database
    let checkPassword = await bcrypt.compare(
      password,
      user?.dataValues?.password
    );

    if (checkPassword) {
      // If the password is correct, create a new token with the user's username
      let token = jwt.sign({ username }, username, config.settingToken);

      // Update the user's access token in the database
      await users.update(
        {
          accessToken: token,
        },
        {
          where: {
            username: username,
          },
        }
      );

      // Set the access token and username as cookies in the response
      await res.cookie("accessToken", token, config.settingCookie);
      await res.cookie("username", username, config.settingCookie);

      // Send a success response with the message and username
      await res.json({ message: "Login successful", username: username });
    } else {
      // If the password is incorrect, send a 401 error response
      res.status(401).send({
        success: false,
        msg: "Authentication failed. Wrong password.",
      });
    }
  } catch (error) {
    // If there is an error, send a 401 error response
    return res.status(401).json({ msg: "Authentication failed" });
  }
};
exports.logout = async (req, res, next) => {
  try {
    let username = req.body.username;

    // Validate the request body
    // let error = validationResult(req);
    // if (!error.isEmpty()) {
    //   // If there are validation errors, send a 422 error response
    //   res.status(422);
    // }

    await users.update(
      { csrfToken: "", accessToken: "" },
      {
        where: { username: username },
      }
    );

    // Set the access token and username as cookies in the response
    await res.clearCookie("accessToken");
    await res.clearCookie("username");
    await res.clearCookie("csrfToken");

    // Send a success response with the message and username
    await res
      .status(200)
      .json({ message: "Logout successful", username: username });
  } catch (error) {
    // If there is an error, send a 401 error response
    console.log(error);
    return res.status(401).json({ msg: error });
  }
};

exports.signup = async (req, res, next) => {
  try {
    // Validate the request body
    let error = validationResult(req);
    if (!error.isEmpty()) {
      // If there are validation errors, send a 422 error response
      console.log(error);
    }

    let password = await bcrypt.hash(req.body.accountRegister.password, 10);
    let userResult = await users.create({
      username: req.body.accountRegister.username,
      password: password,
      roles: 0,
      csrfToken: "",
      accessToken: "",
    });

    let lastNameId = parseInt(userResult.dataValues.id);
    await inforusers.create({
      userId: lastNameId,
      firstName: req.body.inforRegister.firstName,
      middleName: req.body.inforRegister.middleName,
      lastName: req.body.inforRegister.lastName,
      email: req.body.inforRegister.email,
      phone: req.body.inforRegister.phone,
      address: req.body.inforRegister.address,
      bankAccountNumber: "",
      bankName: "",
    });
    return res.status(200).send({ msg: "Successful" });
  } catch (error) {
    res.status(500).send({
      error: "An error occurred during the process of creating the user",
    });
  }
};

/*
 * This function is used to verify whether the user is authenticated or not.
 * It checks if the user has the required cookies for authentication and then verifies the JWT token.
 * If the token is correct, it sends a success message.
 * If not, it clears all the cookies and sends an error message.
 */
exports.protectedAuth = async (req, res, next) => {
  if (req.cookies["username"] != undefined) {
    try {
      let user = await users.findOne({
        where: {
          username: req.cookies["username"],
        },
      });
      if (user?.dataValues != null) {
        await jwt.verify(
          req.cookies["accessToken"],
          req.cookies["username"],
          (err, decoded) => {
            if (err) {
              let cookies = Object.keys(req.cookies);
              cookies.forEach((cookie) => {
                res.clearCookie(cookie);
              });
              return res.status(401).json({ msg: err });
            }
            res.status(200).json({ msg: "Token Correct" });
          }
        );
      }
    } catch (error) {
      return res.status(401).json({ msg: "Authentication failed" });
    }
  } else {
    return res.status(401).json({ msg: "You must be logged in" });
  }
};

// This middleware generates and sets a CSRF token as a cookie if it doesn't exist already.
// It also sends the generated token back in the response as a JSON object.
exports.crfsToken = async (req, res, next) => {
  try {
    if (req.cookies["csrfToken"] == undefined) {
      await users.update(
        {
          csrfToken: req.csrfToken(),
        },
        {
          where: {
            username: req.query.username,
          },
        }
      );
      await res.cookie("csrfToken", req.csrfToken(), config.settingCookie);
      await res.json({ csrfToken: req.csrfToken() });
    }
    // If the CSRF token already exists, just send a message saying "loading"
    if (req.cookies["csrfToken"] != undefined) {
      res.json({ msg: "loading" });
    }
  } catch (error) {
    return res.status(401).json({ msg: eror });
  }
};

exports.refreshCrsfToken = async (req, res, next) => {
  try {
    let user = await users.findOne({
      where: {
        username: req.query.username,
      },
    });
    if (user?.dataValues != null) {
      // check if user exists
      await users.update(
        {
          csrfToken: req.csrfToken(), // generate new CSRF token
        },
        {
          where: {
            username: req.query.username,
          },
        }
      );
      await res.cookie("csrfToken", req.csrfToken(), config.settingCookie); // set new CSRF token in cookie
      await res.json({ msg: "loading" }); // send response
    }
  } catch (error) {
    return res.status(401).json({ msg: eror }); // handle error
  }
};
