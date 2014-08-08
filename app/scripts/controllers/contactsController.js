/**
 * Created by bindum on 27/7/14.
 */

define(['../modules/controller'], function (controllers) {
    'use strict';
    controllers.controller('ContactsCtrl', function ($scope, $state, contactsSrvc, joinSrvc) {
    	$scope.showModal = 'display-none';
    	contactsSrvc.getallContacts().then(function (result) {
    		$scope.contacts = result;
    	});

        /**
         * Clicking on Home and Back button will navigate to history page
         */
        $scope.gotoHistory = function () {
            $state.go('history');
        }
        /**
         * Loads Adding new contact page from Contacts
         */
        $scope.addNewContact = function () {
            $state.go('addContact');
        };

    	/**
		* Loads chatting page from contacts
		**/
        $scope.chat = function (contactId) {
        	contactsSrvc.setSelectedContactForChat(contactId);
        	$state.go('chat');
        };
        $scope.confirmDeleteContact = function () {
        	var index = $scope.index;
        	var contact = {};
        	contact.contactNumber = $scope.contacts[index].contactNumber;
        	contact.userId = joinSrvc.getUserId();
        	contactsSrvc.deleteContact(contact).then(function (result) {
        		if (result == 'OK') {
        			$scope.contacts.splice(index, 1);
        		}
        		else {
        			console.log('not ok');
        		}
        		deleteContactCloseModal();
        	});
        };
        $scope.cancelDeleteContact = function () {
        	deleteContactCloseModal();
        }
        function deleteContactCloseModal() {
        	$scope.index = null;
        	$scope.showModal = 'display-none';
        }
    	/**
		* Delete contact
		**/
        $scope.deleteContact = function (index) {
        	$scope.index = index;
        	$scope.contacts[index].isopen = false;
        	$scope.showModal = 'display-block';
        };
    });
});

