var express = require("express"),
	app = express();
app.use("/phonebook", express.static("static"))
app.use("/libs/jquery", express.static("node_modules/jquery/dist"));
app.use("/libs/bootstrap", express.static("node_modules/bootstrap/dist"));

app.get("/", function(req, res) {
	res.send("hello world");
});

var server = app.listen(3000, function() {
    var host = server.address().address,
        port = server.address().port;
    console.log('Example app listening at http://%s:%s', host, port);
});