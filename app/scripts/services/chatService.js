/**
* Created by Reddy on 08-08-2014.
*/
define(['../modules/services'], function (services) {
    'use strict';
    services.factory('chatSrvc', function ($http, $q, $rootScope, $timeout, joinSrvc, $filter) {
    	//An array to hold the communicationIds for each ContactId.
    	var contactCommunications = [];
    	//Adds Contact to database
        function getCommunicationId(contactNumber) {
            var future = $q.defer();
            $http.get('/communications/getCommunicationId/' + joinSrvc.mobileAndOtp.mobileNumber + '/' + contactNumber).success(function (data) {
            	future.resolve(data);
            }, function (err) { future.reject(err); });
            return future.promise;
        }

        function addMessage(doc) {
            var future = $q.defer();
            $http.post('/messages/addMessage', doc).success(function (data) {
                future.resolve(data);
            }, function (err) { future.reject(err); });
            return future.promise;
        }

        function updateContactCommunicationIdMappings(obj) {
        	var userId = joinSrvc.getUserId();
        	contactCommunications.push(obj);
        	localStorage.setItem(userId + "_CCM", JSON.stringify(contactCommunications));
        }
        function getContactCommunicationIdMappings(contactIdToMap) {
        	var future = $q.defer();
        	var userId = joinSrvc.getUserId();
        	var communicationMappings = JSON.parse(localStorage.getItem(userId + "_CCM"));
        	future.resolve($filter('filter')(communicationMappings, { contactId: contactIdToMap }));
        	return future.promise;
        }
        return {
            getCommunicationId: getCommunicationId,
            addMessage: addMessage,
            updateContactCommunicationIdMappings: updateContactCommunicationIdMappings,
            getContactCommunicationIdMappings: getContactCommunicationIdMappings
        };
    });
});