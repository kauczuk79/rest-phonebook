(function () {
    'use strict';

    /*jslint nomen: true*/
    /*global angular*/

    function PhonebookListController($location, Logger, PhonebookService) {
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

            PhonebookService.deleteOne(id).then(RemoveFromView, DeleteError);
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
        PhonebookService.getAll().then(UpdateData, DownloadError);
        Logger.setLogLevel(Logger.DEBUG);
    }

    PhonebookListController.$inject = ['$location', 'Logger', 'PhonebookService'];

    angular
        .module('app.controllers')
        .controller('PhonebookListController', PhonebookListController);
}());