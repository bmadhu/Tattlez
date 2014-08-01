/**
 * Created by Reddy on 05-07-2014.
 */
define(['./app'], function (app) {
	'use strict';
	return app.config(['$stateProvider', '$locationProvider', '$urlRouterProvider', '$httpProvider', function ($stateProvider, $locationProvider, $urlRouterProvider, $httpProvider) {
		if (!$httpProvider.defaults.headers.get) {
			$httpProvider.defaults.headers.get = {};
		}
		//disable IE ajax request caching
		$httpProvider.defaults.headers.get['If-Modified-Since'] = '0';

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
    		});
		//$locationProvider.html5Mode(true);
	}]);

});
