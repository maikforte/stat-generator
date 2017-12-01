var auth = require("../middleware/auth.js");
var steamLoginController = require("../controller/steam-login.controller.js");
var dotaStatController = require("../controller/dota-stat.controller.js");

module.exports.auth = auth;
module.exports.steamLoginController = steamLoginController;
module.exports.dotaStatController = dotaStatController;
