module.exports.authenticate = function (req, res, next) {
    if (req.headers.origin != 'http://www.vertigoo.org') {
        res.status(401);
        res.send("Unauthorized");
        res.end();
    } else {
        next();
    }
}
