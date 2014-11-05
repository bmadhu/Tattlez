/**
 * Created by Reddy on 05-07-2014.
 */
define(['../modules/controller'], function (controllers) {
    'use strict';
    controllers.controller('appCtrl', ['$scope', 'configSrvc', 'contactsSrvc', 'chatSrvc', '$q', '$timeout', function ($scope, configSrvc, contactsSrvc, chatSrvc, $q, $timeout) {
    	$scope.phoneTablet = configSrvc.phoneTablet;
    	// Listen to USER_AUTHENTICATED event
    	$scope.$on("USER_AUTHENTICATED", function (event) {
    		connectToChat();
    		//Get all the contacts of user and save into localStorage
    		contactsSrvc.getallContacts().then(function (result) {
    			var promises = [];
    			for (var idx in result) {
    				var contact = result[idx];
					promises.push(
    				/**
					 * get the communicationId.
					 * If the user and the contact has a communicationId established, we'll get that.
					 * If the user and the contact don't have communicationId established, then create new and get that.
					 */
    				chatSrvc.getCommunicationId(contact.contactNumber).then(function (result) {
    					return result[0]._id;
    				}));
    			}
    			$q.all(promises).then(function (response) {
    				for (var idx in result) {
    					var obj = {};
    					obj.contactId = result[idx].id;
    					obj.communicationId = response[idx];
    					chatSrvc.updateContactCommunicationIdMappings(obj);
    					/**
						* Connect to chat with each contact to get the notifications.
						*/
    					chat.emit('connected to chat', response[idx]);
    				}
    			});
    			/**
				* Receive messages from the other user
				* Add the messages to array
				*/
    			chat.on('message', function (msg) {
    				$timeout(function () {
    					alert(msg);
    				}, 0);
    			});
    		});
    	});
    }]);
});
