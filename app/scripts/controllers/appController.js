/**
 * Created by Reddy on 05-07-2014.
 */
define(['../modules/controller'], function (controllers) {
    'use strict';
    controllers.controller('appCtrl', ['$scope','$rootScope', 'configSrvc', 'contactsSrvc', 'chatSrvc', '$q', '$timeout', 'socketio','ngAudio','joinSrvc','$filter','socketiostream','Room','VideoStream','$sce',
    function ($scope,$rootScope, configSrvc, contactsSrvc, chatSrvc, $q, $timeout,socketio, ngAudio,joinSrvc,$filter,socketiostream,Room,VideoStream,$sce) {
    	
    	$rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
	  		if(fromState.name=="" && toState.name != "join"){
	  			$rootScope.$broadcast("ESTABLISH_COMMUNICATION");
	  		}
	  	});
	  	$scope.showLocalVideo=false;
	  	$scope.localVideo={};
	  	$scope.isAudioCall=false;
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
    	var localvid;
    	$scope.isNotification=false;
    	$scope.showCallModal='display-none';
    	$scope.callImage=true;
    	var stream;
    	$scope.callImageStyle = {'text-align':'center'};
    	$scope.remoteCameraDivBG = {'background-color':'#fff'};
    	$scope.peers = [];
    	$scope.audioCall={};
	    $scope.$on("STREAM_RECEIVED", function (event,data) {
	    	$scope.outCallAudio.stop();
	    	contactsSrvc.getallContacts().then(function(contacts){
				var calleeName = data[0].id;
				var remoteVideoTracks = (data[0].stream).getVideoTracks();
				var isRemoteVideo=false;
				console.log('video tracks');
				console.log(remoteVideoTracks);
				if(remoteVideoTracks.length > 0){
					isRemoteVideo=true;
				}
				else{
					isRemoteVideo=false;
				}
				var contact = $filter('filter')(contacts,{contactNumber:data[0].id},true)[0];
				console.log(contact);
				if(contact)
					calleeName = contact.contactName;
				console.log('Client connected, adding new stream');
		      $scope.peers.push({
		        id: data[0].id,
		        name:calleeName,
		        image:contact.photo,
		        isRemoteVideo: isRemoteVideo,
		        stream: $scope.getLocalVideo(URL.createObjectURL(data[0].stream))
		      });
		      if($scope.peers.length > 0){
		      	$scope.callImageStyle ={};
		      	$scope.isOutGoingCall=true;
		      	var localVideoTracks = stream.getVideoTracks();
		      	$scope.localVideo['src'] = $scope.getLocalVideo(URL.createObjectURL(stream));
		      	if(localVideoTracks.length>0){
		 		 	$scope.showLocalVideo=true;
		 		 	localvid = document.getElementById('localVideo');
		 		 	$scope.rotateVideo(localvid);
		      	}
		      	else{
		      		$scope.showLocalVideo=false;
		      		 joinSrvc.getUserByUserId().then(function(userdata){
			            $scope.audioCall.image = userdata.profilePic;
			            $scope.audioCall.name = userdata.profileName;
			        });
			        $scope.callImageStyle = {'text-align':'center'};
			        $scope.isAudioCall=true;
		      	}
		      	
		 		 $scope.callTitle = "Ongoing Call";
		 		 $scope.callImage=false;
		 		 $scope.remoteCameraDivBG = {'background-color':'#000'};
		      }		
			});
				
		});
		$scope.$on("STREAM_ENDED", function (event,data) {
			  console.log('Client disconnected, removing stream');
			  $scope.remoteCameraDivBG = {'background-color':'#fff'};
		      $scope.peers = $scope.peers.filter(function (p) {
		        return p.id !== data[0].id;
		      });
		      if($scope.peers.length == 0){
		      	$scope.remoteCameraDivBG = {'background-color':'#fff'};
				$scope.callImage=true;
				$scope.callImageStyle = {'text-align':'center'};
				$scope.showCallModal='display-none';
				$scope.isOutGoingCall=false;
				Room.disconnect().then(function(connected){
					console.log(connected);
				});
				$scope.audioCall={};
				$scope.isAudioCall=false;
		      }
		});
	    $scope.getLocalVideo = function (streamUrl) {
	      return $sce.trustAsResourceUrl(streamUrl);
	    };
    	$scope.$on("OUT_GOING_CALL", function (event,data) {
    		var callType = data.callType;
    		$scope.isOutGoingCall=true;
    		$scope.callTitle = "Calling";
    		$scope.communicationId = data.communicationId;
    		$scope.userNumber = data.userNumber;
    		  $scope.showCallModal='display-block';
    		  $scope.callName=data.ContactData.contactName;
    		  $scope.callPhoto = data.ContactData.photo;
    		  if(data.ContactData.group){
    		  	contactsSrvc.getallContacts().then(function(contacts){
    		  		contactsSrvc.getContactNamesInGroup(data.ContactData.contactNumber,contacts).then(function(names){
						$scope.callNumber = names;
					});
    		  	});
    		  }
    		  $scope.callNumber = data.ContactData.contactNumber;
			  $scope.outCallAudio.play();
    		VideoStream.get(callType)
	    .then(function (s) {
	      stream = s;
	      Room.init(stream);
	      Room.createRoom($scope.communicationId,$scope.userNumber)
	        .then(function (roomId) {
				//Emit calling to other user using socket.io
	          socketio.emit('call', {communicationId:$scope.communicationId,from:$scope.userNumber,to:data.ContactData.contactNumber,callType:callType});
	        });
	    }, function () {
	      $scope.AVerror = 'No audio/video permissions. Please refresh your browser and allow the audio/video capturing.';
	      alert($scope.AVerror);
	    });
			  
			  
		});
		$scope.endCall=function(){
			$scope.showCallModal='display-none';
			$scope.isOutGoingCall=false;
			$scope.outCallAudio.stop();
			$scope.stopStream();
			socketio.emit('endcall', {communicationId:$scope.communicationId,from:$scope.userNumber});
			Room.leaveRoom().then(function(roomId){
				console.log('disconnected');
			});
			$scope.peers=[];
			$scope.remoteCameraDivBG = {'background-color':'#fff'};
			$scope.callImage=true;
			$scope.callImageStyle = {'text-align':'center'};
			$scope.audioCall={};
			$scope.isAudioCall=false;
			$scope.showLocalVideo=false;
		};
		$scope.stopStream=function(){
			if(stream)
				stream.stop();
			if(localvid){
				localvid.pause();
				localvid.src="";
			}
		};
		$scope.answerCall=function(type){
			$scope.inCallAudio.stop();
			VideoStream.get(type)
	    .then(function (s) {
	      stream = s;
	      Room.init(stream);
	      Room.joinRoom($scope.communicationId,userNumber)
	        .then(function (roomId) {
				
			});
	    }, function () {
	      $scope.AVerror = 'No audio/video permissions. Please refresh your browser and allow the audio/video capturing.';
	      alert($scope.AVerror);
	    });
			
		};
		$scope.rejectCall=function(){
			$scope.showCallModal='display-none';
			$scope.isOutGoingCall=false;
			$scope.inCallAudio.stop();
			socketio.emit('endcall', {communicationId:$scope.communicationId,from:$scope.userNumber});
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
			$scope.callType= msg.callType;
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
			$scope.outCallAudio.stop();
			$scope.stopStream();
    		$scope.showCallModal='display-none';
    		$scope.showLocalVideo=false;
    		
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
				msg.fromName = contact[0].contactName;
				msg.fromPhoto = contact[0].photo;
				msg.callNumber = msg.from;
	    		
			}
			else{
				var contact = $filter('filter')(contacts,{contactNumber:msg.to},true);
				msg.fromName = contact[0].contactName;
				msg.fromPhoto = contact[0].photo;
				msg.callNumber = msg.to;
				contactsSrvc.getContactNamesInGroup(msg.to,contacts).then(function(names){
					$scope.callNumber = names;
				});
			}
			$scope.inCallAudio.play();
			$scope.callName=msg.fromName;
    		$scope.callPhoto = msg.fromPhoto;
    		$scope.callNumber = msg.callNumber;
    		$scope.showCallModal='display-block';
		};
		$scope.rotateVideo=function(video) {
			console.log(video);
			video.style[navigator.mozGetUserMedia ? 'transform' : '-webkit-transform'] = 'rotate(0deg)';
			setTimeout(function() {
				video.style[navigator.mozGetUserMedia ? 'transform' : '-webkit-transform'] = 'rotate(360deg)';
			}, 1000);
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
    				var cnt=0;
    				var len = result.length;
    				chatSrvc.clearContactCommunicationsArray();
    				for (var idx in result) {
    					var obj = {};
    					obj.contactId = result[idx].id;
    					obj.communicationId = response[idx];
    					chatSrvc.updateContactCommunicationIdMappings(obj);
    					
    					/**
						* Connect to chat with each contact to get the notifications.
						*/
    					socketio.emit('connected to chat', response[idx]);
    					cnt++;
    					if(len == cnt){
    						//Emit to historyController to load history based on Contact and cCommunicationID Mappings.
    						$rootScope.$broadcast("LOAD_HISTORY",{});
    					}
    				}
    			});
    		}
    		});
    		
    		
    	});
    }]);
});
