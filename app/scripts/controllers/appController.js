/**
 * Created by Reddy on 05-07-2014.
 */
define(['../modules/controller'], function (controllers) {
    'use strict';
    controllers.controller('appCtrl', ['$scope', 'configSrvc', function ($scope, configSrvc) {
    	$scope.phoneTablet = configSrvc.phoneTablet;
    }]);
});
