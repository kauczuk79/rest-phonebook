var phonebookControllers = angular.module("PhonebookControllers");

phonebookControllers.controller("PhonebookListController", ["$scope", "$http", "$location", function ($scope, $http, $location) {
    $scope.deleteEntry = function (id) {
        $http.delete("/phonebook-api/" + id).success(function (data) {
            var toDelete = $scope.phonebook.filter(function (object) {
                return object._id == id;
            });
            var index = $scope.phonebook.indexOf(toDelete);
            $scope.phonebook.splice(index, 1);
        }).error(function (data) {
            console.log("Error" + data);
        });
    };
    $scope.editEntry = function (id) {
        $location.path("/" + id + "/edit");
    };
    $scope.showEntry = function (id) {
        $location.path("/" + id);
    }
    $http.get("/phonebook-api").success(function (data) {
        $scope.phonebook = data;
    });
}]);