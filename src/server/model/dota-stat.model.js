var request = require("request");
var config = require("../config/open-dota.config.json");

module.exports.getPlayerInfo = function (account_id) {
    return new Promise(function (resolve, reject) {
        request({
            "method": "GET",
            "url": config.BASE_URL + "/players/" + account_id
        }, function (error, response, body) {
            if (error) {
                reject(error);
            }
            resolve(body);
        });
    });
};

module.exports.getWL = function (account_id) {
    return new Promise(function (resolve, reject) {
        request({
            "method": "GET",
            "url": config.BASE_URL + "/players/" + account_id + "/wl"
        }, function (error, response, body) {
            if (error) {
                reject(error);
            }
            resolve(body);
        });
    });
};

module.exports.getTotals = function (account_id) {
    return new Promise(function (resolve, reject) {
        request({
            "method": "GET",
            "url": config.BASE_URL + "/players/" + account_id + "/totals"
        }, function (error, response, body) {
            if (error) {
                reject(error);
            }
            resolve(body);
        });
    });
};

module.exports.listPlayedHeroes = function (account_id) {
    return new Promise(function (resolve, reject) {
        request({
            "method": "GET",
            "url": config.BASE_URL + "/players/" + account_id + "/heroes"
        }, function (error, response, body) {
            if (error) {
                reject(error);
            }
            resolve(body);
        });
    });
};

module.exports.listPeers = function (account_id) {
    return new Promise(function (resolve, reject) {
        request({
            "method": "GET",
            "url": config.BASE_URL + "/players/" + account_id + "/peers"
        }, function (error, response, body) {
            if (error) {
                reject(error);
            }
            resolve(body);
        });
    });
};

module.exports.listHeroes = function () {
    return new Promise(function (resolve, reject) {
        request({
            "method": "GET",
            "url": config.BASE_URL + "/heroes/"
        }, function (error, response, body) {
            if (error) {
                reject(error);
            }
            resolve(body);
        });
    });
};
