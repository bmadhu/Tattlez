/**
 * Created by Reddy on 05-07-2014.
 */
define(['../modules/controller'], function (controllers) {
    'use strict';
    controllers.controller('appCtrl', ['$scope','$rootScope', 'configSrvc', 'contactsSrvc', 'chatSrvc', '$q', '$timeout', 'socketio','ngAudio','joinSrvc','$filter','socketiostream','Room','VideoStream',
    function ($scope,$rootScope, configSrvc, contactsSrvc, chatSrvc, $q, $timeout,socketio, ngAudio,joinSrvc,$filter,socketiostream,Room,VideoStream) {
    	
    	$rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
	  		if(fromState.name=="" && toState.name != "join"){
	  			$rootScope.$broadcast("ESTABLISH_COMMUNICATION");
	  		}
	  	});
    	$scope.phoneTablet = configSrvc.phoneTablet;
    	$scope.timeFormat="h:mm a";
    	$scope.audio = ngAudio.load('../sounds/2.mp3');
    	var userNumber;
    	$scope.outCallAudio = ngAudio.load('../sounds/Ringing_Phone.mp3');
    	$scope.outCallAudio.loop=true;
    	$scope.inCallAudio = ngAudio.load('../sounds/Phone_Ringing.mp3');
    	$scope.inCallAudio.loop=true;
    	$scope.busyCallAudio = ngAudio.load('../sounds/Busy_Signal.mp3');
    	$scope.busyCallAudio.loop=true;
    	var localvid = document.getElementById('localVideo');
    	$scope.isNotification=false;
    	$scope.showCallModal='display-none';
    	var stream;
    	$scope.peers = [];
	    $scope.$on("STREAM_RECEIVED", function (event,data) {
	    	$scope.outCallAudio.stop();
			  console.log('Client connected, adding new stream');
		      $scope.peers.push({
		        id: data[0].id,
		        stream: URL.createObjectURL(data[0].stream)
		      });
		      
		});
		$scope.$on("STREAM_ENDED", function (event,data) {
			  console.log('Client disconnected, removing stream');
		      $scope.peers = $scope.peers.filter(function (p) {
		        return p.id !== peer.id;
		      });
		});
	    $scope.getLocalVideo = function () {
	      return $sce.trustAsResourceUrl(stream);
	    };
    	$scope.$on("OUT_GOING_CALL", function (event,data) {
    		$scope.isOutGoingCall=true;
    		$scope.callTitle = "Calling";
    		$scope.communicationId = data.communicationId;
    		$scope.userNumber = data.userNumber;
    		  $scope.showCallModal='display-block';
    		  $scope.callName=data.ContactData.contactName;
    		  $scope.callPhoto = data.ContactData.photo;
			  $scope.outCallAudio.play();
    		VideoStream.get()
	    .then(function (s) {
	      stream = s;
	      Room.init(stream);
	      localvid.src = URL.createObjectURL(s);
		  localvid.autoplay=true;
	      Room.createRoom($scope.communicationId,$scope.userNumber)
	        .then(function (roomId) {
				//Emit calling to other user using socket.io
	          socketio.emit('call', {communicationId:$scope.communicationId,from:$scope.userNumber,to:data.ContactData.contactNumber});
	        });
	    }, function () {
	      $scope.AVerror = 'No audio/video permissions. Please refresh your browser and allow the audio/video capturing.';
	      alert($scope.AVerror);
	    });
			  
			  
		});
		$scope.endCall=function(){
			$scope.showCallModal='display-none';
			$scope.outCallAudio.stop();
			stream.stop();
			localvid.pause();
			localvid.src="";
			socketio.emit('endcall', {communicationId:$scope.communicationId,from:$scope.userNumber});
		};
		$scope.answerCall=function(){
			$scope.inCallAudio.stop();
			VideoStream.get()
	    .then(function (s) {
	      stream = s;
	      Room.init(stream);
	      localvid.src = URL.createObjectURL(s);
		  localvid.autoplay=true;
	      Room.joinRoom($scope.communicationId,userNumber)
	        .then(function (roomId) {
				
			});
	    }, function () {
	      $scope.AVerror = 'No audio/video permissions. Please refresh your browser and allow the audio/video capturing.';
	      alert($scope.AVerror);
	    });
			
		};
		$scope.rejectCall=function(){
			
		};
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
		/**
		* Receive messages from the other user
		* Add the messages to array
		*/
		socketio.on('call', function (msg) {
			$scope.communicationId = msg.communicationId;
			$scope.callTitle = "Incoming Call";
				contactsSrvc.getallContacts().then(function(contacts){
					if(joinSrvc.mobileAndOtp.mobileNumber){
						userNumber = joinSrvc.mobileAndOtp.mobileNumber;
						$scope.notifyCall(msg,userNumber,contacts);
					}
					else{
						joinSrvc.getUserByUserId().then(function(userdata){
							userNumber = userdata.mobileNumber;
							$scope.notifyCall(msg,userNumber,contacts);
						});	
					}
					
				});
		    		
			
		});
		socketio.on('endcall', function (msg) {
			$scope.inCallAudio.stop();
			stream.stop();
			localvid.pause();
			localvid.src="";
    		$scope.showCallModal='display-none';
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
	    		
	    		$scope.notification=msg.from+' : '+msg.message;
	    		//Clear notification
		    	$timeout(function () {
					$scope.isNotification=false;
					$scope.notification='';
				}, 3000);
			}
		};
		
		$scope.notifyCall=function(msg,userNumber,contacts){
			if(msg.to == userNumber){
				var contact = $filter('filter')(contacts,{contactNumber:msg.from},true);
				msg.from = contact[0].contactName;
				msg.fromPhoto = contact[0].photo;
	    		
			}
			else{
				var contact = $filter('filter')(contacts,{contactNumber:msg.to},true);
				msg.from = contact[0].contactName;
				msg.fromPhoto = contact[0].photo;
			}
			$scope.inCallAudio.play();
			$scope.callName=msg.from;
    		$scope.callPhoto = msg.fromPhoto;
    		$scope.showCallModal='display-block';
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
