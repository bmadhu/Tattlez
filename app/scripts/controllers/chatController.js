/**
 * Created by Reddy on 01/8/14.
 */
define(['../modules/controller'], function (controllers) {
	'use strict';
	controllers.controller('chatCtrl', function ($scope,$rootScope, $state, contactsSrvc, chatSrvc, textAngularManager,$timeout,joinSrvc,$filter,socketio,configSrvc) {
		var joined = false;
		$scope.isShowSmileys=false;
		$scope.chatFormCls="chat-form";
		$scope.smileySrc="../images/smiley.png";
		
		$scope.toggleSmileysDiv=function(){
			if($scope.isShowSmileys){
				$scope.isShowSmileys=false;
				$scope.chatFormCls="chat-form";
				$scope.smileySrc="../images/smiley.png";
				setTimeout(function () {
					placeCaretAtEnd($("text-angular div[contenteditable=true]").get(0));
				}, 0);
			}else{
				$scope.isShowSmileys=true;
				$scope.chatFormCls="chat-form-small";
				$scope.smileySrc="../images/down-arrow.png";
			}
		};
		//get the contactId of the user to which we are trying to start chat.
		$scope.emoticons = configSrvc.emoticons;
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
		$scope.addEmoticon = function (obj,to,index) {
			var textarea = $("#txtAreaChat");
			
			var text = textarea.val();
			var emoticon = "<img class='emoji emoji_" + obj + "' title=':" + obj + ":' src='../images/blank.gif' />";
			textarea.val(text + emoticon);
			$timeout(function () {
				$scope.newMsg = text + emoticon;
				setTimeout(function () {
					placeCaretAtEnd($("text-angular div[contenteditable=true]").get(0));
				}, 10);
			}, 0);
			
		};
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
        	chatSrvc.getMessagesByCommunicationId($scope.communicationId).then(function(result){
        		console.log(result);
        		var finalResult=[];
        		contactsSrvc.getallContacts().then(function(contacts){
        			angular.forEach(result,function(value,key){
        			console.log(value);
        			console.log(key);
        			if(value.to == userNumber){
        				var contact = $filter('filter')(contacts,{contactNumber:value.from},true);
						value.fromLabel = contact.length>0?contact[0].contactName:value.from;
        			}
        			else if(value.from != userNumber){
        				var contact = $filter('filter')(contacts,{contactNumber:value.from},true);
						value.fromLabel = contact.length>0?contact[0].contactName:value.from;
        			}
        			else{
        				value.fromLabel = "me";
        			}
        			finalResult.push(value);
        		});
        		});
        		
        		$scope.msgs=finalResult;
        		$scope.scrollMsgDivUp();
        		
        	});
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
			* Call chatSrvc to add new message in database
			*/
			chatSrvc.addMessage(doc).then(function (result) {
			});
			/**
			* Add messages to array to show it on the window immediately.
			*/
			var docTemp = doc;
			docTemp.fromLabel='me';
			$scope.msgs.push(docTemp);
			$scope.scrollMsgDivUp();
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
		$scope.scrollMsgDivUp=function(){
			$timeout(function () { $("."+$scope.chatFormCls).animate({ scrollTop: $("."+$scope.chatFormCls).prop("scrollHeight") - $("."+$scope.chatFormCls).height() }, 100); }, 10);
		};
		/**
		* Receive messages from the other user
		* Add the messages to array
		*/
		$scope.$on("MSG_RECEIVED", function (event,msg) {
			$timeout(function () {
				contactsSrvc.getallContacts().then(function(contacts){
					var contact = $filter('filter')(contacts,{contactNumber:msg.from},true);
					msg.fromLabel = contact.length>0?contact[0].contactName:msg.from;
					$scope.msgs.push(msg);
					$scope.scrollMsgDivUp();
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
function placeCaretAtEnd(el) {
	el.focus();
	if (typeof window.getSelection != "undefined"
			&& typeof document.createRange != "undefined") {
		var range = document.createRange();
		range.selectNodeContents(el);
		range.collapse(false);
		var sel = window.getSelection();
		sel.removeAllRanges();
		sel.addRange(range);
	} else if (typeof document.body.createTextRange != "undefined") {
		var textRange = document.body.createTextRange();
		textRange.moveToElementText(el);
		textRange.collapse(false);
		textRange.select();
	}
}
