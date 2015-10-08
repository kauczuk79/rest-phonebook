(function () {
    "use strict";

    /*global angular*/

    function PhonebookShowController($http, $routeParams, $location, $log) {
        var that = this;
        that.id = $routeParams.id;

        function UpdateData(response) {
            var entry = response.data;
            that.name = entry.name;
            that.lastName = entry.lastName;
            that.number = entry.number;
        }

        function DownloadError(response) {
            $log.warn("Can not download phone entry");
        }

        function Edit() {
            $location.path("/" + that.id + "/edit");
        }

        that.edit = Edit;
        $http.get("/phonebook-api/" + that.id).then(UpdateData, DownloadError);
    }

    PhonebookShowController.$inject = ["$http", "$routeParams", "$location", "$log"];

    angular
        .module("PhonebookControllers")
        .controller("PhonebookShowController", PhonebookShowController);
}());