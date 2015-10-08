(function () {
    "use strict";

    /*jslint nomen: true*/
    /*global angular*/

    function PhonebookListController($http, $location, $log) {
        var that = this;

        function UpdateData(response) {
            that.list = response.data;
        }

        function DownloadError(result) {
            $log.warn("Can not get phonebook data");
        }

        function DeleteEntry(id) {
            function RemoveFromView(response) {
                function FilterById(object) {
                    return object._id === id;
                }
                var toDelete = that.list.filter(FilterById),
                    index = that.list.indexOf(toDelete);
                that.list.splice(index, 1);
            }

            function DeleteError(response) {
                $log.warn("Can not delete phone entry");
            }

            /* to avoid sjlint error "Expected an identifier and instead saw 'delete' (a reserved word)"
             * use $http['delete']() instead $http.delete */
            $http['delete']("/phonebook-api/" + id)
                .then(RemoveFromView, DeleteError);
        }

        function EditEntry(id) {
            $location.path("/" + id + "/edit");
        }

        function ShowEntry(id) {
            $location.path("/" + id);
        }
        that.deleteEntry = DeleteEntry;
        that.editEntry = EditEntry;
        that.showEntry = ShowEntry;
        $http.get("/phonebook-api").then(UpdateData, DownloadError);
    }

    PhonebookListController.$inject = ["$http", "$location", "$log"];

    angular
        .module("PhonebookControllers")
        .controller("PhonebookListController", PhonebookListController);
}());