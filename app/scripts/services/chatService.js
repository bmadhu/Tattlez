/**
 * Created by Reddy on 08-08-2014.
 */
define(['../modules/services'], function (services) {
	'use strict';
	services.factory('chatSrvc', function ($http, $q, $rootScope, $timeout, joinSrvc) {
		//Adds Contact to database
		function getCommunicationId(contactId) {
			var future = $q.defer();
			$http.get('/communications/getCommunicationId/' + joinSrvc.getUserId() + '/' + contactId).success(function (data) {
				future.resolve(data);
			}, function (err) { future.reject(err); });
			return future.promise;
		}

		return {
			getCommunicationId: getCommunicationId
		};
	});
});