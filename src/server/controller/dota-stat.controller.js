var request = require("request");
var config = require("../config/open-dota.config.json");
var randomString = require("randomstring");
var fs = require('fs');
var mkdirp = require("mkdirp");
//var host = "https://dota-stat-generator.herokuapp.com";
//var host = "http://192.168.1.106:3000";
var host = "http://www.vertigoo.org";

var download = function (uri, filename, callback) {
    request.head(uri, function (err, res, body) {
        console.log('content-type:', res.headers['content-type']);
        console.log('content-length:', res.headers['content-length']);
        request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
    });
};

module.exports.getPlayerInfo = function (req, res) {
    request({
        "method": "GET",
        "url": config.BASE_URL + "/players/" + req.query.account_id
    }, function (error, requestResponse, body) {
        if (error) {
            console.log(error);
        } else {
            var tempBody = JSON.parse(body);
            var dir = "assets/images/" + tempBody.profile.avatarfull.substring(tempBody.profile.avatarfull.lastIndexOf('/') + 1, tempBody.profile.avatarfull.length);
            download(tempBody.profile.avatarfull, dir, function () {
                body = JSON.parse(body);
                body.profile.localImage = dir;
                body = JSON.stringify(body);
                res.json(body);
            });
        }
    });
};

module.exports.getWL = function (req, res) {
    request({
        "method": "GET",
        "url": config.BASE_URL + "/players/" + req.query.account_id + "/wl"
    }, function (error, requestResponse, body) {
        if (error) {
            console.log(error);
        } else {
            res.json(body);
        }
    });
};

module.exports.getTotals = function (req, res) {
    request({
        "method": "GET",
        "url": config.BASE_URL + "/players/" + req.query.account_id + "/totals"
    }, function (error, requestResponse, body) {
        if (error) {
            console.log(error);
        } else {
            res.json(body);
        }
    });
};

module.exports.getHeroes = function (req, res) {
    request({
        "method": "GET",
        "url": config.BASE_URL + "/players/" + req.query.account_id + "/heroes"
    }, function (error, requestResponse, body) {
        if (error) {
            console.log(error);
        } else {
            res.json(body);
        }
    });
};

module.exports.getPeers = function (req, res) {
    request({
        "method": "GET",
        "url": config.BASE_URL + "/players/" + req.query.account_id + "/peers"
    }, function (error, requestResponse, body) {
        if (error) {
            console.log(error);
        } else {
            res.json(body);
        }
    });
};

module.exports.listHeroes = function (req, res) {
    request({
        "method": "GET",
        "url": config.BASE_URL + "/heroes/"
    }, function (error, requestResponse, body) {
        if (error) {
            console.log(error);
        } else {
            res.json(body);
        }
    });
};

module.exports.saveStats = function (req, res) {
    mkdirp("/generated-stats/", function (error) {
        if (error) {
            console.log(error);
            res.status(200);
            res.json(error);
        }
        var base64Data = req.body.encoded_image.replace(/^data:image\/png;base64,/, "");
        var filename = "generated-stats/" + randomString.generate(90) + ".png"
        require("fs").writeFile(filename, base64Data, 'base64', function (err) {
            if (err) {
                console.log(err);
            }
        });
        var data = {
            "image_uri": host + "/" + filename
        };
        res.json(data);
    });
};
