/*global describe, beforeEach, module, inject, it, expect, afterEach, spyOn, readJSON */
describe('Phonebook API\'s', function () {
    'use strict';

    var mockData,
        $httpBackend;

    // Attach modules used in tested code
    beforeEach(module('app.services'));

    // Get instance of dependencies from $provide
    beforeEach(inject(function ($injector) {
        $httpBackend = $injector.get('$httpBackend');
        mockData = readJSON('tests/karma/mockData.json');
    }));

    /*
     * PhonebookService unit tests
     */
    describe('PhonebookService\'s', function () {
        var phonebookService;

        beforeEach(inject(function ($injector) {
            phonebookService = $injector.get('PhonebookService');
        }));

        afterEach(function () {
            // Verify that backend has not have pending requests
            $httpBackend.verifyNoOutstandingRequest();
            // Verify that backend has not have pending exceptations
            $httpBackend.verifyNoOutstandingExpectation();
        });

        it('methods should be defined', function () {
            expect(phonebookService.getAll).toBeDefined();
            expect(phonebookService.createOne).toBeDefined();
            expect(phonebookService.getOne).toBeDefined();
            expect(phonebookService.updateOne).toBeDefined();
            expect(phonebookService.deleteOne).toBeDefined();
        })

        it('getAll method should send GET request for phone list', function () {
            // Expected request to phonebook-api to download all contacts
            $httpBackend.expectGET('/phonebook-api').respond(mockData);
            // Function getAll should return promise
            phonebookService.getAll().then(function (response) {
                // Resolved promise should contain correct data
                expect(response.data).toEqual(mockData);
                expect(response.status).toEqual(200);
            });
        });

        it('createOne method should send POST request with new entry', function () {
            // Data to send
            var newData = {
                name: 'Name',
                lastName: 'Lastname',
                number: '+48 01234567891'
            };
            // Expected POST request to send data
            $httpBackend.expectPOST('/phonebook-api', newData).respond(200, 'OK');
            // Function createOne should return promise
            phonebookService.createOne(newData).then(function (response) {
                // Resolved promise should contain correct data
                expect(response.status).toEqual(200);
                expect(response.data).toEqual('OK');
            });
        });

        it('getOne method should send GET request for one entry', function () {
            // Select one entry from mock data
            var id = 0,
                getOneResponse = mockData[id];
            // Expected GET request to receive entry data
            $httpBackend.expectGET('/phonebook-api/' + id).respond(getOneResponse);
            // Function getOne should return promise
            phonebookService.getOne(id).then(function (response) {
                // Resolved promise should contain correct data
                expect(response.status).toEqual(200);
                expect(response.data).toEqual(getOneResponse);
            });
        });

        it('updateOne method should send PUT request with changed data', function () {
            // Modified data
            var modifiedData = {
                name: 'Name',
                lastName: 'Lastname',
                number: '+48 01234567891'
            };
            // Expected PUT request to update data
            $httpBackend.expectPUT('/phonebook-api', modifiedData).respond(200, 'OK');
            // Function updateOne should return promise
            phonebookService.updateOne(modifiedData).then(function (response) {
                // Resolved promise should contain correct data
                expect(response.status).toEqual(200);
                expect(response.data).toEqual('OK');
            });
        });

        it('deleteOne method should send DELETE request for one entry', function () {
            // Id of entry
            var id = 0;
            // Expected DELETE request to delete data
            $httpBackend.expectDELETE('/phonebook-api/' + id).respond(200, 'OK');
            // Function deleteOne should return promie
            phonebookService.deleteOne(id).then(function (response) {
                // Resolved promise should contain correct data
                expect(response.status).toEqual(200);
                expect(response.data).toEqual('OK');
            });
        });
    });
});