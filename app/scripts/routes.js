/**
 * Created by Reddy on 05-07-2014.
 */
define(['./app'], function (app) {
    'use strict';
    return app.config(['$stateProvider', '$locationProvider', '$urlRouterProvider', function ($stateProvider, $locationProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/');
        $stateProvider
            .state('home', {
                url: '/',
                templateUrl: '../views/webHomePage.html',
                controller: 'WebHomeCtrl',
                module: 'public'
            })
            .state('welcome', {

            });
    }]);
});
