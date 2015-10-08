(function () {
    "use strict";

    /*global angular*/

    function PhonebookAddController($scope, $http, $location, $log) {
        function AddPhoneEntry(phonebookEntry) {
            var headers = {
                "Content-Type": "application/json"
            };

            function ChangeLocation() {
                $location.path("/");
            }

            function PrintError(response) {
                $log.warn("Can not add phone entry");
            }

            $http
                .post("/phonebook-api", phonebookEntry, {
                    headers: headers
                })
                .then(ChangeLocation, PrintError);
        }

        $scope.add = AddPhoneEntry;
    }

    PhonebookAddController.$inject = ["$scope", "$http", "$location", "$log"];

    angular
        .module("PhonebookControllers")
        .controller("PhonebookAddController", PhonebookAddController);
}());