angular.module("Dota2StatGenerator")

    .controller("Dota2StatGeneratorController", function ($scope, $window, $location, $timeout, $filter, $mdMedia, Dota2StatGeneratorService) {

        var heroLooper = function (topHeroes, heroes) {
            var top3 = $filter("limitTo")($filter("orderBy")(topHeroes, "-win"), "3");
            for (i = 0; i < top3.length; i++) {
                for (j = 0; j < heroes.length; j++) {
                    if (top3[i].hero_id == heroes[j].id) {
                        top3[i]["localized_name"] = heroes[j].localized_name;
                        break;
                    }
                }
            }
            return top3;
        }

        var fetchInfo = function (steamId) {
            Dota2StatGeneratorService.getInfo(steamId).then(function (successCallback) {
                $scope.info = JSON.parse(successCallback.data);
                $scope.isInfoLoading = false;
                return Dota2StatGeneratorService.getWLRatio(steamId);
            }).then(function (successCallback) {
                $scope.wl = JSON.parse(successCallback.data);
                $scope.isWLLoading = false;
                return Dota2StatGeneratorService.getStats(steamId);
            }).then(function (successCallback) {
                $scope.stats = JSON.parse(successCallback.data);
                $scope.isStatsLoading = false;
                return Dota2StatGeneratorService.listHeroes();
            }).then(function (successCallback) {
                $scope.heroList = JSON.parse(successCallback.data);
                return Dota2StatGeneratorService.getHeroes(steamId);
            }).then(function (successCallback) {
                $scope.heroes = heroLooper(JSON.parse(successCallback.data), $scope.heroList);
                $scope.isHeroLoading = false;
                $timeout($scope.generateCanvas, 1000);
            });
        };

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
            $scope.stats = null;
            $scope.showShareButton = true;
            $scope.generatedStats = "http://vertigoo.org/generated-stats/placeholder.png";
            var steamId = $location.search().id;
            if (steamId) {
                //                $scope.isInfoLoading = true;
                //                $scope.isWLLoading = true;
                //                $scope.isStatsLoading = true;
                //                $scope.isHeroLoading = true;
                //                fetchInfo(steamId);
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
