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
        var controller,
            mockPhonebookService,
            $scope;

        beforeEach(function () {
            mockPhonebookService = jasmine.createSpyObj('PhonebookService', ['getAll', 'deleteOne']);
            inject(function ($rootScope, $controller, $q, _$timeout_) {
                $scope = $rootScope.$new();
                mockPhonebookService.getAll.and.returnValue($q(function (resolve, reject) {
                    resolve({
                        data: mockData
                    });
                }));
                mockPhonebookService.deleteOne.and.returnValue($q(function (resolve, reject) {
                    resolve({
                        data: ''
                    });
                }));
                controller = $controller('PhonebookListController', {
                    PhonebookService: mockPhonebookService,
                    $scope: $scope
                });
            });
        });

        it('should be properly initialized', function () {
            expect(controller.deleteEntry).toBeDefined();
            expect(controller.editEntry).toBeDefined();
            expect(controller.showEntry).toBeDefined();
        });

        //TODO: Error handling
        it('should get data from PhonebookService', function () {
            expect(controller.error).toBeFalsy();
            expect(mockPhonebookService.getAll).toHaveBeenCalled();
            $scope.$apply();
            expect(controller.list).toEqual(mockData);
        });

        //TODO: Error handling
        it('should call delete on PhonebookService', function () {
            var id = mockData[0].id;
            $scope.$apply();
            expect(controller.list.length).toEqual(2);
            controller.deleteEntry(id);
            expect(mockPhonebookService.deleteOne).toHaveBeenCalled();
            $scope.$apply();
            expect(controller.list.length).toEqual(1);
        });

        it('should handle Edit button click and redirect to edit path', function () {
            var id = mockData[0].id;
            spyOn(location, 'path');
            controller.editEntry(id);
            expect(location.path).toHaveBeenCalledWith('/' + id + '/edit');
        });

        it('should handle Show button click and redirect to edit path', function () {
            var id = mockData[0].id;
            spyOn(location, 'path');
            controller.showEntry(id);
            expect(location.path).toHaveBeenCalledWith('/' + id);
        });

    });

    /*

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
        */
});