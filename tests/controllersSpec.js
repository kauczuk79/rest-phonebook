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
            controller,
            httpBackend,
            scope;

        beforeEach(module('app.controllers'));
        beforeEach(module('app.logger'));
        beforeEach(module('ngRoute'));

        beforeEach(inject(function ($injector) {
            var $rootScope = $injector.get('$rootScope'),
                $controller = $injector.get('$controller'),
                $httpBackend = $injector.get('$httpBackend'),
                $routeParams = $injector.get('$routeParams');
            scope = $rootScope.$new();
            controller = $controller('PhonebookShowController', {
                $scope: scope,
                $routeParams: {
                    id: 1
                }
            });
            httpBackend = $httpBackend;
            httpBackend.expectGET('/phonebook-api/1').respond(expectedResponse);
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
            expect(controller.name).toEqual(expectedResponse.name);
            expect(controller.lastName).toEqual(expectedResponse.lastName);
            expect(controller.number).toEqual(expectedResponse.number);
        });
    });
}());