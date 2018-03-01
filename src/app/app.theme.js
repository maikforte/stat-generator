angular.module("App")

    .config(function ($mdThemingProvider) {
        $mdThemingProvider.theme("default")
            .primaryPalette("blue-grey")
            .accentPalette("grey");
    });
