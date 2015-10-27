/*global describe, beforeEach, module, inject, it, expect, afterEach, spyOn */
describe('Phonebook API\'s', function () {
    'use strict';

    var mockData,
        httpBackend;

    beforeEach(module('app.services'));
    beforeEach(inject(function ($injector) {
        httpBackend = $injector.get('$httpBackend');
        mockData = readJSON('tests/mockData.json');
    }));

    describe('PhonebookService\'s', function () {
        var phonebookService;

        beforeEach(inject(function ($injector) {
            phonebookService = $injector.get('PhonebookService');
        }));

        afterEach(function () {
            httpBackend.verifyNoOutstandingRequest();
            httpBackend.verifyNoOutstandingExpectation();
        });

        it('getAll method should send GET request for phone list', function () {
            var getAllResponse = mockData;
            httpBackend.expectGET('/phonebook-api').respond(getAllResponse);
            phonebookService.getAll().then(function (response) {
                expect(response.data).toEqual(getAllResponse);
            });
            httpBackend.flush();
        });

        it('createOne method should send POST request with new entry', function () {
            var newData = {
                name: 'Name',
                lastName: 'Lastname',
                number: '+48 01234567891'
            };
            httpBackend.expectPOST('/phonebook-api', newData).respond(200, '');
            phonebookService.createOne(newData).then(function (response) {
                expect(response.status).toEqual(200);
            });
            httpBackend.flush();
        });

        it('getOne method should send GET request for one entry', function () {
            var id = 0,
                getOneResponse = mockData[id];
            httpBackend.expectGET('/phonebook-api/' + id).respond(getOneResponse);
            phonebookService.getOne(id).then(function (response) {
                expect(response.data).toEqual(getOneResponse);
            });
            httpBackend.flush();
        });

        it('updateOne method should send PUT request with changed data', function () {
            var newData = {
                name: 'Name',
                lastName: 'Lastname',
                number: '+48 01234567891'
            };
            httpBackend.expectPUT('/phonebook-api', newData).respond(200, '');
            phonebookService.updateOne(newData).then(function (response) {
                expect(response.status).toEqual(200);
            });
            httpBackend.flush();
        });

        it('deleteOne method should send DELETE request for one entry', function () {
            var id = 0;
            httpBackend.expectDELETE('/phonebook-api/' + id).respond(200, '');
            phonebookService.deleteOne(id).then(function (response) {
                expect(response.status).toEqual(200);
            });
            httpBackend.flush();
        });
    });
});