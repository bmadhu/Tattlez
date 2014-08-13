/**
 * Created by bindum on 6/8/14.
 */
define(['../modules/controller'], function (controllers) {
    'use strict';
    controllers.controller('newGroupCtrl', function ($scope, $state, addContactSrvc, contactsSrvc, joinSrvc) {
        $scope.groupName;
        $scope.selectedContacts = [];

        contactsSrvc.getallContacts().then(function (response) {
        	console.log(response);
            $scope.contactsList = response;
        });
    	/**
         * Clicking on Home button will navigate to history page
         */
        $scope.gotoHistory = function () {
        	$state.go('history');
        }
    	/**
         * Clicking on Back button will navigate to contacts page
         */
        $scope.gotoContacts = function () {
        	$state.go('contacts');
        }
        
        $scope.handleAddedGroupContacts = function (contact) {
            $scope.selectedContacts.push(contact.contactNumber);
        }
       // $scope.groupContactNumber;

        $scope.createGroup = function () {
        	var newGroup = {};
        	newGroup.group = true;
            newGroup.contactName = $scope.groupName;
            newGroup.contactNumber = $scope.selectedContacts.join(",");
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