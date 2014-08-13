/**
 * Created by bindum on 27/7/14.
 */
define(['../modules/controller'], function (controllers) {
	'use strict';
	controllers.controller('addContactCtrl', function ($scope, $state, addContactSrvc, joinSrvc) {
		$scope.contactName;
		$scope.contactNumber;
		$scope.showAlert = false;
		/**
         * Clicking cancel will navigate to Contacts form
         */
		$scope.gotoContactsForm = function () {
			$state.go('contacts');
		};

		/**
         * Clicking Save will save contact to database
         */
		$scope.addContact = function () {
			var contact = {};
			contact.group = false;
			contact.contactName = $scope.contactName;
			contact.contactNumber = $scope.contactNumber;
			contact.userId = joinSrvc.getUserId();
			addContactSrvc.addContact(contact).then(function (result) {
				if (result == 'OK')
					$state.go('contacts');
				else {
					$scope.showAlert = true;
				}
			});

		};
	});
});
