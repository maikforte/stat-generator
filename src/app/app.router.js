angular.module("App")

    .config(function ($locationProvider) {
        $locationProvider.html5Mode(true);
    })

    .config(function ($stateProvider, $urlRouterProvider) {
        var statGenerator = {
            "name": "statGenerator",
            "url": "/stat-generator",
            "templateUrl": "./src/views/stat-generator.html",
            "controller": "Dota2StatGeneratorController"
        };

        $urlRouterProvider.otherwise("/stat-generator");
        $stateProvider.state(statGenerator);
    });
