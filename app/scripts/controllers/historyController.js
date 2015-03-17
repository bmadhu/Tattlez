/**
 * Created by bindum on 27/7/14.
 */
define(['../modules/controller'], function (controllers) {
    'use strict';
    controllers.controller('HistoryCtrl', function ($scope, $state,chatSrvc,contactsSrvc,$filter,joinSrvc) {
       var arrHistory =[];
       chatSrvc.getHistoryByUser().then(function(history){
       	
       	
       	$scope.history=[];
       	var userId = joinSrvc.getUserId();
       	var communicationMappings = JSON.parse(localStorage.getItem(userId + "_CCM"));
       	var contacts = JSON.parse(localStorage.getItem(userId + "_C"));
       		angular.forEach(history,function(hist,index){
       			var mapping = $filter('filter')(communicationMappings,{communicationId:hist.communicationId},true)[0];
       			var contact = $filter('filter')(contacts,{id:mapping.contactId},true)[0];
       			var objHistory = {};
       			objHistory['contactName'] = contact.contactName;
       			objHistory['lastMessage'] = hist.message;
       			objHistory['photo'] = contact.photo;
       			objHistory['contactId'] = contact.id;
       			console.log(contact.contactName);
       			var time = new Date(hist.on).getTime();
       			console.log(time);
       			objHistory['on'] = time;
       			if(hist.isMedia){
       				objHistory['lastMessage'] = 'Image';
       			}
       			if(hist.isVideo){
       				objHistory['lastMessage'] = 'Video';
       			}
       			arrHistory.push(objHistory);
       			$scope.history=arrHistory;
       		});
       });
       /**
		* Loads chatting page from history
		**/
        $scope.chat = function (contactId) {
        	contactsSrvc.setSelectedContactForChat(contactId);
        	$state.go('chat');
        };
        /**
         * Loads contacts page from history
         */
        $scope.loadContacts = function () {
            $state.go('contacts');
        };
        /**
         *  Creating New Chat will navigate to contacts page
         */
        $scope.createNewChat = function () {
            $state.go('contacts');
        }
        /**
         *  Creating New Group will navigate to New group page
         */
        $scope.createNewGroup = function () {
            $state.go('newGroup');
        }
        /**
         *  Creating New broadcast list will navigate to New broadcast list page
         *  where user can broadcast a message to number of contacts
         */
        $scope.createBroadcastList = function () {
            //$state.go('broadcast');
        }
        /**
         *  Navigate to contacts list page.
         */
        $scope.goToContactsPage = function () {
             $state.go('contacts');
        }
        /**
         *  Navigate to settings page, shows a list of menu items
         *  Help, profile, Account, Chat settings, notifications, contacts
         */
        $scope.goToSettingsPage = function () {
             $state.go('settings');
        }
        /**
         *  Navigate to Status page.
         *  Shows current status with Edit option and other options to select
         */
        $scope.setStatus = function () {
            //$state.go('status');
        }


    });
});
