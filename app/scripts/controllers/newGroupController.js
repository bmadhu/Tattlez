/**
 * Created by bindum on 6/8/14.
 */
define(['../modules/controller'], function (controllers) {
    'use strict';
    controllers.controller('newGroupCtrl', function ($scope, $state, addContactSrvc, contactsSrvc, joinSrvc) {
        $scope.groupName;
        $scope.selectedContacts = [];

        contactsSrvc.getallContacts().then(function (response) {
            $scope.contactsList = response;
        });

        $scope.handleAddedGroupContacts = function (contact) {
            $scope.selectedContacts.push(contact.contactNumber);
        }
       // $scope.groupContactNumber;

        $scope.createGroup = function () {
            var newGroup = {};
            newGroup.groupName = $scope.groupName;
            newGroup.groupContacts = $scope.selectedContacts;
            newGroup.userId = joinSrvc.getUserId();
            addContactSrvc.addContact(newGroup).then(function (result) {
                if (result == 'OK')
                    $state.go('contacts');
                else {
                    $scope.showAlert = true;
                }
            });
        }

    });
});