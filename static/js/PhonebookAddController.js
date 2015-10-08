(function () {
    "use strict";

    /*global angular*/

    function PhonebookAddController($http, $location, $log) {
        var that = this;

        function AddPhoneEntry() {
            var headers = {
                    "Content-Type": "application/json"
                },
                entry = {
                    name: that.name,
                    lastName: that.lastName,
                    number: that.number
                };

            function ChangeLocation() {
                $location.path("/");
            }

            function PrintError(response) {
                $log.warn("Can not add phone entry");
            }

            $http
                .post("/phonebook-api", entry, {
                    headers: headers
                })
                .then(ChangeLocation, PrintError);
        }
        that.add = AddPhoneEntry;
        that.name = "";
        that.lastName = "";
        that.number = "";
    }

    PhonebookAddController.$inject = ["$http", "$location", "$log"];

    angular
        .module("PhonebookControllers")
        .controller("PhonebookAddController", PhonebookAddController);
}());