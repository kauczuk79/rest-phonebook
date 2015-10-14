(function () {
    "use strict";

    /*jslint nomen: true*/
    /*global angular*/

    function PhonebookEditController($http, $routeParams, $location, Logger) {
        var that = this;

        function UpdateData(response) {
            var entry = response.data;
            that.id = entry._id;
            that.name = entry.name;
            that.lastName = entry.lastName;
            that.number = entry.number;
        }

        function DownloadError(response) {
            Logger.error("Can not download phone entry");
        }

        function Save() {
            var headers = {
                    "Content-Type": "application/json"
                },
                entry = {
                    _id: that.id,
                    name: that.name,
                    lastName: that.lastName,
                    number: that.number
                };

            function ChangeLocation(response) {
                $location.path("/");
            }

            function UpdateError(response) {
                Logger.error("Can not update phone entry");
            }
            $http
                .put("/phonebook-api", entry, {
                    headers: headers
                })
                .then(ChangeLocation, UpdateError);
        }

        that.save = Save;
        $http.get("/phonebook-api/" + $routeParams.id).then(UpdateData, DownloadError);
    }

    PhonebookEditController.$inject = ["$http", "$routeParams", "$location", "Logger"];

    angular
        .module("app.controllers")
        .controller("PhonebookEditController", PhonebookEditController);

}());