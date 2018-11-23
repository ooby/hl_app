'use strict';
function appCtrl(Auth, $mdToast, $scope, $rootScope) {
    var last = {
        bottom: false,
        top: true,
        left: false,
        right: true
    };
    $scope.toastPosition = angular.extend({}, last);
    $scope.getToastPosition = function () {
        sanitizePosition();
        return Object.keys($scope.toastPosition)
            .filter(function (pos) { return $scope.toastPosition[pos]; })
            .join(' ');
    };
    function sanitizePosition() {
        var current = $scope.toastPosition;
        if (current.bottom && last.top) { current.top = false; }
        if (current.top && last.bottom) { current.bottom = false; }
        if (current.right && last.left) { current.left = false; }
        if (current.left && last.right) { current.right = false; }
        last = angular.extend({}, current);
    }
    if (Auth.logged()) { $rootScope.logged = true; }
    else { $rootScope.logged = false; }
    $rootScope.$on('alert', function (event, data) {
        $mdToast.show(
            $mdToast.simple()
                .textContent(data)
                .position($scope.getToastPosition())
                .hideDelay(3000)
        );
    });
    $rootScope.$on('$routeChangeStart', function () {
        if (Auth.logged()) { $rootScope.logged = true; }
        else { $rootScope.logged = false; }
    });
};

function loginCtrl(Auth, $scope, $window, $location, $rootScope) {
    $rootScope.processing = false;
    $scope.login = {};
    $scope.doLogin = function () {
        $rootScope.processing = true;
        Auth.login($scope.login)
            .then(function (r) {
                $rootScope.processing = false;
                $window.localStorage.setItem('token', r.token);
                $location.path('/');
            }, function (e) {
                $rootScope.processing = false;
                $rootScope.$broadcast('alert', e.message);
                $location.path('/');
            });
    };
};

angular.module('app.controllers', ['app.services'])
    .controller('AppCtrl', appCtrl)
    .controller('LoginCtrl', loginCtrl);