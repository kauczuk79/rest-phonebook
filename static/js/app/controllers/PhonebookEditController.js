(function () {
    'use strict';

    /*jslint nomen: true*/
    /*global angular*/

    function PhonebookEditController($routeParams, $location, Logger, PhonebookService) {
        var that = this;

        function UpdateData(response) {
            var entry = response.data;
            that.id = entry._id;
            that.name = entry.name;
            that.lastName = entry.lastName;
            that.number = entry.number;
        }

        function DownloadError(response) {
            Logger.error('Can not download phone entry');
        }

        function Save() {
            var entry = {
                _id: that.id,
                name: that.name,
                lastName: that.lastName,
                number: that.number
            };

            function ChangeLocation(response) {
                $location.path('/');
            }

            function UpdateError(response) {
                Logger.error('Can not update phone entry');
            }
            PhonebookService.updateOne(entry).then(ChangeLocation, UpdateError);
        }

        that.save = Save;
        PhonebookService.getOne($routeParams.id).then(UpdateData, DownloadError);
    }

    PhonebookEditController.$inject = ['$routeParams', '$location', 'Logger', 'PhonebookService'];

    angular
        .module('app.controllers')
        .controller('PhonebookEditController', PhonebookEditController);

}());