(function () {
    "use strict";

    angular
        .module("PhonebookControllers")
        .controller("PhonebookEditController", PhonebookEditController);

    PhonebookEditController.$inject = ["$scope", "$http", "$routeParams", "$location"];

    function PhonebookEditController($scope, $http, $routeParams, $location) {
        function UpdateData(response) {
            $scope.phonebookEntry = response.data;
        }

        function DownloadError(response) {
            console.log("Can not download phone entry");
        }

        function Save(phonebookEntry) {
            function ChangeLocation(response) {
                $location.path("/");
            }

            function UpdateError(response) {
                console.log("Can not update phone entry");
            }
            $http
                .put("/phonebook-api", phonebookEntry, getJsonHeaders())
                .then(ChangeLocation, UpdateError);
        };

        var id = $routeParams.id;
        $scope.save = Save;
        $http.get("/phonebook-api/" + id).then(UpdateData, DownloadError);
    }
})();