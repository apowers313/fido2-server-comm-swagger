"use strict";

var SwaggerRestify = require("swagger-restify-mw");
var restify = require("restify");
var app = restify.createServer();

module.exports = app;

var config = {
    appRoot: __dirname
};

SwaggerRestify.create(config, function(err, swaggerRestify) {
    if (err) {
        throw err;
    }

    // restify's default CORS settings are Accept *
    // TODO: this should be configurable
    app.use(restify.CORS());

    swaggerRestify.register(app);

    // if the hostname / port is defined in the swagger config, grab it here
    // console.log (require("util").inspect(swaggerRestify, {depth: null}));
    // console.log (require("util").inspect(swaggerRestify.runner.swagger, {depth: null}));

    var swaggerPort = swaggerRestify.runner.swagger.host && swaggerRestify.runner.swagger.host.split(":")[1];
    console.log(swaggerPort);
    var port = swaggerPort || process.env.PORT || 0xF1D0;
    app.listen(port);

    // console.log (require("util").inspect(swaggerRestify, {depth: null}));
    // console.log(swaggerRestify.runner.swagger.host);
    var apiBase = `http://localhost:${port}${swaggerRestify.runner.swagger.basePath}`;
    console.log(`try this:\ncurl -H "Content-Type: application/json" -X POST -d "{"header":"xyz","challenge":"xyz"}" ${apiBase}`);

    // setup Swagger UI
    swaggerUiInit(apiBase + "/swagger");
});

// TODO: might be able to replace this with swagger-ui from swagger-tools:
// https://github.com/apigee-127/swagger-tools/blob/master/middleware/swagger-ui.js
// UI object is available at swaggerRestify.runner.swaggerTools.swaggerUi
function swaggerUiInit(swaggerUrl) {
    var express = require("express");
    var path = require("path");
    var eApp = express();
    var exphbs = require("express-handlebars");
    eApp.engine("handlebars",
        exphbs({
            defaultLayout: "main"
        }));
    var distdir = path.join(__dirname, "swagger-ui/dist");
    eApp.set("views", distdir);
    eApp.set("view engine", "handlebars");
    // TODO: port should be a configuration option
    eApp.set("port", 8000);
    eApp.use(express.static(distdir));
    eApp.get("/", function(req, res) {
        res.render("index.handlebars", {
            layout: false,
            swaggerSpecUrl: swaggerUrl,
            docExpansion: "list"
        }); // this is the important part
    });
    eApp.listen(eApp.get("port"));
    console.log("Swagger UI running:", swaggerUrl);
}