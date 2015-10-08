(function () {
    "use strict";

    angular
        .module("PhonebookControllers")
        .controller("PhonebookListController", ["$scope", "$http", "$location", PhonebookListController]);

    function PhonebookListController($scope, $http, $location) {
        var updateData = function (response) {
            $scope.phonebook = response.data;
        };
        var downloadError = function (result) {
            console.log("Can not get phonebook data");
        };
        $scope.deleteEntry = function (id) {
            var removeFromView = function (response) {
                var toDelete = $scope.phonebook.filter(function (object) {
                    return object._id == id;
                });
                var index = $scope.phonebook.indexOf(toDelete);
                $scope.phonebook.splice(index, 1);
            };
            var deleteError = function (response) {
                console.log("Can not delete phone entry");
            }
            $http.delete("/phonebook-api/" + id).then(removeFromView, deleteError);
        };
        $scope.editEntry = function (id) {
            $location.path("/" + id + "/edit");
        };
        $scope.showEntry = function (id) {
            $location.path("/" + id);
        };
        $http.get("/phonebook-api").then(updateData, downloadError);
    }
})();