/**
* Created by Reddy on 08-08-2014.
*/
define(['../modules/services'], function (services) {
    'use strict';
    services.factory('chatSrvc', function ($http, $q, $rootScope, $timeout, joinSrvc) {
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

        return {
            getCommunicationId: getCommunicationId,
            addMessage: addMessage
        };
    });
});