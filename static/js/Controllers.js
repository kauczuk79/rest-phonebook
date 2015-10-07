var phonebookControllers = angular.module("PhonebookControllers", []);
var getJsonHeaders = function () {
    var headers = {
        headers: {
            "Content-Type": "application/json"
        }
    };
    return headers;
};