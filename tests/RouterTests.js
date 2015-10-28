/*global describe, beforeEach, afterEach, module, spyOn, it, expect, inject*/
describe('Router\'s', function () {
    'use strict';

    var $route,
        $location,
        $rootScope,
        $httpBackend;

    // Attach modules used in tested code
    beforeEach(module('app'));

    beforeEach(inject(function ($injector) {
        // Get instance of dependencies from $provide
        $route = $injector.get('$route');
        $location = $injector.get('$location');
        $rootScope = $injector.get('$rootScope');
        $httpBackend = $injector.get('$httpBackend');
    }));

    afterEach(function () {
        // Verify that backend has not have pending requests
        $httpBackend.verifyNoOutstandingRequest();
    });

    describe('\'/\' route', function () {
        // Expected values
        var expectedController = 'PhonebookListController',
            expectedViewAddress = 'views/phonebook-list.html';

        it('should be registered properly', function () {
            // Tested route...
            var route = $route.routes['/'];
            // ...should be defined properly
            expect(route.controller).toEqual(expectedController);
            expect(route.templateUrl).toEqual(expectedViewAddress);
        });

        it('should load main view when was discovered', function () {
            // Request for view expected
            $httpBackend.expectGET(expectedViewAddress).respond(200);
            // Change view to main view
            $location.path('/');
            // Send response to request for view
            $httpBackend.flush();
            // Scope refresh
            $rootScope.$apply();
            // Expect right controller
            expect($route.current.controller).toBe(expectedController);
        });
    });

    // Similar to the first describe
    describe('\'/add\' route', function () {
        var expectedController = 'PhonebookAddController',
            expectedViewAddress = 'views/phonebook-add.html';

        it('should be registered properly', function () {
            var route = $route.routes['/add'];
            expect(route.controller).toEqual(expectedController);
            expect(route.templateUrl).toEqual(expectedViewAddress);
        });

        it('should load add view when was discovered', function () {
            $httpBackend.expectGET(expectedViewAddress).respond(200);
            $location.path('/add');
            $httpBackend.flush();
            $rootScope.$apply();
            expect($route.current.controller).toBe(expectedController);
        });
    });

    // Similar to the first describe
    describe('\'/:id\' route', function () {
        var expectedController = 'PhonebookShowController',
            expectedViewAddress = 'views/phonebook-show.html';

        it('should be registered properly', function () {
            var route = $route.routes['/:id'];
            expect(route.controller).toEqual(expectedController);
            expect(route.templateUrl).toEqual(expectedViewAddress);
        });

        it('should load details view when was discovered', function () {
            $httpBackend.expectGET(expectedViewAddress).respond(200);
            $location.path('/12345');
            $httpBackend.flush();
            $rootScope.$apply();
            expect($route.current.controller).toBe(expectedController);
        });
    });

    // Similar to the first describe
    describe('\'/:id/edit\' route', function () {
        var expectedController = 'PhonebookEditController',
            expectedViewAddress = 'views/phonebook-edit.html';

        it('should be registered properly', function () {
            var route = $route.routes['/:id/edit'];
            expect(route.controller).toEqual(expectedController);
            expect(route.templateUrl).toEqual(expectedViewAddress);
        });

        it('should load details view when was discovered', function () {
            $httpBackend.expectGET(expectedViewAddress).respond(200);
            $location.path('/12345/edit');
            $httpBackend.flush();
            $rootScope.$apply();
            expect($route.current.controller).toBe(expectedController);
        });
    });


    describe('other route', function () {
        it('should redirects to main view', function () {
            // Request for view expected
            $httpBackend.expectGET('views/phonebook-list.html').respond(200);
            // When view adress not match to any route
            $location.path('/something/different');
            // Send response to request for view
            $httpBackend.flush();
            // Scope refresh
            $rootScope.$apply();
            // Expect default controller
            expect($route.current.controller).toBe('PhonebookListController');
        });
    });
});