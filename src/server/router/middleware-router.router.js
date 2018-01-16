var steamAuth = require("../middleware/steam-auth.middleware.js");
var genericAuth = require("../middleware/generic-auth.middleware.js");

module.exports.steamAuth = steamAuth;
module.exports.genericAuth = genericAuth;
