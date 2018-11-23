'use strict';
function httpRequestInterceptor($q, $location, $window) {
    var authInterceptorFactory = {};
    authInterceptorFactory.request = function (config) {
        var token = $window.localStorage.getItem('token');
        if (token) {
            config.headers['x-access-token'] = token;
        }
        return config;
    };
    authInterceptorFactory.responseError = function (response) {
        if (response.status == 403) { $location.path('login'); }
        return $q.reject(response);
    };
    return authInterceptorFactory;
};

function composeReq(method, api, url, hdrs, data, q, http, rs) {
    var d = q.defer();
    var req = {
        method: method,
        url: api.url + url,
        headers: (hdrs),
        data: (data)
    };
    http(req).then(
        function (r) { d.resolve(r.data); },
        function (e) { d.reject(e.data); }
    );
    return d.promise;
};

function auth($q, $http, $apiEndpoint, $rootScope, $window, $location) {
    var authFactory = {};
    authFactory.login = function (data) {
        return composeReq('POST', $apiEndpoint, 'api/login', null, data, $q, $http, $rootScope);
    };
    authFactory.logout = function () {
        $window.localStorage.removeItem('access');
        $location.path('/');
    };
    return authFactory;
};

angular.module('app.services', [])
    .factory('HttpRequestInterceptor', httpRequestInterceptor)
    .factory('Auth', auth);