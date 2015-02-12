/**
 * Created by Reddy on 01/8/14.
 */
define(['../modules/controller'], function (controllers) {
	'use strict';
	controllers.controller('chatCtrl', function ($scope,$rootScope, $state, contactsSrvc, chatSrvc, textAngularManager,$timeout,joinSrvc,$filter,socketio,configSrvc) {
		var joined = false;
		//get the contactId of the user to which we are trying to start chat.
		$scope.contactId = contactsSrvc.getSelectedContactForChat();
		var userNumber;
		if(joinSrvc.mobileAndOtp.mobileNumber){
			userNumber = joinSrvc.mobileAndOtp.mobileNumber;
		}
		else{
			joinSrvc.getUserByUserId().then(function(userdata){
				userNumber = userdata.mobileNumber;
			});	
		}
		
		$scope.newMsg;
		$scope.msgs = [];

        /**
         * Clicking on Home button will navigate to history page
         */
        $scope.gotoHistory = function () {
            $state.go('history');
        };

        /**
         * Clicking on Back button will navigate to history page
         */
        $scope.gotoContacts = function () {
            $state.go('contacts');
        };

		/**
		* Get the communicationId for the contact(with whom started chat).
		*/
        chatSrvc.getContactCommunicationIdMappings($scope.contactId).then(function (result) {
        	$scope.communicationId = result[0].communicationId;
        	localStorage.setItem(configSrvc.cmidLocalStorage,result[0].communicationId);
        	//get the contact details to display the name on screen
			contactsSrvc.getChatContactDetails($scope.contactId).then(function(data){
				$scope.contactDetails=data[0];
			});
        	//joinSrvc.getUserByUserId().then(function(userdata){
				//$scope.userdata = userdata;
			//});
		
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
			* Prepare an object with CommunicationId and the message to save in database.
			*/
			var doc = {};
			doc.communicationId = $scope.communicationId;
			doc.message = $scope.newMsg;
			doc.from = userNumber;
			doc.to=$scope.contactDetails.contactNumber;
			doc.on = new Date();
			/**
			* Emit the message to socket.
			*/
			socketio.emit('message', doc);
			/**
			* Add messages to array to show it on the window immediately.
			*/
			doc.from='me';
			$scope.msgs.push(doc);
			
			/**
			* Call chatSrvc to add new message in database
			*/
			chatSrvc.addMessage(doc).then(function (result) {
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
		$scope.$on("MSG_RECEIVED", function (event,msg) {
			$timeout(function () {
				contactsSrvc.getallContacts().then(function(contacts){
					var contact = $filter('filter')(contacts,{contactNumber:msg.from},true);
					msg.from = contact[0].contactName;
					$scope.msgs.push(msg);
				});
			}, 0);
		});
		/**
		 * Scope destroy event to remove the chat contact from the localStorage
		 */
		$scope.$on('$destroy', function() {
            contactsSrvc.removeSelectedContactForChat();
            chatSrvc.removeSelectedCommunicationIdForChat();
        });
		
	});
});
