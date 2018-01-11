const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = process.env.PORT || 3000;
const middlewareRouter = require("./src/server/router/middleware-router.router.js");
const controllerRouter = require("./src/server/router/controller-router.router.js");

app.use(express.static(__dirname));
app.use(middlewareRouter.steamAuth.passport.initialize());
app.use(bodyParser.json());

app.post("/api/stats/generate-image", controllerRouter.dotaStatController.generateImage);
app.get("/api/steam/login", middlewareRouter.steamAuth.authenticate("steam"), controllerRouter.steamLoginController.steamLogin);
app.get("/api/steam/login/return", middlewareRouter.steamAuth.authenticate("steam"), controllerRouter.steamLoginController.steamLoginRedirect);

app.get("/*", function (request, response) {
    response.status(200);
    response.sendFile(__dirname + "/src/views/dota-stat-generator.html");
});

app.listen(port, function () {
    console.log("Listening on port " + port + "...");

//    var request = require("request");
//    request({
//        "method": "POST",
//        "url": "http://localhost:3000/api/stats/generate-image",
//        "json": true,
//        "body": {
//            //            "account_id": 194403824
//            //            "account_id": 297626808
//            //            "account_id": 109192448
//            "account_id": 110021241
//            //            "account_id": 128219138
//        },
//        function (error, response, body) {
//            if (error) {
//                console.log(error);
//            }
//            console.log(body);
//        }
//    });
});
