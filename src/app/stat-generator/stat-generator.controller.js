angular.module("Dota2StatGenerator")

    .controller("Dota2StatGeneratorController", function ($scope, $window, $location, $timeout, $filter, $mdMedia, Dota2StatGeneratorService) {

        $window.fbAsyncInit = function () {
            FB.init({
                appId: '1615955601781169',
                xfbml: true,
                status: true,
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
            $scope.showShareButton = true;
            $scope.generatedStats = "http://www.vertigoo.org/generated-stats/placeholder.png";
            var steamId = $location.search().id;
            if (steamId) {
                console.log(steamId);
                $scope.generateCanvas(steamId);
            }
        };

        $scope.loginSteam = function () {
            $window.location.href = "/api/steam/login";
        };

        $scope.generateCanvas = function (steamId) {
            $scope.isLoading = true;
            Dota2StatGeneratorService.getGeneratedStats(steamId).then(function (successCallback) {
                $scope.generatedStats = successCallback.data;
                console.log(successCallback);
                $scope.isLoading = false;
            }, function (errorCallback) {
                $scope.isLoading = false;
                console.log(errorCallback);
            });
        };

        $scope.share = function () {
            if ($scope.generatedStats) {
                console.log($scope.generatedStats);
                FB.ui({
                    method: 'share_open_graph',
                    action_type: 'og.shares',
                    display: 'popup',
                    action_properties: JSON.stringify({
                        object: {
                            'fb:app_id': '1615955601781169',
                            'og:url': "http://www.vertigoo.org/stat-generator/",
                            'og:title': "DotA 2 Stats Generator",
                            'og:description': "Generate, Share and Brag your all-time DotA 2 Statistics and show them who's the boss",
                            'og:image': $scope.generatedStats,
                            "og:image:width": "600",
                            "og:image:height": "315"
                        }
                    })
                });
            }
        }
    });
