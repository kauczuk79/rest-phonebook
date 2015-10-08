(function () {
    "use strict";

    /*jslint devel: true*/
    /*global angular*/

    function PhonebookShowController($scope, $http, $routeParams, $location) {
        function UpdateData(response) {
            $scope.phonebookEntry = response.data;
        }

        function DownloadError(response) {
            console.log("Can not download phone entry");
        }

        function Edit(id) {
            $location.path("/" + id + "/edit");
        }
        var id = $routeParams.id;
        $scope.edit = Edit;
        $http.get("/phonebook-api/" + id).then(UpdateData, DownloadError);
    }

    PhonebookShowController.$inject = ["$scope", "$http", "$routeParams", "$location"];

    angular
        .module("PhonebookControllers")
        .controller("PhonebookShowController", PhonebookShowController);
}());