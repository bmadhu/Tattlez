/**
 * Created by Reddy on 05-07-2014.
 */
define(['../modules/controller'], function (controllers) {
    'use strict';
    controllers.controller('appCtrl', function ($scope) {
        $scope.welcomeMsg="Welcome to Tattlez Application";
    });
});
