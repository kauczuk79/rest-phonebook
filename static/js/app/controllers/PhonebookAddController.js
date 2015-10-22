(function () {
    'use strict';

    /*global angular*/

    function PhonebookAddController($http, $location, Logger) {
        var that = this;
        that.name = '';
        that.lastName = '';
        that.number = '';

        function AddPhoneEntry() {
            var headers = {
                    'Content-Type': 'application/json'
                },
                entry = {
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

            $http
                .post('/phonebook-api', entry, {
                    headers: headers
                })
                .then(ChangeLocation, PrintError);
        }
        that.add = AddPhoneEntry;
    }

    PhonebookAddController.$inject = ['$http', '$location', 'Logger'];

    angular
        .module('app.controllers')
        .controller('PhonebookAddController', PhonebookAddController);
}());