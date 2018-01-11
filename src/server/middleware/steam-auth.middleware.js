var passport = require("passport");
var SteamID = require('steamid');
var SteamStrategy = require("passport-steam").Strategy;
var host = require("../config/localhost.config.json").host;
var steamApiKey = '4FBE8503C9D19604FBD9A4A4BEBB2B23';

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (obj, done) {
    done(null, obj);
});

passport.use(new SteamStrategy({
        returnURL: host + "/api/steam/login/return",
        realm: host + "/",
        apiKey: steamApiKey
    },
    function (identifier, profile, done) {
        process.nextTick(function () {
            var steamID64 = identifier.substring(36, identifier.length);
            profile.identifier = (new SteamID(steamID64)).accountid;
            return done(null, profile);
        });
    }));

module.exports.passport = passport;

module.exports.authenticate = function (strategy) {
    return passport.authenticate(strategy, {
        failureRedirect: '/'
    });
};
