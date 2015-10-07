var phonebookControllers = angular.module("PhonebookControllers", []),
    headers = {
        headers: {
            "Content-Type": "application/json"
        }
    };

phonebookControllers.controller("PhonebookListController", ["$scope", "$http", "$location", function ($scope, $http, $location) {
    $scope.deleteEntry = function (number) {
        $http.delete("/phonebook-api/" + number).success(function (data) {
            var toDelete = $scope.phonebook.filter(function (object) {
                return object.number == number;
            });
            var index = $scope.phonebook.indexOf(toDelete);
            $scope.phonebook.splice(index, 1);
        }).error(function (data) {
            console.log("Error" + data);
        });
    }
    $http.get("/phonebook-api").success(function (data) {
        $scope.phonebook = data;
    });
}]);

phonebookControllers.controller("PhonebookAddController", ["$scope", "$http", "$location", function ($scope, $http, $location) {
    $scope.add = function (phonebookEntry) {
        $http.post("/phonebook-api", phonebookEntry, headers).
        success(function (data) {
            $location.path("/");
        }).
        error(function (data) {
            console.log("Can not add phone entry");
        });
    }
}]);