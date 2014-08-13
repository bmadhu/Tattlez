/**
 * Created by Reddy on 01/8/14.
 */
define(['../modules/controller'], function (controllers) {
	'use strict';
	controllers.controller('chatCtrl', function ($scope, $state, contactsSrvc, chatSrvc, $timeout) {
		//get the contactId of the user to which we are trying to start chat.
		$scope.contactId = contactsSrvc.getSelectedContactForChat();
		$scope.newMsg;
		/**
		* get the communicationId.
		* If the user and the contact has a communicationId established, we'll get that.
		* If the user and the contact don't have communicationId established, then create new and get that.
		*/
		chatSrvc.getCommunicationId($scope.contactId).then(function (result) {
			console.log(result);
		});

		$scope.addMessage = function (contactId) {
			console.log($scope.newMsg);
			$("text-angular div[contenteditable=true]").html('');
			$("textarea").val('');
		};
	});
});
