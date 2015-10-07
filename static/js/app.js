var phonebookApp = angular.module("PhonebookApp", ["ngRoute", "PhonebookControllers"]);

phonebookApp.config(["$routeProvider", function ($routeProvider) {
    $routeProvider.when("/", {
        templateUrl: "views/phonebook-list.html",
        controller: "PhonebookListController"
    }).when("/add", {
        templateUrl: "views/phonebook-add.html",
        controller: "PhonebookAddController"
    }).when("/:number/edit", {
        templateUrl: "views/phonebook-edit.html",
        controller: "PhonebookEditController"
    }).otherwise({
        redirectTo: "/"
    });
}]);