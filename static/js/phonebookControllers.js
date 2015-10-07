var phonebookControllers = angular.module("PhonebookControllers", []),
    headers = {
        headers: {
            "Content-Type": "application/json"
        }
    };

phonebookControllers.controller("PhonebookListController", ["$scope", "$http", "$location", function ($scope, $http, $location) {
    $scope.deleteEntry = function (id) {
        console.log(id);
        $http.delete("/phonebook-api/" + id).success(function (data) {
            var toDelete = $scope.phonebook.filter(function (object) {
                return object._id == id;
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

phonebookControllers.controller("PhonebookEditController", ["$scope", "$http", function ($scope, $http) {
    $scope.save = function (phonebookEntry) {

    }
}]);