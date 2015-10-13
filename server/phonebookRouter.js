(function () {
    "use strict";

    /*jslint nomen: true*/
    /*global require, module*/

    var DB_ADDRESS = "mongodb://localhost:27017/phonebookDb",
        CT = "Content-Type",
        CT_JSON = "application/json",
        CT_PLAIN = "text/plain",
        express = require("express"),
        bodyParser = require("body-parser"),
        mongodb = require("mongodb"),
        status = require("http-status"),
        router = express.Router(),
        phonebookCollection = null,
        defaultFieldFilter = {};

    function InitDatabase(error, database) {
        if (error) {
            throw error;
        }
        phonebookCollection = database.collection("phonebook");
    }

    function sendResult(error, result, response, toObject) {
        if (error) {
            throw error;
        }
        if (result === null) {
            response.status(status.NOT_FOUND).header(CT, CT_PLAIN).send();
        } else {
            if (result.length > 1 || toObject) {
                response.status(status.OK).header(CT, CT_JSON).send(result);
            } else {
                response.status(status.OK).header(CT, CT_JSON).send(result[0]);
            }
        }
    }

    function queryById(id) {
        var query = {
            "_id": mongodb.ObjectID(id)
        };
        return query;
    }

    function GetPhonebookEntries(request, response) {
        var name = request.query.name,
            lastName = request.query.lastName,
            number = request.query.number,
            query = {};
        if (name !== undefined) {
            query.name = name;
        }
        if (lastName !== undefined) {
            query.lastName = lastName;
        }
        if (number !== undefined) {
            query.number = number;
        }
        phonebookCollection.find(query, defaultFieldFilter).toArray(function (error, result) {
            sendResult(error, result, response, true);
        });
    }

    function CreatePhonebookEntry(request, response) {
        phonebookCollection.insert(request.body);
        response.status(status.OK).header(CT, CT_PLAIN).send();
    }

    function ReadPhonebookEntry(request, response) {
        var id = request.params.id,
            query = queryById(id);
        phonebookCollection.find(query, defaultFieldFilter).toArray(function (error, result) {
            sendResult(error, result, response);
        });
    }

    function UpdatePhonebookEntry(request, response) {
        var json = request.body,
            query = queryById(json._id),
            data = {
                $set: {
                    name: json.name,
                    lastName: json.lastName,
                    number: json.number
                }
            };
        phonebookCollection.findOneAndUpdate(query, data, function (error, result) {
            sendResult(error, result, response);
        });
    }

    function DeletePhonebookEntry(request, response) {
        var id = request.params.id,
            query = queryById(id);
        phonebookCollection.remove(query);
        response.status(status.OK).header(CT, CT_PLAIN).send();
    }

    router.use(bodyParser.json());
    mongodb.MongoClient.connect(DB_ADDRESS, InitDatabase);

    router.get("/", GetPhonebookEntries);
    router.post("/", CreatePhonebookEntry);
    router.get("/:id", ReadPhonebookEntry);
    router.put("/", UpdatePhonebookEntry);
    router['delete']("/:id", DeletePhonebookEntry);

    module.exports = router;
}());