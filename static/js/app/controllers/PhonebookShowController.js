(function () {
    'use strict';

    /*global angular*/

    function PhonebookShowController($http, $routeParams, $location, Logger) {
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
        $http.get('/phonebook-api/' + that.id).then(UpdateData, DownloadError);
    }

    PhonebookShowController.$inject = ['$http', '$routeParams', '$location', 'Logger'];

    angular
        .module('app.controllers')
        .controller('PhonebookShowController', PhonebookShowController);
}());