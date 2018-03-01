const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = process.env.PORT || 3000;
const middlewareRouter = require("./src/server/router/middleware-router.router.js");
const controllerRouter = require("./src/server/router/controller-router.router.js");

app.use("/build", express.static(__dirname + "/build"));
app.use("/node_modules", express.static(__dirname + "/node_modules"));
app.use("/assets", express.static(__dirname + "/assets"));
app.use("/generated-stats", express.static(__dirname + "/generated-stats"));
app.use("/src/views", express.static(__dirname + "/src/views"));
app.use("/src/app", express.static(__dirname + "/src/app"));

//app.use(express.static(__dirname));

app.use(middlewareRouter.steamAuth.passport.initialize());
app.use(bodyParser.json());

app.listen(port, function () {
    console.log("Listening on port " + port + "...");
});

// POST Requests
app.post("/api/stats/generate-image", middlewareRouter.genericAuth.authenticate, controllerRouter.dotaStatController.generateImage);

// GET Requests
app.get("/api/steam/login", middlewareRouter.steamAuth.authenticate("steam"), controllerRouter.steamLoginController.steamLogin);

app.get("/api/steam/login/return", middlewareRouter.steamAuth.authenticate("steam"), controllerRouter.steamLoginController.steamLoginRedirect);

app.get("/terms-and-condition", function (req, res) {
    res.status(200);
    res.sendFile(__dirname + "/src/views/terms-and-condition.html");
});

app.get("/privacy-policy", function (req, res) {
    res.status(200);
    res.sendFile(__dirname + "/src/views/privacy-policy.html");
});

app.get("/about", function (req, res) {
    res.status(200);
    res.sendFile(__dirname + "/src/views/about.html");
});

// Web Pages
app.get("*", function (req, res) {
    res.status(200);
    res.sendFile(__dirname + "/src/views/dota-stat-generator.html");
});
