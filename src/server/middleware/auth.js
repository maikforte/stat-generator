var passport = require("passport");
var SteamID = require('steamid');
var SteamStrategy = require("passport-steam").Strategy;

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (obj, done) {
    done(null, obj);
});

passport.use(new SteamStrategy({
        returnURL: 'http://localhost:3000/api/steam/login/return',
        realm: 'http://localhost:3000/',
        apiKey: '4FBE8503C9D19604FBD9A4A4BEBB2B23'
    },
    function (identifier, profile, done) {
        process.nextTick(function () {
            var steamID64 = identifier.substring(36, identifier.length);
            profile.identifier = (new SteamID(steamID64)).accountid;
            //            profile.identifier = identifier.substring(36, identifier.length);
            return done(null, profile);
        });
    }));

module.exports.passport = passport;

module.exports.authenticate = function (strategy) {
    return passport.authenticate(strategy, {
        failureRedirect: '/'
    });
};
