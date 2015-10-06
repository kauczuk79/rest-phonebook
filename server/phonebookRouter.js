"use strict";
var express = require("express"),
	bodyParser = require("body-parser"),
	status = require('http-status'),
	router = express.Router();

router.use(bodyParser.json());

router.get("/", function(request, response) {
	response.status(status.OK).header("Content-Type", "application/json").send({ name : "Name"});
});

module.exports = router;