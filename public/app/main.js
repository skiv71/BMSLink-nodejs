var app = angular.module('bmslink', [

	'ngRoute',

	'ngAnimate',

	'ngCookies',

	'ngStorage',

	'bmslink.controllers',

    'bmslink.services'

]);

angular.module('bmslink.controllers', []);

angular.module('bmslink.services', []);

app.constant('host','http://localhost');

app.config(['$routeProvider',

    function($routeProvider) {

        $routeProvider

        .when('/control', {

            templateUrl: '/views/control.html',

            controller: 'controlController'

        })

        .when('/devices', {

            templateUrl: '/views/devices.html',

            controller: 'devicesController'

        })

        .when('/points', {

	       templateUrl: '/views/points.html',

            controller: 'pointsController'

        })

        .when('/logs', {

            templateUrl: '/views/logs.html',

            controller: 'logsController'

        })

        .when('/settings', {

            templateUrl: '/views/settings.html',

            controller: 'settingsController'

        });

    }

]);