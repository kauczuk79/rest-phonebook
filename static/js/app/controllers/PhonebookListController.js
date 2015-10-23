(function () {
    'use strict';

    /*jslint nomen: true*/
    /*global angular*/

    function PhonebookListController($http, $location, Logger) {
        var that = this;
        that.error = false;
        that.list = [];

        function UpdateData(response) {
            that.list = response.data;
            that.error = false;
        }

        function DownloadError(result) {
            Logger.error('Can not get phonebook data');
            that.error = true;
        }

        function DeleteEntry(id) {
            function RemoveFromView(response) {
                function FilterById(object) {
                    return object._id === id;
                }
                var toDelete = that.list.filter(FilterById),
                    index = that.list.indexOf(toDelete[0]);
                that.list.splice(index, 1);
            }

            function DeleteError(response) {
                Logger.error('Can not delete phone entry');
            }

            /* to avoid sjlint error 'Expected an identifier and instead saw 'delete' (a reserved word)'
             * use $http['delete']() instead $http.delete */
            $http['delete']('/phonebook-api/' + id)
                .then(RemoveFromView, DeleteError);
        }

        function EditEntry(id) {
            $location.path('/' + id + '/edit');
        }

        function ShowEntry(id) {
            $location.path('/' + id);
        }
        that.deleteEntry = DeleteEntry;
        that.editEntry = EditEntry;
        that.showEntry = ShowEntry;
        $http.get('/phonebook-api').then(UpdateData, DownloadError);
        //Logger.setLogLevel(Logger.ERROR);
    }

    PhonebookListController.$inject = ['$http', '$location', 'Logger'];

    angular
        .module('app.controllers')
        .controller('PhonebookListController', PhonebookListController);
}());