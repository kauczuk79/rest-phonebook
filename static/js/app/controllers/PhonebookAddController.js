(function () {
    'use strict';

    /*global angular*/

    function PhonebookAddController($location, Logger, PhonebookService) {
        var that = this;
        that.name = '';
        that.lastName = '';
        that.number = '';

        function AddPhoneEntry() {
            var entry = {
                name: that.name,
                lastName: that.lastName,
                number: that.number
            };

            function ChangeLocation() {
                $location.path('/');
            }

            function PrintError(response) {
                Logger.error('Can not add phone entry');
            }

            PhonebookService.createOne(entry).then(ChangeLocation, PrintError);
        }
        that.add = AddPhoneEntry;
    }

    PhonebookAddController.$inject = ['$location', 'Logger', 'PhonebookService'];

    angular
        .module('app.controllers')
        .controller('PhonebookAddController', PhonebookAddController);
}());