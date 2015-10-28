/*global describe, beforeEach, module, inject, it, expect, afterEach, spyOn, readJSON, jasmine, angular */
/*jslint nomen: true */
describe('Phonebook API\'s', function () {
    'use strict';

    var mockData,
        $location,
        mockPhonebookService,
        $q;

    // Attach modules used in tested code
    beforeEach(module('app.controllers'));
    beforeEach(module('app.logger'));
    beforeEach(module('ngRoute'));

    beforeEach(inject(function ($injector) {
        // Get instance of dependencies from $provide
        $location = $injector.get('$location');
        $q = $injector.get('$q');
        // Load mock data from file
        mockData = readJSON('tests/karma/mockData.json');
        // Create spy object with given list of methods
        mockPhonebookService = jasmine.createSpyObj('PhonebookService', ['getAll', 'deleteOne', 'getOne', 'updateOne', 'createOne']);
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
                // If mockData does not contain entry with given ID, reject it ...
                if (mockData[id] === undefined) {
                    reject({
                        status: 404
                    });
                }
                // ... otherwise resolve it
                resolve({
                    status: 200
                });
            });
        });
        // Call fake function when getOne was called.
        mockPhonebookService.getOne.and.callFake(function (id) {
            return $q(function (resolve, reject) {
                if (mockData[id] === undefined) {
                    reject({
                        data: '',
                        status: 404
                    });
                }
                resolve({
                    data: mockData[id]
                });
            });
        });
        mockPhonebookService.updateOne.and.callFake(function (data) {
            return $q(function (resolve, reject) {
                if ((data._id === undefined) || (data.name === undefined) || (data.lastName === undefined) || (data.number === undefined)) {
                    reject({
                        status: 404
                    });
                }
                resolve({
                    status: 200
                });
            });
        });
        mockPhonebookService.createOne.and.callFake(function (data) {
            return $q(function (resolve, reject) {
                if ((data.name === undefined) || (data.name === '') || (data.lastName === undefined) || (data.lastName === '') || (data.number === undefined) || (data.number === '')) {
                    reject({
                        status: 404
                    });
                }
                resolve({
                    status: 200
                });
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
            // Create controller and inject mockPhonebookService as PhonebookService
            controller = $controller('PhonebookListController', {
                PhonebookService: mockPhonebookService
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
            var $controller = $injector.get('$controller'),
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

    /*
     * Unit tests for PhonebookEditController
     */
    describe('PhonebookEditController', function () {

        var phonebookEntry,
            $scope,
            createController;

        beforeEach(inject(function ($injector) {
            // Get instance of dependencies from $provide
            var $controller = $injector.get('$controller'),
                $rootScope = $injector.get('$rootScope');
            // Select one entry for tests
            phonebookEntry = mockData[0];
            // Create scope
            $scope = $rootScope.$new();
            // Create constructor for controllers
            createController = function (id) {
                // Return controller with given ID and using mockPhonebookService as data source
                return $controller('PhonebookEditController', {
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
            expect(controller.save).toBeDefined();
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
            // Resolve getOne promise
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

        it('should handle Save button click, call update method on service and redirect to main view', function () {
            // Create controller
            var controller = createController(phonebookEntry._id);
            $scope.$apply();
            // Watch on method path in $location
            spyOn($location, 'path');
            // Call controller's edit method
            controller.save();
            // Service's updateOne method should be called with proper parameter
            expect(mockPhonebookService.updateOne).toHaveBeenCalledWith({
                _id: controller.id,
                name: controller.name,
                lastName: controller.lastName,
                number: controller.number
            });
            // Resolve updateOne promise
            $scope.$apply();
            // location change expected
            expect($location.path).toHaveBeenCalledWith('/');
        });
    });

    /*
     * Unit tests for PhonebookAddController
     */
    describe('PhonebookAddController', function () {
        var controller,
            $scope;

        beforeEach(inject(function ($injector) {
            // Get instance of dependencies from $provide
            var $controller = $injector.get('$controller'),
                $rootScope = $injector.get('$rootScope');
            // Create scope
            $scope = $rootScope.$new();
            // Create controller and inject mockPhonebookService as PhonebookService
            controller = $controller('PhonebookAddController', {
                PhonebookService: mockPhonebookService
            });
        }));

        it('should be properly initialized', function () {
            // Functions should be defined
            expect(controller.add).toBeDefined();
            // No error expected
            expect(controller.error).toBeFalsy();
            // Empty entry data fields
            expect(controller.name).toEqual('');
            expect(controller.lastName).toEqual('');
            expect(controller.number).toEqual('');
        });

        it('should save controller\'s data using createOne method on PhonebookService and redirect to main view', function () {
            // Simulate change of scope variables
            controller.name = 'Name';
            controller.lastName = 'Surname';
            controller.number = '+12 123456789';
            // Watch on method path in $location
            spyOn($location, 'path');
            // Add data
            controller.add();
            // Should call createOne method on PhonebookService with proper data
            expect(mockPhonebookService.createOne).toHaveBeenCalledWith({
                name: controller.name,
                lastName: controller.lastName,
                number: controller.number
            });
            // Resolve createOne promise
            $scope.$apply();
            // expect no errors
            expect(controller.error).toBeFalsy();
            // location change expected
            expect($location.path).toHaveBeenCalledWith('/');
        });

        it('should throw error when createOne\'s promise was rejected', function () {
            // Leave empty data about new entry
            // Watch on method path in $location
            spyOn($location, 'path');
            controller.add();
            // Should call createOne method on PhonebookService with proper data
            expect(mockPhonebookService.createOne).toHaveBeenCalledWith({
                name: '',
                lastName: '',
                number: ''
            });
            // Reject createOne promise
            $scope.$apply();
            // Error expected
            expect(controller.error).toBeTruthy();
            // location change expected
            expect($location.path).not.toHaveBeenCalled();
        });
    });
});