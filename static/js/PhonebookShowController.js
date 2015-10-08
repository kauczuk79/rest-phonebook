(function () {
    "use strict";

    angular
        .module("PhonebookControllers")
        .controller("PhonebookShowController", ["$scope", "$http", "$routeParams", "$location", PhonebookShowController]);

    function PhonebookShowController($scope, $http, $routeParams, $location) {
        var id = $routeParams.id;
        var updateData = function (response) {
            $scope.phonebookEntry = response.data;
        };
        var downloadError = function (response) {
            console.log("Can not download phone entry");
        };
        $scope.edit = function () {
            $location.path("/" + id + "/edit");
        }
        $http.get("/phonebook-api/" + id).then(updateData, downloadError);
    }
})();