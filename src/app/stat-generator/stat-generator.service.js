angular.module("Dota2StatGenerator")

    .service("Dota2StatGeneratorService", function ($http) {
        this.getInfo = function (steamId) {
            return $http({
                "method": "GET",
                "url": "/api/player/get-info",
                "params": {
                    "account_id": steamId
                }
            });
        };

        this.getWLRatio = function (steamId) {
            return $http({
                "method": "GET",
                "url": "/api/player/get-win-lose-ratio",
                "params": {
                    "account_id": steamId
                }
            });
        };

        this.getStats = function (steamId) {
            return $http({
                "method": "GET",
                "url": "/api/player/get-stats",
                "params": {
                    "account_id": steamId
                }
            });
        };

        this.getHeroes = function (steamId) {
            return $http({
                "method": "GET",
                "url": "/api/player/get-heroes",
                "params": {
                    "account_id": steamId
                }
            });
        };

        this.listHeroes = function () {
            return $http({
                "method": "GET",
                "url": "/api/hero/list-heroes"
            });
        };

        this.getPeers = function (steamId) {
            return $http({
                "method": "GET",
                "url": "/api/player/get-peers",
                "params": {
                    "account_id": steamId
                }
            });
        };

        this.saveStats = function (base64image) {
            return $http({
                "method": "POST",
                "url": "/api/stats/save-stats",
                "data": {
                    "encoded_image": base64image
                }
            });
        };

        this.getLastName = function () {
            return new Promise(function (resolve, reject) {
                FB.api('/me', {
                    fields: 'last_name, first_name'
                }, function (response) {
                    if (response || !response.error) {
                        resolve(response);
                    } else {
                        reject("An error occured");
                    }
                });
            });
        };

        this.getGeneratedStats = function (account_id) {
            return $http({
                "method": "POST",
                "url": "/api/stats/generate-image",
                "data": {
                    "account_id": account_id
                }
            });
        };
    });
