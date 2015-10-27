/*global describe, beforeEach, module, inject, it, expect, afterEach, spyOn, readJSON, jasmine */
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
        mockPhonebookService.deleteOne.and.callFake(function (id) {
            return q(function (resolve, reject) {
                if (mockData[id] !== undefined) {
                    resolve({
                        status: 200
                    });
                } else {
                    reject({
                        status: 404
                    });
                }
            });
        });
        mockPhonebookService.getOne.and.callFake(function (id) {
            return q(function (resolve, reject) {
                if (mockData[id] !== undefined) {
                    resolve({
                        data: mockData[id]
                    });
                } else {
                    reject({
                        data: '',
                        status: 404
                    });
                }
            });
        });
    }));

    describe('PhonebookListController', function () {
        var controller,
            scope;

        beforeEach(inject(function ($injector) {

            scope = $injector.get('$rootScope').$new();
            controller = $injector.get('$controller')('PhonebookListController', {
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
        var expectedResponse,
            createController,
            scope;

        beforeEach(inject(function ($controller, $routeParams, $rootScope) {
            expectedResponse = mockData[0];
            scope = $rootScope.$new();
            createController = function (id) {
                return $controller('PhonebookShowController', {
                    $routeParams: {
                        id: id
                    },
                    PhonebookService: mockPhonebookService
                });
            };
        }));

        it('should be properly initialized', function () {
            var controller = createController(expectedResponse.id);
            expect(mockPhonebookService.getOne).toHaveBeenCalledWith(expectedResponse.id);
            expect(controller.edit).toBeDefined();
        });

        it('should get proper data from PhonebookService', function () {
            var controller = createController(expectedResponse.id);
            scope.$root.$digest();
            expect(controller.id).toEqual(expectedResponse.id);
            expect(controller.error).toBeFalsy();
            expect(controller.name).toEqual(expectedResponse.name);
            expect(controller.lastName).toEqual(expectedResponse.lastName);
            expect(controller.number).toEqual(expectedResponse.number);
        });

        it('should send GET request and contain response data', function () {
            var wrongId = mockData.length,
                controller = createController(wrongId);
            expect(mockPhonebookService.getOne).toHaveBeenCalledWith(wrongId);
            scope.$root.$digest();
            expect(controller.id).toEqual(wrongId);
            expect(controller.error).toBeTruthy();
            expect(controller.name).toBeUndefined();
            expect(controller.lastName).toBeUndefined();
            expect(controller.number).toBeUndefined();
        });

        it('should handle Edit button click and redirect to edit path', function () {
            var controller = createController(expectedResponse.id);
            spyOn(location, 'path');
            controller.edit();
            expect(location.path).toHaveBeenCalledWith('/' + expectedResponse.id + '/edit');
        });
    });
});