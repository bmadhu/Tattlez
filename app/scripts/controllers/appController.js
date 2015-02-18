/**
 * Created by Reddy on 05-07-2014.
 */
define(['../modules/controller'], function (controllers) {
    'use strict';
    controllers.controller('appCtrl', ['$scope','$rootScope', 'configSrvc', 'contactsSrvc', 'chatSrvc', '$q', '$timeout', 'socketio','ngAudio','joinSrvc','$filter','socketiostream',
    function ($scope,$rootScope, configSrvc, contactsSrvc, chatSrvc, $q, $timeout,socketio, ngAudio,joinSrvc,$filter,socketiostream) {
    	
    	$rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
	  		if(fromState.name=="" && toState.name != "join"){
	  			$rootScope.$broadcast("ESTABLISH_COMMUNICATION");
	  		}
	  	});
    	$scope.phoneTablet = configSrvc.phoneTablet;
    	$scope.timeFormat="h:mm a";
    	$scope.audio = ngAudio.load('../sounds/2.mp3');
    	$scope.isNotification=false;
    	/**
		* Receive messages from the other user
		* Add the messages to array
		*/
		socketio.on('message', function (msg) {
			//If the user is not chatting with user, who sent the message then, notify the user.
			if(localStorage.getItem(configSrvc.cmidLocalStorage) !== msg.communicationId){
				contactsSrvc.getallContacts().then(function(contacts){
					var userNumber;
					if(joinSrvc.mobileAndOtp.mobileNumber){
						userNumber = joinSrvc.mobileAndOtp.mobileNumber;
						$scope.notifyMsg(msg,userNumber,contacts);
					}
					else{
						joinSrvc.getUserByUserId().then(function(userdata){
							userNumber = userdata.mobileNumber;
							$scope.notifyMsg(msg,userNumber,contacts);
						});	
					}
					
				});
		    		
			}else{
				$timeout(function () {
					//Broadcast the received message to chat window(chatController).
					$rootScope.$broadcast("MSG_RECEIVED",msg);
				}, 0);
			}
		});
		ss(socketiostream).on('image', function (data) {
			console.log('image');
			console.log(data);
			$rootScope.$broadcast("IMAGE_RECEIVED",data);
			
		});
		$scope.notifyMsg=function(msg,userNumber,contacts){
			if(msg.to == userNumber){
				var contact = $filter('filter')(contacts,{contactNumber:msg.from},true);
				msg.from = contact[0].contactName;
				$scope.audio.play();
	    		$scope.isNotification=true;
	    		$scope.notification=msg.from+' : '+msg.message;
	    		//Clear notification
		    	$timeout(function () {
					$scope.isNotification=false;
					$scope.notification='';
				}, 3000);
			}
			else{
				var contact = $filter('filter')(contacts,{contactNumber:msg.to},true);
				msg.from = contact[0].contactName;
				$scope.audio.play();
	    		$scope.isNotification=true;
	    		$scope.notification=msg.from+' : '+msg.message;
	    		//Clear notification
		    	$timeout(function () {
					$scope.isNotification=false;
					$scope.notification='';
				}, 3000);
			}
		};
    	// Listen to ESTABLISH_COMMUNICATION event
    	$scope.$on("ESTABLISH_COMMUNICATION", function (event) {
    		//Get all the contacts of user and save into localStorage
    		contactsSrvc.getallContacts().then(function (result) {
    			console.log(result);
    			if(result!== null){
    			var promises = [];
    			for (var idx in result) {
    				var contact = result[idx];
					promises.push(
    				/**
					 * get the communicationId.
					 * If the user and the contact has a communicationId established, we'll get that.
					 * If the user and the contact don't have communicationId established, then create new and get that.
					 */
    				chatSrvc.getCommunicationId(contact.contactNumber,contact.group,contact.groupAdmin).then(function (communicationResult) {
    					
    					//if the call to Mongo DB uses find, then it returns array
    					//if the call to mongo db inserts a new record to DB and returns an object.
    					if(communicationResult.length){
    						return communicationResult[0]._id;
    					}
    					return communicationResult._id;
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
    					socketio.emit('connected to chat', response[idx]);
    				}
    			});
    		}
    		});
    		
    		
    	});
    }]);
});
