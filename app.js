"use strict";

var SwaggerRestify = require("swagger-restify-mw");
var restify = require("restify");
var app = restify.createServer();
var path = require("path");
var swaggerJSDoc = require("swagger-jsdoc");

module.exports = app;

var config = {
    appRoot: __dirname
};

SwaggerRestify.create(config, function(err, swaggerRestify) {
    if (err) {
        throw err;
    }

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

function swaggerUiInit(swaggerUrl) {
    var express = require("express");
    var path = require("path");
    var app = express();
    var exphbs = require("express-handlebars");
    app.engine("handlebars",
        exphbs({
            defaultLayout: "main"
        }));
    app.set("view engine", "handlebars");
    // TODO: port should be a configuration option
    app.set("port", 8000);
    app.use(express.static(path.join(__dirname, "swagger-ui/dist")));
    app.get("/", function(req, res) {
        res.render("index.handlebars", {layout: false, swaggerSpecUrl: swaggerUrl}); // this is the important part
    });
    app.listen(app.get("port"));
}