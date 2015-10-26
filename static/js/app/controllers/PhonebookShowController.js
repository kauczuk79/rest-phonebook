(function () {
    'use strict';

    /*global angular*/

    function PhonebookShowController($routeParams, $location, Logger, PhonebookService) {
        var that = this;
        that.id = $routeParams.id;
        that.error = false;

        function UpdateData(response) {
            var entry = response.data;
            that.name = entry.name;
            that.lastName = entry.lastName;
            that.number = entry.number;
        }

        function DownloadError(response) {
            Logger.error('Can not download phone entry');
            that.error = true;
        }

        function Edit() {
            $location.path('/' + that.id + '/edit');
        }

        that.edit = Edit;
        PhonebookService.getOne(that.id).then(UpdateData, DownloadError);
    }

    PhonebookShowController.$inject = ['$routeParams', '$location', 'Logger', 'PhonebookService'];

    angular
        .module('app.controllers')
        .controller('PhonebookShowController', PhonebookShowController);
}());