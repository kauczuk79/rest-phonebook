(function () {
    "use strict";

    /*global angular*/

    function PhonebookShowController($scope, $http, $routeParams, $location, $log) {
        function UpdateData(response) {
            $scope.phonebookEntry = response.data;
        }

        function DownloadError(response) {
            $log.warn("Can not download phone entry");
        }

        function Edit(id) {
            $location.path("/" + id + "/edit");
        }
        var id = $routeParams.id;
        $scope.edit = Edit;
        $http.get("/phonebook-api/" + id).then(UpdateData, DownloadError);
    }

    PhonebookShowController.$inject = ["$scope", "$http", "$routeParams", "$location", "$log"];

    angular
        .module("PhonebookControllers")
        .controller("PhonebookShowController", PhonebookShowController);
}());