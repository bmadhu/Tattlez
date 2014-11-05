/**
 * Created by Reddy on 01/8/14.
 */
define(['../modules/controller'], function (controllers) {
	'use strict';
	controllers.controller('chatCtrl', function ($scope, $state, contactsSrvc, chatSrvc, textAngularManager,$timeout) {
		var joined = false;
		//get the contactId of the user to which we are trying to start chat.
		$scope.contactId = contactsSrvc.getSelectedContactForChat();
		$scope.newMsg;
		$scope.msgs = [];

        /**
         * Clicking on Home button will navigate to history page
         */
        $scope.gotoHistory = function () {
            $state.go('history');
        }

        /**
         * Clicking on Back button will navigate to history page
         */
        $scope.gotoContacts = function () {
            $state.go('contacts');
        }

		/**
		* Get the communicationId for the contact(with whom started chat).
		*/
        chatSrvc.getContactCommunicationIdMappings($scope.contactId).then(function (result) {
        	$scope.communicationId = result[0].communicationId;
        	/**
			* Place focus in chat message area using textAngularManager Service.
			*/
        	$timeout(function () {
        		var editorScope = textAngularManager.retrieveEditor('chatEditor').scope;
        		editorScope.displayElements.text[0].focus();
        	}, 1000);
        });
		$scope.addMessage = function (contactId) {
			/**
			* Add messages to array to show it on the window immediately.
			*/
			$scope.msgs.push($scope.newMsg);
			/**
			* Prepare an object with CommunicationId and the message to save in database.
			*/
			var doc = {};
			doc.communicationId = $scope.communicationId;
			doc.message = $scope.newMsg;
			/**
			* Emit the message to socket.
			*/
			chat.emit('message', doc);
			/**
			* Call chatSrvc to add new message in database
			*/
			chatSrvc.addMessage(doc).then(function (result) {
				console.log(result);
			});
			/**
			* clear the chat message using textAngularManager service.
			*/
			var editorScope = textAngularManager.retrieveEditor('chatEditor').scope;
			editorScope.displayElements.text[0].innerHTML = '';
			/**
			* Clear the message in scope model
			*/
			$scope.newMsg = '';
		};
		/**
		* Receive messages from the other user
		* Add the messages to array
		*/
		chat.on('message', function (msg) {
			$timeout(function () {
				$scope.msgs.push(msg);
			}, 0);
		});
	});
});
