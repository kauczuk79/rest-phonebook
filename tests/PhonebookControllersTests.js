/*global describe, beforeEach, module, inject, it, expect, afterEach, spyOn */
describe('Phonebook API\'s', function () {
    'use strict';

    var mockData,
        httpBackend,
        location,
        mockPhonebookService,
        q;

    beforeEach(module('app.controllers'));
    beforeEach(module('app.logger'));
    beforeEach(module('ngRoute'));

    beforeEach(inject(function ($injector) {
        httpBackend = $injector.get('$httpBackend');
        location = $injector.get('$location');
        q = $injector.get('$q');
        mockData = readJSON('tests/mockData.json');
        mockPhonebookService = jasmine.createSpyObj('PhonebookService', ['getAll', 'deleteOne', 'getOne']);
        mockPhonebookService.getAll.and.returnValue(q(function (resolve, reject) {
            resolve({
                data: mockData
            });
        }));
        mockPhonebookService.deleteOne.and.returnValue(q(function (resolve, reject) {
            resolve({
                data: ''
            });
        }));
        mockPhonebookService.getOne.and.returnValue(q(function (resolve, reject) {
            resolve({
                data: mockData[0]
            });
        }));
    }));

    describe('PhonebookListController', function () {
        var controller,
            scope;

        beforeEach(inject(function ($rootScope, $controller) {
            scope = $rootScope.$new();
            controller = $controller('PhonebookListController', {
                PhonebookService: mockPhonebookService,
                $scope: scope
            });
        }));

        it('should be properly initialized', function () {
            expect(controller.deleteEntry).toBeDefined();
            expect(controller.editEntry).toBeDefined();
            expect(controller.showEntry).toBeDefined();
        });

        //TODO: Error handling
        it('should get data from PhonebookService', function () {
            expect(mockPhonebookService.getAll).toHaveBeenCalled();
            scope.$root.$digest();
            expect(controller.error).toBeFalsy();
            expect(controller.list).toEqual(mockData);
        });

        //TODO: Error handling
        it('should call delete on PhonebookService', function () {
            var id = mockData[0].id;
            scope.$root.$digest();
            expect(controller.list.length).toEqual(2);
            controller.deleteEntry(id);
            expect(mockPhonebookService.deleteOne).toHaveBeenCalled();
            scope.$root.$digest();
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

    describe('PhonebookShowController', function () {
        var controller,
            expectedResponse,
            scope;

        beforeEach(inject(function ($controller, $routeParams, $rootScope) {
            expectedResponse = mockData[0];
            scope = $rootScope.$new();
            controller = $controller('PhonebookShowController', {
                $routeParams: {
                    id: expectedResponse.id
                },
                PhonebookService: mockPhonebookService
            });
        }));

        it('should be properly initialized', function () {
            expect(mockPhonebookService.getOne).toHaveBeenCalledWith(expectedResponse.id);
            expect(controller.edit).toBeDefined();
        });

        //TODO: Error handling
        it('should send GET request and contain response data', function () {
            scope.$root.$digest();
            expect(controller.id).toEqual(expectedResponse.id);
            expect(controller.error).toBeFalsy();
            expect(controller.name).toEqual(expectedResponse.name);
            expect(controller.lastName).toEqual(expectedResponse.lastName);
            expect(controller.number).toEqual(expectedResponse.number);
        });

        it('should handle Edit button click and redirect to edit path', function () {
            spyOn(location, 'path');
            controller.edit();
            expect(location.path).toHaveBeenCalledWith('/' + expectedResponse.id + '/edit');
        });
    });
});