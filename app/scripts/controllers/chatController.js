/**
 * Created by Reddy on 01/8/14.
 */
define(['../modules/controller'], function (controllers) {
	'use strict';
	controllers.controller('chatCtrl', function ($scope, $state, contactsSrvc, chatSrvc, textAngularManager) {
		var joined = false;
		var chat = io.connect("/chat");
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
        * Get details of the contact
        */
        contactsSrvc.getChatContactDetails($scope.contactId).then(function (result) {
            $scope.contactDetails = result[0];
            /**
             * get the communicationId.
             * If the user and the contact has a communicationId established, we'll get that.
             * If the user and the contact don't have communicationId established, then create new and get that.
             */
			chatSrvc.getCommunicationId($scope.contactDetails.contactNumber).then(function (result) {
				console.log(result[0]._id);
				$scope.communicationId = result[0]._id;
				chat.emit('connected to chat', result[0]._id);
				/**
				* Place focus in chat message area using textAngularManager Service.
				*/
				var editorScope = textAngularManager.retrieveEditor('chatEditor').scope;
				editorScope.displayElements.text[0].focus();
			});
		});

		$scope.addMessage = function (contactId) {
			/**
			* Add messages to array.
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
			chat.emit('message', $scope.newMsg);
			/**
			* Call chatSrvc to add new message in dtabase
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
			$scope.msgs.push(msg);
		});
	});
});
