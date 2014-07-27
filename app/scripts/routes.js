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
                templateUrl: '../views/loading.html',
                controller: 'LoadingCtrl',
                module: 'public'
            })
            .state('join', {
            	url: '/join',
            	templateUrl: '../views/join.html',
            	controller: 'JoinCtrl',
            	module: 'public'
            })
            .state('authenticate', {
                url: '/authenticate',
                templateUrl: '../views/otp.html',
                controller: 'otpCtrl',
                module: 'public'
            })
            .state('history', {
                url: '/history',
                templateUrl: '../views/history.html',
                controller: 'HistoryCtrl',
                module: 'public'
            })
            .state('contacts', {
                url: '/contacts',
                templateUrl: '../views/contacts.html',
                controller: 'ContactsCtrl',
                module: 'public'
            })
            .state('addContact', {
                url: '/addContact',
                templateUrl: '../views/addNewContact.html',
                controller: 'addContactCtrl',
                module: 'public'
            });
        //$locationProvider.html5Mode(true);
    }]);
    
});
