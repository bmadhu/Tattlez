/**
 * Created by bindum on 27/7/14.
 */

define(['../modules/controller'], function (controllers) {
    'use strict';
    controllers.controller('ContactsCtrl', function ($scope, $state) {
        /**
         * Loads Adding new contact page from Contacts
         */
        $scope.addNewContact = function () {
            $state.go('addContact');
        };
    });
});

