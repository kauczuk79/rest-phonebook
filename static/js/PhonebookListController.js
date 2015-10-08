(function () {
    "use strict";

    /*jslint nomen: true*/
    /*global angular*/

    function PhonebookListController($scope, $http, $location, $log) {
        function UpdateData(response) {
            $scope.phonebook = response.data;
        }

        function DownloadError(result) {
            $log.warn("Can not get phonebook data");
        }

        function DeleteEntry(id) {
            function RemoveFromView(response) {
                function FilterById(object) {
                    return object._id === id;
                }
                var toDelete = $scope.phonebook.filter(FilterById),
                    index = $scope.phonebook.indexOf(toDelete);
                $scope.phonebook.splice(index, 1);
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
        $scope.deleteEntry = DeleteEntry;
        $scope.editEntry = EditEntry;
        $scope.showEntry = ShowEntry;
        $http.get("/phonebook-api").then(UpdateData, DownloadError);
    }

    PhonebookListController.$inject = ["$scope", "$http", "$location", "$log"];

    angular
        .module("PhonebookControllers")
        .controller("PhonebookListController", PhonebookListController);
}());