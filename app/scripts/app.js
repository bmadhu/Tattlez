/**
 * Created by Reddy on 05-07-2014.
 */
define([
    'angular',
    'angular-route',
    'angular-ui-router',
    './controllers/index'
], function (angular) {
    'use strict';

    return angular.module('app', [
       'tattlez.controllers',
        'ui.router'
    ]);
});
