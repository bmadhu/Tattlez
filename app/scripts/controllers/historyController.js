/**
 * Created by bindum on 27/7/14.
 */
define(['../modules/controller'], function (controllers) {
    'use strict';
    controllers.controller('HistoryCtrl', function ($scope, $state) {
        /**
         * Loads contacts page from history
         */
        $scope.loadContacts = function () {
            $state.go('contacts');
        };
    });
});
