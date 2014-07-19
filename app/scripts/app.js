/**
 * Created by Reddy on 05-07-2014.
 */
define([
    'angular',
    'angular-route',
    './controllers/index'
], function (angular) {
    'use strict';

    return angular.module('app', [
       'tattlez.controllers'
    ]);
});
