(function () {
    "use strict";

    /*jslint devel: true*/
    /*global angular*/


    function PhonebookAddController($scope, $http, $location) {
        function AddPhoneEntry(phonebookEntry) {
            var headers = {
                "Content-Type": "application/json"
            };

            function ChangeLocation() {
                $location.path("/");
            }

            function PrintError(response) {
                console.log("Can not add phone entry");
            }

            $http
                .post("/phonebook-api", phonebookEntry, {
                    headers: headers
                })
                .then(ChangeLocation, PrintError);
        }

        $scope.add = AddPhoneEntry;
    }

    PhonebookAddController.$inject = ["$scope", "$http", "$location"];

    angular
        .module("PhonebookControllers")
        .controller("PhonebookAddController", PhonebookAddController);
}());