(function () {
    "use strict";

    angular
        .module("PhonebookControllers")
        .controller("PhonebookAddController", PhonebookAddController);

    PhonebookAddController.$inject = ["$scope", "$http", "$location"];

    function PhonebookAddController($scope, $http, $location) {
        function AddPhoneEntry(phonebookEntry) {
            function ChangeLocation() {
                $location.path("/");
            }

            function PrintError(response) {
                console.log("Can not add phone entry");
            }

            $http
                .post("/phonebook-api", phonebookEntry, getJsonHeaders())
                .then(ChangeLocation, PrintError);
        }

        $scope.add = AddPhoneEntry;
    }
})();