var phonebookControllers = angular.module("PhonebookControllers", []);

phonebookControllers.controller("PhonebookListController", ["$scope", "$http", function ($scope, $http) {
    $http.get("/phonebook-api").success(function (data) {
        $scope.phonebook = data;
    });
}]);