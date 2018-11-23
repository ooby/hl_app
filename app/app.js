'use strict';
angular.module('app', ['ngRoute', 'ngMaterial', 'ngMessages', 'app.services', 'app.controllers'])
    .constant('$apiEndpoint', {
        url: 'http://localhost/'
    })
    .config(function ($mdThemingProvider) {
        $mdThemingProvider.theme('default')
            .primaryPalette('cyan', {
                'default': '800',
                'hue-1': '400',
                'hue-2': '600',
                'hue-3': 'A100'
            })
            .accentPalette('red');
        $mdThemingProvider.theme('second')
            .primaryPalette('cyan', {
                'default': 'A400',
                'hue-1': 'A100',
                'hue-2': 'A200',
                'hue-3': 'A100'
            })
            .accentPalette('red');
    })
    .config(function ($httpProvider) {
        $httpProvider.interceptors.push('HttpRequestInterceptor');
    })
    .config(function ($routeProvider, $locationProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'views/body.html',
                controller: 'AppCtrl'
            })
            .when('/login', {
                templateUrl: 'views/login.html',
                controller: 'LoginCtrl'
            })
            .when('/upload', {
                templateUrl: 'views/upload.html',
                controller: 'UploadCtrl'
            })
            .otherwise({
                redirectTo: '/'
            });
        $locationProvider.html5Mode(true);
    });