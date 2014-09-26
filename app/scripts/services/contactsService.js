/**
 * Created by Reddy on 28-07-2014.
 */
define(['../modules/services'], function (services) {
    'use strict';
    services.factory('contactsSrvc', function ($http, $q, joinSrvc, configSrvc) {
        //get all contacts
    	function getallContacts() {
    		var userId = joinSrvc.getUserId();
    		var future = $q.defer();
    		if (localStorage.getItem(userId + '_C')) {
    			future.resolve(JSON.parse(localStorage.getItem(userId + '_C')));
    		}
    		else {
    			$http.jsonp('/contacts/getallContacts/' + userId + '?callback=JSON_CALLBACK').success(function (data) {
    				localStorage.setItem(userId + '_C', JSON.stringify(data));
    				future.resolve(data);
    			}, function (err) { future.reject(err); });
    		}

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
        //get details of chat contact
        function getChatContactDetails(contactId) {
            var future = $q.defer();
            $http.jsonp('/contacts/getChatContactDetails/' + contactId + '?callback=JSON_CALLBACK').success(function (data) {
                future.resolve(data);
            }, function (err) {
                future.reject(err);
            });
            return future.promise;
        }
        return {
            getallContacts: getallContacts,
            deleteContact: deleteContact,
            setSelectedContactForChat: setSelectedContactForChat,
            getSelectedContactForChat: getSelectedContactForChat,
            getChatContactDetails: getChatContactDetails
        };
    });
});
