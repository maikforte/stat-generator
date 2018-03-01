module.exports.steamLogin = function (req, res) {

};

module.exports.steamLoginRedirect = function (req, res) {
    if (req.user) {
        res.redirect("/stat-generator?id=" + req.user.identifier);
    }
};
