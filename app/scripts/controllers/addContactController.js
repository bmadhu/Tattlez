/**
 * Created by bindum on 27/7/14.
 */
define(['../modules/controller'], function (controllers) {
    'use strict';
    controllers.controller('addContactCtrl', function ($scope, $state) {
        /**
         * Clicking cancel will navigate to Contacts form
         */
        $scope.gotoContactsForm = function () {
            $state.go('contacts');
        };
    });
});
