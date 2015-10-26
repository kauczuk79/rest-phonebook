/*global angular*/

(function () {
    'use strict';

    var headers = {
        'Content-Type': 'application/json'
    };

    function PhonebookService($http) {

        function getAll() {
            return $http.get('/phonebook-api');
        }

        function getOne(id) {
            return $http.get('/phonebook-api/' + id);
        }

        function deleteOne(id) {
            /* to avoid sjlint error 'Expected an identifier and instead saw 'delete' (a reserved word)'
             * use $http['delete']() instead $http.delete */
            return $http['delete']('/phonebook-api/' + id);
        }

        function createOne(entry) {
            return $http.post('/phonebook-api', entry, {
                headers: headers
            });
        }

        function updateOne(entry) {
            return $http.put('/phonebook-api', entry, {
                headers: headers
            });
        }

        var service = {
            getAll: getAll,
            createOne: createOne,
            getOne: getOne,
            updateOne: updateOne,
            deleteOne: deleteOne
        };

        return service;
    }

    PhonebookService.$inject = ['$http'];

    angular
        .module('app.services', [])
        .factory('PhonebookService', PhonebookService);
}());