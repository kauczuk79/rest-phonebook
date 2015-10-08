(function () {
    "use strict";

    angular
        .module("PhonebookControllers")
        .controller("PhonebookListController", PhonebookListController);

    PhonebookListController.$inject = ["$scope", "$http", "$location"];

    function PhonebookListController($scope, $http, $location) {
        function UpdateData(response) {
            $scope.phonebook = response.data;
        }

        function DownloadError(result) {
            console.log("Can not get phonebook data");
        }

        function DeleteEntry(id) {
            function RemoveFromView(response) {
                function FilterById(object) {
                    return object._id == id;
                }
                var toDelete = $scope.phonebook.filter(FilterById),
                    index = $scope.phonebook.indexOf(toDelete);
                $scope.phonebook.splice(index, 1);
            }

            function DeleteError(response) {
                console.log("Can not delete phone entry");
            }

            $http.delete("/phonebook-api/" + id).then(RemoveFromView, DeleteError);
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
})();