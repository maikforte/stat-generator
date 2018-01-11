const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = process.env.PORT || 3000;
const middlewareRouter = require("./src/server/router/middleware-router.router.js");
const controllerRouter = require("./src/server/router/controller-router.router.js");

app.use(express.static(__dirname));
app.use(middlewareRouter.steamAuth.passport.initialize());
app.use(bodyParser.json());

app.listen(port, function () {
    console.log("Listening on port " + port + "...");
});

// POST Requests
app.post("/api/stats/generate-image", controllerRouter.dotaStatController.generateImage);

// GET Requests
app.get("/api/steam/login", middlewareRouter.steamAuth.authenticate("steam"), controllerRouter.steamLoginController.steamLogin);

app.get("/api/steam/login/return", middlewareRouter.steamAuth.authenticate("steam"), controllerRouter.steamLoginController.steamLoginRedirect);

// Web Pages
app.get("/*", function (request, response) {
    response.status(200);
    response.sendFile(__dirname + "/src/views/dota-stat-generator.html");
});
