/**
 * Created by Reddy on 28-07-2014.
 */
define(['../modules/services'], function (services) {
    'use strict';
    services.factory('contactsSrvc', function ($http, $q, joinSrvc, configSrvc) {
		//get all contacts
        function getallContacts(){
        	var future = $q.defer();
        	$http.jsonp('/contacts/getallContacts/' + joinSrvc.getUserId() + '?callback=JSON_CALLBACK').success(function (data) {
        		future.resolve(data);
            },function(err){future.reject(err);});
            return future.promise;
        }
    	//Delete Contact from database
        function deleteContact(contact) {
        	var future = $q.defer();
        	$http.post('/contacts/deleteContact', contact).success(function (data) {
        		future.resolve(data);
        	}, function (err) { future.reject(err); });
        	return future.promise;
        }
    	//set Selected Contact for chat.
        function setSelectedContactForChat(contactId) {
        	localStorage.setItem(configSrvc.cidLocalStorage, contactId);
        }
    	//get Selected Contact for chat.
        function getSelectedContactForChat() {
        	return localStorage.getItem(configSrvc.cidLocalStorage);
        }

        return {
        	getallContacts: getallContacts,
        	deleteContact: deleteContact,
        	setSelectedContactForChat: setSelectedContactForChat,
        	getSelectedContactForChat: getSelectedContactForChat
        };
    });
});
