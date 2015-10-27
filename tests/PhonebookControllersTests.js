/*global describe, beforeEach, module, inject, it, expect, afterEach, spyOn, readJSON, jasmine, angular */
/*jslint nomen: true */
describe('Phonebook API\'s', function () {
    'use strict';

    var mockData,
        $httpBackend,
        $location,
        mockPhonebookService,
        $q;

    // Attach modules used in tested code
    beforeEach(module('app.controllers'));
    beforeEach(module('app.logger'));
    beforeEach(module('ngRoute'));

    beforeEach(inject(function ($injector) {
        // Get instance of dependencies from $provide
        $httpBackend = $injector.get('$httpBackend');
        $location = $injector.get('$location');
        $q = $injector.get('$q');
        // Load mock data from file
        mockData = readJSON('tests/mockData.json');
        // Create spy object with given list of methods
        mockPhonebookService = jasmine.createSpyObj('PhonebookService', ['getAll', 'deleteOne', 'getOne']);
        // getAll function returns promise, which is always resolved
        mockPhonebookService.getAll.and.returnValue($q(function (resolve, reject) {
            resolve({
                data: angular.copy(mockData)
            });
        }));
        // Call fake funkcion when deleteOne was called. Fake function take the same parameter (id) like deleteOne
        mockPhonebookService.deleteOne.and.callFake(function (id) {
            // Return promise
            return $q(function (resolve, reject) {
                // If mockData contains entry with given ID, resolve promise, othervise reject it.
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
        // Call fake function when getOne was called.
        mockPhonebookService.getOne.and.callFake(function (id) {
            return $q(function (resolve, reject) {
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

    /*
     * Unit tests for PhonebookListController
     */
    describe('PhonebookListController', function () {
        var controller,
            $scope;

        beforeEach(inject(function ($injector) {
            // Get instance of dependencies from $provide
            var $rootScope = $injector.get('$rootScope'),
                $controller = $injector.get('$controller');
            // Create new scope for controller
            $scope = $rootScope.$new();
            // Create controller and inject created scope and mockPhonebookService as PhonebookService
            controller = $controller('PhonebookListController', {
                PhonebookService: mockPhonebookService,
                $scope: $scope
            });
        }));

        it('should be properly initialized', function () {
            // All functions should be initialized
            expect(controller.deleteEntry).toBeDefined();
            expect(controller.editEntry).toBeDefined();
            expect(controller.showEntry).toBeDefined();
        });

        it('should get data from PhonebookService', function () {
            // Should call PhonebookService.getAll method to receive list
            expect(mockPhonebookService.getAll).toHaveBeenCalled();
            // The promise won't be resolved until apply is called
            $scope.$apply();
            // Check controller state
            expect(controller.error).toBeFalsy();
            expect(controller.list).toEqual(mockData);
        });

        //TODO: Error handling
        it('should call delete on PhonebookService when deleteEntry was called', function () {
            var toDelete = mockData[0],
                expectedList = [mockData[1]];
            // Controller is in initial state (list is filled up, no error)
            // Delete entry with ID 0 (is at position 0 on the list)
            controller.deleteEntry(toDelete._id);
            // Call PhonebookSerive to delete entry
            expect(mockPhonebookService.deleteOne).toHaveBeenCalledWith(toDelete._id);
            // Resolve promise
            $scope.$apply();
            // List should contains only one entry: at position 0 should be phone number with ID=1 (0 was removed)
            expect(controller.list).toEqual(expectedList);
        });

        it('should handle Edit button click and redirect to edit path', function () {
            var id = mockData[0]._id;
            // Watch on method path in $location
            spyOn($location, 'path');
            // call controller's editEntry method
            controller.editEntry(id);
            // location change expected
            expect($location.path).toHaveBeenCalledWith('/' + id + '/edit');
        });

        it('should handle Show button click and redirect to edit path', function () {
            var id = mockData[0]._id;
            // Watch on method path in $location
            spyOn($location, 'path');
            // call controller's showEntry method
            controller.showEntry(id);
            // location change expected
            expect($location.path).toHaveBeenCalledWith('/' + id);
        });

    });

    /*
     * Unit tests for PhonebookShowController
     */
    describe('PhonebookShowController', function () {
        var phonebookEntry,
            createController,
            $scope;

        beforeEach(inject(function ($injector) {
            // Get instance of dependencies from $provide
            var $routeParams = $injector.get('$routeParams'),
                $controller = $injector.get('$controller'),
                $rootScope = $injector.get('$rootScope');
            // Select one entry for tests
            phonebookEntry = mockData[0];
            // Create scope
            $scope = $rootScope.$new();
            // Create constructor for controllers
            createController = function (id) {
                // Return controller with given ID and using mockPhonebookService as data source
                return $controller('PhonebookShowController', {
                    $routeParams: {
                        id: id
                    },
                    PhonebookService: mockPhonebookService
                });
            };
        }));

        it('should be properly initialized', function () {
            // Create controller
            var controller = createController(phonebookEntry._id);
            // Expect service's getOne method to have been called with parameter equals to entry ID
            expect(mockPhonebookService.getOne).toHaveBeenCalledWith(phonebookEntry._id);
            // Controller functions should be defined
            expect(controller.edit).toBeDefined();
        });

        it('should get proper data from PhonebookService', function () {
            // Create controller
            var controller = createController(phonebookEntry._id);
            // Resolve getOne promise
            $scope.$apply();
            // Expect no errors
            expect(controller.error).toBeFalsy();
            // Data in controller should match to this returned by PhonebookService
            expect(controller.id).toEqual(phonebookEntry._id);
            expect(controller.name).toEqual(phonebookEntry.name);
            expect(controller.lastName).toEqual(phonebookEntry.lastName);
            expect(controller.number).toEqual(phonebookEntry.number);
        });

        it('should handle error when wrong ID was passed', function () {
            // Create controller with ID, which is not included in mockData
            var wrongId = mockData.length,
                controller = createController(wrongId);
            // Expect service's getOne method to have been called with wrong ID as a parameter
            expect(mockPhonebookService.getOne).toHaveBeenCalledWith(wrongId);
            // Resolve getOne promisr
            $scope.$apply();
            // Controller's ID should equal to this given in $routeParams
            expect(controller.id).toEqual(wrongId);
            // Should be an error
            expect(controller.error).toBeTruthy();
            // Controller's fields should be undefined
            expect(controller.name).toBeUndefined();
            expect(controller.lastName).toBeUndefined();
            expect(controller.number).toBeUndefined();
        });

        it('should handle Edit button click and redirect to edit path', function () {
            // Create controller
            var controller = createController(phonebookEntry._id);
            // Watch on method path in $location
            spyOn($location, 'path');
            // call controller's edit method
            controller.edit();
            // location change expected
            expect($location.path).toHaveBeenCalledWith('/' + phonebookEntry._id + '/edit');
        });
    });
});