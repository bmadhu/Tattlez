/**
 * Created by Reddy on 05-07-2014.
 */
define([
    'angular',
    'angular-route',
    'angular-ui-router',
    './controllers/index',
	'./services/index',
	'bootstrap',
	'angular-bootstrap'
], function (angular) {
    'use strict';

    return angular.module('app', [
       'tattlez.controllers',
	   'tattlez.services',
        'ui.router',
		'ui.bootstrap'
    ]);
});
