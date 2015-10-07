var phonebookControllers = angular.module("PhonebookControllers");

phonebookControllers.controller("PhonebookShowController", ["$scope", "$http", "$routeParams", "$location", function ($scope, $http, $routeParams, $location) {
    var id = $routeParams.id;
    $scope.edit = function () {
        $location.path("/" + id + "/edit");
    }
    $http.get("/phonebook-api/" + id).success(function (data) {
        $scope.phonebookEntry = data;
    }).error(function (data) {
        console.log("Can not download phone entry");
    });
}]);