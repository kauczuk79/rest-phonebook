var phonebookApp = angular.module("PhonebookApp", ["ngRoute", "PhonebookControllers"]);

phonebookApp.config(["$routeProvider", function ($routeProvider) {
    $routeProvider.when("/", {
        templateUrl: "views/phonebook-list.html",
        controller: "PhonebookListController"
    }).otherwise({
        redirectTo: "/"
    });
}]);