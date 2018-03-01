angular.module("Footer", ["ngMaterial"])

    .controller("FooterController", function ($scope, $window) {
        $scope.redirect = function (url) {
            $window.location.href = url;
        };
    })

    .directive("vertigooFooter", function () {
        return {
            "templateUrl": "./src/views/directive/footer.html",
            "controller": "FooterController"
        }
    })

    .config(function ($mdThemingProvider) {
        $mdThemingProvider.theme("default")
            .primaryPalette("blue-grey")
            .accentPalette("grey");
    });
