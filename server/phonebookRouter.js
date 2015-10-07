"use strict";
var express = require("express"),
    bodyParser = require("body-parser"),
    mongodb = require("mongodb"),
    status = require("http-status"),
    phonebookCollection = null,
    router = express.Router(),
    defaultFieldFilter = {
        _id: 0
    };



router.use(bodyParser.json());

mongodb.MongoClient.connect("mongodb://localhost:27017/studentsDb", function (error, db) {
    if (error) throw error;
    phonebookCollection = db.collection("phonebook");
});

router.get("/", function (request, response) {
    phonebookCollection.find({}, defaultFieldFilter).toArray(function (error, collection) {
        if (error) throw error;
        response.status(status.OK).header("Content-Type", "application/json").send(collection);
    });
});

router.post("/", function (request, response) {
    phonebookCollection.insert(request.body);
    response.status(status.OK).header("Content-Type", "text/plain").send();
});

router.delete("/:number", function (request, response) {
    var number = request.params.number,
        query = {
            number: number
        };
    phonebookCollection.remove(query);
    response.status(status.OK).header("Content-Type", "text/plain").send();
});

router.get("/dataAdd", function (request, response) {
    var mockList = [{
        name: "John",
        lastName: "Smith",
        number: "+48 123 456 789"
        }, {
        name: "Adam",
        lastName: "Smith",
        number: "+48 456 456 789"
    }];
    phonebookCollection.insert(mockList[0]);
    phonebookCollection.insert(mockList[1]);
    response.status(status.OK).header("Content-Type", "text/plain").send("Added " + mockList.length + " rows");
});

router.get("/eraseDatabase", function (request, response) {
    phonebookCollection.remove({});
    response.status(status.OK).header("Content-Type", "text/plain").send("Removed succesfully");
});


module.exports = router;