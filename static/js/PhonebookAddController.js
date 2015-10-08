(function () {
    "use strict";

    var phonebookControllers = angular.module("PhonebookControllers");

    phonebookControllers.controller("PhonebookAddController", ["$scope", "$http", "$location", function ($scope, $http, $location) {
        $scope.add = function (phonebookEntry) {
            var changeLocation = function (response) {
                $location.path("/");
            };
            var printError = function (response) {
                console.log("Can not add phone entry");
            };
            $http.post("/phonebook-api", phonebookEntry, getJsonHeaders()).then(changeLocation, printError);
        };
    }]);
})();