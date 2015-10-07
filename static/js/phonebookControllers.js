var phonebookControllers = angular.module("PhonebookControllers", []),
    headers = {
        headers: {
            "Content-Type": "application/json"
        }
    };

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

phonebookControllers.controller("PhonebookAddController", ["$scope", "$http", "$location", function ($scope, $http, $location) {
    $scope.add = function (phonebookEntry) {
        $http.post("/phonebook-api", phonebookEntry, headers).success(function (data) {
            $location.path("/");
        }).error(function (data) {
            console.log("Can not add phone entry");
        });
    };
}]);

phonebookControllers.controller("PhonebookEditController", ["$scope", "$http", "$routeParams", "$location", function ($scope, $http, $routeParams, $location) {
    var id = $routeParams.id;
    $http.get("/phonebook-api/" + id).success(function (data) {
        $scope.phonebookEntry = data;
    }).error(function (data) {
        console.log("Can not download phone entry");
    });
    $scope.save = function (phonebookEntry) {
        $http.put("/phonebook-api", phonebookEntry, headers).success(function (data) {
            $location.path("/");
        }).error(function (data) {
            console.log("Can not update phone entry");
        });
    };
}]);

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