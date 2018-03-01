const request = require("request");
const config = require("../config/open-dota.config.json");
const randomString = require("randomstring");
const beautify = require("json-beautify");
const numberFormatter = require("number-formatter");
const fs = require("fs");
const PImage = require("pureimage");
const cloudinary = require("cloudinary");
const host = require("../config/prodhost.config.json").host;
const cloudinaryConfig = require("../config/cloudinary.config.json");
cloudinary.config(cloudinaryConfig);

var download = function (uri, filename, callback) {
    request.head(uri, function (err, res, body) {
        console.log('content-type:', res.headers['content-type']);
        console.log('content-length:', res.headers['content-length']);
        request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
    });
};

var heroNamer = function (playedHeroes, heroList) {
    for (i = 0; i < playedHeroes.length; i++) {
        for (j = 0; j < heroList.length; j++) {
            if (playedHeroes[i].hero_id == heroList[j].id) {
                playedHeroes[i]["localized_name"] = heroList[j].localized_name;
                break;
            }
        }
    }
    return playedHeroes;
}

var fetchStats = function (account_id) {
    const data = {
        player_info: null,
        wl_ratio: null,
        player_stats: null,
        played_heroes: null,
        hero_list: null,
        peer_list: null
    };
    const dotaStatModel = require("../router/model-router.router.js").dotaStatModel;
    return new Promise(function (resolve, reject) {
        dotaStatModel.refreshPlayerInfo(account_id).then(function (successCallback) {
            console.log(successCallback);
            return dotaStatModel.getPlayerInfo(account_id);
        }).then(function (successCallback) {
            data.player_info = JSON.parse(successCallback);
            var imageFilename = data.player_info.profile.avatarfull.substring(data.player_info.profile.avatarfull.lastIndexOf('/') + 1, data.player_info.profile.avatarfull.length);
            data.player_info.localImage = imageFilename;
            var dir = "assets/images/" + imageFilename;
            download(data.player_info.profile.avatarfull, dir, function () {});
            return dotaStatModel.getWL(account_id);
        }).then(function (successCallback) {
            data.wl_ratio = JSON.parse(successCallback);
            return dotaStatModel.getTotals(account_id);
        }).then(function (successCallback) {
            data.player_stats = JSON.parse(successCallback);
            return dotaStatModel.listPlayedHeroes(account_id);
        }).then(function (successCallback) {
            data.played_heroes = JSON.parse(successCallback).slice(0, 3);
            return dotaStatModel.listHeroes();
        }).then(function (successCallback) {
            data.hero_list = JSON.parse(successCallback);
            return dotaStatModel.listPeers(account_id);
        }).then(function (successCallback) {
            data.peer_list = JSON.parse(successCallback);
            resolve(data);
        });
    });
};

module.exports.generateImage = function (req, res) {
    var data = null;
    var filename = randomString.generate(90) + ".png"
    fetchStats(req.body.account_id).then(function (successCallback) {
        data = successCallback;
        data.played_heroes = heroNamer(data.played_heroes, data.hero_list);
        var rank = "uncalibrated.png";
        if (data.player_info.rank_tier) {
            switch (data.player_info.rank_tier.toString().substring(0, 1)) {
                case "1":
                    rank = "herald";
                    break;
                case "2":
                    rank = "guardian";
                    break;
                case "3":
                    rank = "crusader";
                    break;
                case "4":
                    rank = "archon";
                    break;
                case "5":
                    rank = "legend";
                    break;
                case "6":
                    rank = "ancient";
                    break;
                case "7":
                    rank = "divine";
                    break;
                default:
                    rank = "uncalibrated"
                    break;
            }
            rank = rank + "_" + data.player_info.rank_tier.toString().substring(2, 1) + ".png";
        }
        var robotoFont = PImage.registerFont('assets/fonts/roboto-v18-latin-300.ttf', 'Roboto');
        robotoFont.load(function () {
            var statsImage = PImage.make(600, 315);
            var context = statsImage.getContext('2d');
            context.fillStyle = '#37474F';
            context.fillRect(0, 0, 600, 350);
            context.fillStyle = "#263238";
            context.fillRect(0, 0, 139, 139);
            context.fillStyle = "#607D8B";
            context.fillRect(139, 0, 461, 34);
            context.fillStyle = "#263238";
            context.fillRect(0, 139, 600, 20);
            context.fillStyle = '#ffffff';
            context.font = "21pt 'Roboto'";
            context.fillText("STATS", 280, 156);
            context.fillText("WINS: " + data.wl_ratio.win, 350, 65);
            context.fillText("LOSE: " + data.wl_ratio.lose, 350, 95);
            context.fillText("MMR: " + data.player_info.mmr_estimate.estimate, 350, 125);
            var leftPane = 12;
            var rightPane = 325;
            var row1 = 180;
            var row2 = row1 + 25;
            var row3 = row2 + 25;
            var row4 = row3 + 25;
            var row5 = row4 + 25;
            var row6 = row5 + 25;
            context.fillText("TOTAL KILLS: " + numberFormatter("#,###.", data.player_stats[0].sum), leftPane, row1);
            context.fillText("TOTAL ASSISTS: " + numberFormatter("#,###.", data.player_stats[2].sum), rightPane, row1);
            context.fillText("AVE. KILLS: " + numberFormatter("#,###.", data.player_stats[0].sum / data.player_stats[0].n), leftPane, row2);
            context.fillText("AVE. ASSISTS: " + numberFormatter("#,###.", data.player_stats[2].sum / data.player_stats[2].n), rightPane, row2);
            context.fillText("TOTAL DEATHS: " + numberFormatter("#,###.", data.player_stats[1].sum), leftPane, row3);
            context.fillText("AVE GPM: " + numberFormatter("#,###.", data.player_stats[5].sum / data.player_stats[5].n), rightPane, row3);
            context.fillText("AVE. DEATHS: " + numberFormatter("#,###.", data.player_stats[1].sum / data.player_stats[1].n), leftPane, row4);
            context.fillText("AVE. SENTS. PER GAME: " + numberFormatter("#,###.", data.player_stats[20].sum / data.player_stats[20].n), leftPane, row5);
            context.fillText("AVE. XPM: " + numberFormatter("#,###.", data.player_stats[6].sum / data.player_stats[6].n), rightPane, row4);
            context.fillText("AVE. OBS. PER GAME: " + numberFormatter("#,###.", data.player_stats[19].sum / data.player_stats[19].n), rightPane, row5);
            context.fillText("TOP HEROES: " + data.played_heroes[0].localized_name + ", " + data.played_heroes[1].localized_name + ", " + data.played_heroes[2].localized_name, leftPane, row6);
            context.font = "30pt 'Roboto'";
            var nameAlignment = 392 - ((data.player_info.profile.personaname.length / 2) * 12)
            context.fillText(data.player_info.profile.personaname, nameAlignment, 27);
            PImage.decodeJPEGFromStream(fs.createReadStream("assets/images/" + data.player_info.localImage)).then(function (img) {
                context.drawImage(img,
                    0, 0, img.width, img.height,
                    0, 0, 139, 139
                );
                PImage.decodePNGFromStream(fs.createReadStream("assets/images/" + rank)).then(function (img) {
                    context.drawImage(img,
                        0, 0, img.width, img.height,
                        139, 34, 105, 105
                    );
                    PImage.encodePNGToStream(statsImage, fs.createWriteStream('generated-stats/' + filename)).then(function () {
                        cloudinary.uploader.upload("generated-stats/" + filename, function (result) {
                            res.json(result.url);
                        });
                    }).catch((e) => {
                        console.log(e, "there was an error writing");
                    });
                });
            });
        });
    });
};
