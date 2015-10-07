var phonebookControllers = angular.module("PhonebookControllers");

phonebookControllers.controller("PhonebookAddController", ["$scope", "$http", "$location", function ($scope, $http, $location) {
    $scope.add = function (phonebookEntry) {
        $http.post("/phonebook-api", phonebookEntry, getJsonHeaders()).success(function (data) {
            $location.path("/");
        }).error(function (data) {
            console.log("Can not add phone entry");
        });
    };
}]);