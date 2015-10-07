var phonebookControllers = angular.module("PhonebookControllers");

phonebookControllers.controller("PhonebookEditController", ["$scope", "$http", "$routeParams", "$location", function ($scope, $http, $routeParams, $location) {
    var id = $routeParams.id;
    var updateData = function (response) {
        $scope.phonebookEntry = response.data;
    };
    var downloadError = function (response) {
        console.log("Can not download phone entry");
    };
    $http.get("/phonebook-api/" + id).then(updateData, downloadError);
    $scope.save = function (phonebookEntry) {
        var changeLocation = function (response) {
            $location.path("/");
        };
        var updateError = function (response) {
            console.log("Can not update phone entry");
        }
        $http.put("/phonebook-api", phonebookEntry, getJsonHeaders()).then(changeLocation, updateError);
    };
}]);