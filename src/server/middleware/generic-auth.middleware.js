const host = require("../config/prodhost.config.json").host;

module.exports.authenticate = function (req, res, next) {
    if (req.headers.origin != host) {
        res.status(401);
        res.send("Unauthorized");
        res.end();
    } else {
        next();
    }
}
