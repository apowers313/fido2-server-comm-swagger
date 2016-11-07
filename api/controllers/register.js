"use strict";

module.exports = {
    register: register
};

// restify middleware
function register(req, res) {
    console.log(req.swagger.params);
    console.log("!!! REGISTER");
    // variables defined in the Swagger document can be referenced using req.swagger.params.{parameter_name}
    // var name = req.swagger.params.name.value;

    // this sends back a JSON response which is a single string
    res.json("foobar");
}