/*global describe, beforeEach, module, inject, it, expect, afterEach */
(function () {
    'use strict';
    describe('Controller: PhonebookShowController', function () {
        var expectedResponse = {
                id: 1,
                name: 'John',
                lastName: 'Smith',
                number: '+48 123456789'
            },
            httpBackend,
            location,
            scope,
            controller,
            requestEventHandler;

        beforeEach(module('app.controllers'));
        beforeEach(module('app.logger'));
        beforeEach(module('ngRoute'));

        beforeEach(inject(function ($injector) {
            var $rootScope = $injector.get('$rootScope'),
                $controller = $injector.get('$controller'),
                $routeParams = $injector.get('$routeParams');
            httpBackend = $injector.get('$httpBackend');
            location = $injector.get('$location')
            scope = $rootScope.$new();
            controller = $controller('PhonebookShowController', {
                $scope: scope,
                $routeParams: {
                    id: 1
                }
            });
            requestEventHandler = httpBackend.expectGET('/phonebook-api/1').respond(expectedResponse);
        }));

        afterEach(function () {
            httpBackend.verifyNoOutstandingExpectation();
            httpBackend.verifyNoOutstandingRequest();
        });

        it('should be properly initialized', function () {
            httpBackend.flush();
            expect(controller.edit).toBeDefined();
        });

        it('Scope should send GET request and contain response data', function () {
            httpBackend.flush();
            expect(controller.id).toEqual(expectedResponse.id);
            expect(controller.error).toBeFalsy();
            expect(controller.name).toEqual(expectedResponse.name);
            expect(controller.lastName).toEqual(expectedResponse.lastName);
            expect(controller.number).toEqual(expectedResponse.number);
        });

        it('Scope should send GET request and handle response error', function () {
            requestEventHandler.respond(401, '');
            httpBackend.flush();
            expect(controller.error).toBeTruthy();
            expect(controller.name).toEqual(undefined);
            expect(controller.lastName).toEqual(undefined);
            expect(controller.number).toEqual(undefined);
        });

        it('Edit button should redirect to edit path', function () {
            httpBackend.flush();
            spyOn(location, 'path');
            controller.edit();
            expect(location.path).toHaveBeenCalledWith('/1/edit');
        });
    });
}());