/**
 * Module dependencies.
 */

let app = require('../app');
const port = process.env.PORT || 5000;
const sequelizeCon = require('../config/sequelize');
sequelizeCon.sequelizeConnect.sync().then(
    res => {
        app.listen(port);
    }
).catch(err => {
    console.log(err)
})

