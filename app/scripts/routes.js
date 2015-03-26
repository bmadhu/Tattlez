/**
 * Created by Reddy on 05-07-2014.
 */
define(['./app'], function (app) {
	'use strict';
	return app.config(['$stateProvider', '$locationProvider', '$urlRouterProvider', '$httpProvider', function ($stateProvider, $locationProvider, $urlRouterProvider, $httpProvider) {
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
            	module: 'private'
            })
            .state('contacts', {
            	url: '/contacts',
            	templateUrl: '../views/contacts.html',
            	controller: 'ContactsCtrl',
            	module: 'private'
            })
            .state('contactInfo', {
                url: '/contactInfo',
                templateUrl: '../views/contactInfo.html',
                controller: 'ContactInfoCtrl',
                module: 'private'
            })
            .state('addContact', {
            	url: '/addContact',
            	templateUrl: '../views/addNewContact.html',
            	controller: 'addContactCtrl',
            	module: 'private'
            })
    		.state('chat', {
    			url: '/chat',
    			templateUrl: '../views/chat.html',
    			controller: 'chatCtrl',
    			module: 'private'
    		})
            .state('newGroup', {
                url: '/newGroup',
                templateUrl: '../views/newGroup.html',
                controller: 'newGroupCtrl',
                module: 'private'
            })
            .state('settings', {
                url: '/settings',
                templateUrl: '../views/settings.html',
                controller: 'settingsCtrl',
                module: 'private'
            })
            .state('profile', {
                url: '/profile',
                templateUrl: '../views/profile.html',
                controller: 'profileCtrl',
                module: 'private'
            });
		//$locationProvider.html5Mode(true);
	}]);
	

});
