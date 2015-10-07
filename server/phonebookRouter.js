"use strict";
var express = require("express"),
    bodyParser = require("body-parser"),
    mongodb = require("mongodb"),

    status = require("http-status"),
    phonebookCollection = null,
    router = express.Router(),
    defaultFieldFilter = {};

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

router.delete("/:id", function (request, response) {
    var id = request.params.id,
        query = {
            "_id": mongodb.ObjectID(id)
        };
    phonebookCollection.remove(query);
    response.status(status.OK).header("Content-Type", "text/plain").send();
});

router.put("/", function (request, response) {
    var json = request.body,
        query = {
            "_id": mongodb.ObjectID(json._id)
        },
        data = {
            $set: {
                name: json.name,
                lastName: json.lastName,
                number: json.number
            }
        };
    phonebookCollection.findOneAndUpdate(query, data, function (error, result) {
        if (error) throw error;
        if (result == null) {
            response.status(status.NOT_FOUND).header("Content-Type", "text/plain").send();
        } else {
            response.status(status.OK).header("Content-Type", "text/plain").send();
        }
    });
});

router.get("/:id", function (request, response) {
    var id = request.params.id,
        query = {
            "_id": mongodb.ObjectID(id)
        };
    phonebookCollection.find(query, defaultFieldFilter).toArray(function (error, collection) {
        if (error) throw error;
        response.status(status.OK).header("Content-Type", "application/json").send(collection[0]);
    });
});

module.exports = router;