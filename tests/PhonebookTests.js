/*global describe, beforeEach, module, inject, it, expect, afterEach, spyOn */
describe('Phonebook API\'s', function () {
    'use strict';

    var mockData = [{
            id: 0,
            name: 'Grzegorz',
            lastName: 'Brzeczyszczykiewicz',
            number: '+48 321654987'
        }, {
            id: 1,
            name: 'John',
            lastName: 'Smith',
            number: '+48 123456789'
        }],
        httpBackend,
        location;

    beforeEach(module('app.controllers'));
    beforeEach(module('app.services'));
    beforeEach(module('app.logger'));
    beforeEach(module('ngRoute'));

    beforeEach(inject(function ($injector) {
        httpBackend = $injector.get('$httpBackend');
        location = $injector.get('$location');
    }));

    describe('PhonebookListController', function () {
        var expectedResponse = mockData,
            controller;
        beforeEach(inject(function ($injector) {
            var $controller = $injector.get('$controller');
            controller = $controller('PhonebookListController');
        }));

        afterEach(function () {
            httpBackend.verifyNoOutstandingRequest();
        });

        it('should be properly initialized', function () {
            expect(controller.deleteEntry).toBeDefined();
            expect(controller.editEntry).toBeDefined();
            expect(controller.showEntry).toBeDefined();
        });

        it('should send GET request and handle response', function () {
            var requestEventHandler = httpBackend.expectGET('/phonebook-api').respond(expectedResponse);
            httpBackend.flush();
            expect(controller.error).toBeFalsy();
            expect(controller.list).toEqual(expectedResponse);
            httpBackend.verifyNoOutstandingExpectation();
        });

        it('should send GET request and handle response error', function () {
            var requestEventHandler = httpBackend.expectGET('/phonebook-api').respond(401, '');
            httpBackend.flush();
            expect(controller.error).toBeTruthy();
            httpBackend.verifyNoOutstandingExpectation();
        });

        it('should handle Edit button click and redirect to edit path', function () {
            var id = expectedResponse[0].id;
            spyOn(location, 'path');
            controller.editEntry(id);
            expect(location.path).toHaveBeenCalledWith('/' + id + '/edit');
        });

        it('should handle Show button click and redirect to edit path', function () {
            var id = expectedResponse[0].id;
            spyOn(location, 'path');
            controller.showEntry(id);
            expect(location.path).toHaveBeenCalledWith('/' + id);
        });

        it('should properly delete item by Delete button click', function () {
            var id = expectedResponse[0].id,
                requestEventHandler = httpBackend.expectGET('/phonebook-api').respond(expectedResponse),
                lengthBefore,
                lengthAfter;
            httpBackend.flush();
            lengthBefore = controller.list.length;
            requestEventHandler = httpBackend.expectDELETE('/phonebook-api/' + id).respond('');
            controller.deleteEntry(id);
            httpBackend.flush();
            lengthAfter = controller.list.length;
            expect(lengthBefore).toEqual(2);
            expect(lengthAfter).toEqual(1);
            httpBackend.verifyNoOutstandingExpectation();
        });

        it('should not delete item by Delete button click when request error appears', function () {
            var id = expectedResponse[0].id,
                requestEventHandler = httpBackend.expectGET('/phonebook-api').respond(expectedResponse),
                lengthBefore,
                lengthAfter;
            httpBackend.flush();
            lengthBefore = controller.list.length;
            requestEventHandler = httpBackend.expectDELETE('/phonebook-api/' + id).respond(401, '');
            controller.deleteEntry(id);
            httpBackend.flush();
            lengthAfter = controller.list.length;
            expect(lengthBefore).toEqual(lengthAfter);
            httpBackend.verifyNoOutstandingExpectation();
        });
    });

    describe('PhonebookShowController', function () {
        var expectedResponse = mockData[1],
            controller;

        beforeEach(inject(function ($injector) {
            var $controller = $injector.get('$controller'),
                $routeParams = $injector.get('$routeParams');
            controller = $controller('PhonebookShowController', {
                $routeParams: {
                    id: expectedResponse.id
                }
            });
        }));

        afterEach(function () {
            httpBackend.verifyNoOutstandingRequest();
        });

        it('should be properly initialized', function () {
            expect(controller.edit).toBeDefined();
        });

        it('should send GET request and contain response data', function () {
            var requestEventHandler = httpBackend.expectGET('/phonebook-api/' + expectedResponse.id).respond(expectedResponse);
            httpBackend.flush();
            expect(controller.id).toEqual(expectedResponse.id);
            expect(controller.error).toBeFalsy();
            expect(controller.name).toEqual(expectedResponse.name);
            expect(controller.lastName).toEqual(expectedResponse.lastName);
            expect(controller.number).toEqual(expectedResponse.number);
            httpBackend.verifyNoOutstandingExpectation();
        });

        it('should send GET request and handle response error', function () {
            var requestEventHandler = httpBackend.expectGET('/phonebook-api/' + expectedResponse.id).respond(401, '');
            httpBackend.flush();
            expect(controller.error).toBeTruthy();
            expect(controller.name).toBeUndefined();
            expect(controller.lastName).toBeUndefined();
            expect(controller.number).toBeUndefined();
            httpBackend.verifyNoOutstandingExpectation();
        });

        it('should handle Edit button click and redirect to edit path', function () {
            spyOn(location, 'path');
            controller.edit();
            expect(location.path).toHaveBeenCalledWith('/' + expectedResponse.id + '/edit');
        });
    });
});