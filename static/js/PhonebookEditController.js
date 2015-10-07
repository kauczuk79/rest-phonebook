var phonebookControllers = angular.module("PhonebookControllers");

phonebookControllers.controller("PhonebookEditController", ["$scope", "$http", "$routeParams", "$location", function ($scope, $http, $routeParams, $location) {
    var id = $routeParams.id;
    $http.get("/phonebook-api/" + id).success(function (data) {
        $scope.phonebookEntry = data;
    }).error(function (data) {
        console.log("Can not download phone entry");
    });
    $scope.save = function (phonebookEntry) {
        $http.put("/phonebook-api", phonebookEntry, getJsonHeaders()).success(function (data) {
            $location.path("/");
        }).error(function (data) {
            console.log("Can not update phone entry");
        });
    };
}]);