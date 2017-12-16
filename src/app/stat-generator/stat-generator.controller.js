angular.module("Dota2StatGenerator")

    .controller("Dota2StatGeneratorController", function ($scope, $window, $location, Dota2StatGeneratorService) {
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
                $scope.heroes = JSON.parse(successCallback.data);
                $scope.isHeroLoading = false;
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
            var steamId = $location.search().id;
            if (steamId) {
                $scope.isInfoLoading = true;
                $scope.isWLLoading = true;
                $scope.isStatsLoading = true;
                $scope.isHeroLoading = true;
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
                    Dota2StatGeneratorService.saveStats(canvas.toDataURL()).then(function (successCallback) {
                        //                        FB.ui({
                        //                            method: 'share_open_graph',
                        //                            action_type: 'og.shares',
                        //                            display: 'popup',
                        //                            action_properties: JSON.stringify({
                        //                                object: {
                        //                                    'fb:app_id': '1615955601781169',
                        //                                    'og:url': "http://www.vertigoo.org/stat-generator/",
                        //                                    'og:title': "DotA 2 Stats Generator",
                        //                                    'og:description': "Generate, Share and Brag your all-time DotA 2 Statistics and show them who's the boss",
                        //                                    'og:image': successCallback.data.image_uri,
                        //                                    "og:image:width": "600",
                        //                                    "og:image:height": "350"
                        //                                }
                        //                            })
                        FB.ui({
                            method: 'feed',
                            display: 'popup',
                            api_id: '1615955601781169',
                            redirect_uri: "http://www.vertigoo.org/stat-generator/",
                            caption: "DotA 2 Stats Generator",
                            description: "Generate, Share and Brag your all-time DotA 2 Statistics and show them who's the boss",
                            picture: successCallback.data.image_uri,
                            properties: {
                                caption: "DotA 2 Stats Generator",
                                description: "Generate, Share and Brag your all-time DotA 2 Statistics and show them who's the boss"
                            }
                        }, function (response) {
                            console.log(response);
                        });
                    }, function (errorCallback) {
                        console.log(errorCallback);
                    });
                }
            });
        };
    });
