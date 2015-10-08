(function () {
    "use strict";

    var phonebookApp = angular.module("PhonebookApp", ["ngRoute", "PhonebookControllers"]);

    phonebookApp.config(["$routeProvider", function ($routeProvider) {
        $routeProvider.when("/", {
            templateUrl: "views/phonebook-list.html",
            controller: "PhonebookListController"
        }).when("/add", {
            templateUrl: "views/phonebook-add.html",
            controller: "PhonebookAddController"
        }).when("/:id", {
            templateUrl: "views/phonebook-show.html",
            controller: "PhonebookShowController"
        }).when("/:id/edit", {
            templateUrl: "views/phonebook-edit.html",
            controller: "PhonebookEditController"
        }).otherwise({
            redirectTo: "/"
        });
    }]);
})();