let express = require("express"),
  cors = require("cors"),
  // passportAuth = require("passport").authenticate("jwt", { session: false }),
  cookieParser = require("cookie-parser");

let app = express(),
  routerCategories = require("./routes/routerCategory"),
  routerCampaigns = require("./routes/routerCampaign"),
  routerUsers = require("./routes/routerUser"),
  routerOrgs = require("./routes/routerOrgs"),
  routerDonation = require("./routes/routerDonation"),
  routerArticle = require("./routes/routerArticle"),
  routerAuth = require("./routes/routerAuth"),
  routerQuery = require("./routes/routerQuery"),
  redis = require("ioredis");

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({}));

app.use(cookieParser());
app.use(routerAuth);

app.use(routerCategories);
app.use(routerUsers);
app.use(routerOrgs);
app.use(routerCampaigns);
app.use(routerDonation);
app.use(routerArticle);
app.use(routerQuery);

module.exports = app;
