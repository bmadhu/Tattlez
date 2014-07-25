/**
 * Created by Reddy on 05-07-2014.
 */
define([
    'angular',
    'angular-route',
    'angular-ui-router',
    './controllers/index',
	'./services/index',
	'./directives/index',
	'angular-bootstrap'
], function (angular) {
    'use strict';

    return angular.module('app', [
       'tattlez.controllers',
	   'tattlez.services',
	   'tattlez.directives',
        'ui.router',
		'ui.bootstrap'
    ]);
});
