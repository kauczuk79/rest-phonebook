"use strict";
var express = require("express"),
	phonebookRouter = require("./server/phonebookRouter"),
	app = express();

app.use("/phonebook-api", phonebookRouter);

app.use("/phonebook", express.static("static"))
app.use("/libs/jquery", express.static("node_modules/jquery/dist"));
app.use("/libs/bootstrap", express.static("node_modules/bootstrap/dist"));

var server = app.listen(3000, function() {
    var host = server.address().address,
        port = server.address().port;
    console.log('Example app listening at http://%s:%s', host, port);
});