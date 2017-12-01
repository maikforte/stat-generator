angular.module("Dota2StatGenerator")

    .controller("Dota2StatGeneratorController", function ($scope, $window, $location, Dota2StatGeneratorService) {
        var fetchInfo = function (steamId) {
            Dota2StatGeneratorService.getInfo(steamId).then(function (successCallback) {
                $scope.info = JSON.parse(successCallback.data);
                return Dota2StatGeneratorService.getWLRatio(steamId);
            }).then(function (successCallback) {
                $scope.wl = JSON.parse(successCallback.data);
                return Dota2StatGeneratorService.getStats(steamId);
            }).then(function (successCallback) {
                $scope.stats = JSON.parse(successCallback.data);
                return Dota2StatGeneratorService.listHeroes();
            }).then(function (successCallback) {
                $scope.heroList = JSON.parse(successCallback.data);
                return Dota2StatGeneratorService.getHeroes(steamId);
            }).then(function (successCallback) {
                $scope.heroes = JSON.parse(successCallback.data);
            });
        };

        $window.fbAsyncInit = function () {
            FB.init({
                appId: '1615955601781169',
                xfbml: true,
                version: 'v2.11'
            });
            FB.AppEvents.logPageView();
        };

        (function (d, s, id) {
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) {
                return;
            }
            js = d.createElement(s);
            js.id = id;
            js.src = "https://connect.facebook.net/en_US/sdk.js";
            fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));

        $scope.init = function () {
            $scope.stats = null;
            var steamId = $location.search().id;
            if (steamId) {
                fetchInfo(steamId);
            }
        };

        $scope.loginSteam = function () {
            $window.location.href = "/api/steam/login";
        };

        $scope.generateCanvas = function () {
            html2canvas(document.getElementById("dota-stats"), {
                onrendered: function (canvas) {
                    document.getElementById("canvas").appendChild(canvas);
                    console.log(canvas.toDataURL());
                    Dota2StatGeneratorService.saveStats(canvas.toDataURL()).then(function (successCallback) {
                        console.log(successCallback);
                        $scope.shareURI = successCallback.data.image_uri;
                    }, function (errorCallback) {
                        console.log(errorCallback);
                    });
                }
            });
        };

        $scope.getLastName = function () {
            Dota2StatGeneratorService.getLastName().then(function (success) {
                console.log(success);
            }, function (error) {
                console.log(error);
            });
        };

        $scope.fbShare = function () {
            FB.ui({
                method: 'share',
                display: 'popup',
                href: $scope.shareURI,
            }, function (response) {});
        }
    });
