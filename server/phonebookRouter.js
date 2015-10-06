"use strict";
var express = require("express"),
    bodyParser = require("body-parser"),
    status = require('http-status'),
    router = express.Router();

var mockList = [{
    name: "Name",
    lastName: "Last name",
    number: "+48 123 456 789"
        }, {
    name: "Name2",
    lastName: "LastName",
    number: "+48 456 456 789"
}];

router.use(bodyParser.json());

router.get("/", function (request, response) {
    response.status(status.OK).header("Content-Type", "application/json").send(
        mockList
    );
});

module.exports = router;