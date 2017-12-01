var express = require("express");
var bodyParser = require("body-parser");
var app = express();
var port = process.env.PORT || 3000;
var router = require("./src/server/router/express-router.js");

app.use(express.static(__dirname));
app.use(router.auth.passport.initialize());
app.use(bodyParser.json());

app.get("/api/player/get-info", router.dotaStatController.getPlayerInfo);
app.get("/api/player/get-win-lose-ratio", router.dotaStatController.getWL);
app.get("/api/player/get-stats", router.dotaStatController.getTotals);
app.get("/api/player/get-heroes", router.dotaStatController.getHeroes);
app.get("/api/player/get-peers", router.dotaStatController.getPeers);
app.get("/api/hero/list-heroes", router.dotaStatController.listHeroes);
app.post("/api/stats/save-stats", router.dotaStatController.saveStats);

app.get("/api/steam/login", router.auth.authenticate("steam"), router.steamLoginController.steamLogin);

app.get("/api/steam/login/return", router.auth.authenticate("steam"), router.steamLoginController.steamLoginRedirect);

app.get("*", function (request, response) {
    response.status(200);
    response.sendFile(__dirname + "/src/views/index.html");
});

app.listen(port, function () {
    console.log("Listening on port " + port + "...");
});
