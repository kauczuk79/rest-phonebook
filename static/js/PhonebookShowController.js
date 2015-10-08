(function () {
    "use strict";

    angular
        .module("PhonebookControllers")
        .controller("PhonebookShowController", PhonebookShowController);

    PhonebookShowController.$inject = ["$scope", "$http", "$routeParams", "$location"];

    function PhonebookShowController($scope, $http, $routeParams, $location) {
        function UpdateData(response) {
            $scope.phonebookEntry = response.data;
        }

        function DownloadError(response) {
            console.log("Can not download phone entry");
        }

        function Edit() {
            $location.path("/" + id + "/edit");
        }
        var id = $routeParams.id;
        $scope.edit = Edit;
        $http.get("/phonebook-api/" + id).then(UpdateData, DownloadError);
    }
})();