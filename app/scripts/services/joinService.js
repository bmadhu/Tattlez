/**
 * Created by bindum on 26/7/14.
 */
define(['../modules/services'], function (services) {
	'use strict';
	services.factory('joinSrvc', function ($http, $q, $rootScope, $timeout, configSrvc) {
		var mobileAndOtp = {}; //object to save mobile number and OTP

		// Sets mobile number from join form
		function setMobileNumber(mobileNumber) {
			mobileAndOtp.mobileNumber = mobileNumber;
		}

		/**
         * Generates 4 digit random number
         * Broadcasts Event to generate new OTP
         */
		function setOtp() {
			mobileAndOtp.otp = Math.floor(Math.random()*9000) + 1000;
			$timeout(function () {
				mobileAndOtp.otp = null;
				$rootScope.$broadcast("UPDATE_OTP");
			}, configSrvc.otpDelay);
		}

		// Gets mobile and OTP object
		function getMobileAndOtp() {
			return mobileAndOtp;
		}

		function getUserId() {
			return localStorage.getItem(configSrvc.uidLocalStorage);
		}

		function getallUsers() {
			var future = $q.defer();
			$http.jsonp('/users/getall?callback=JSON_CALLBACK').success(function (data) {
				future.resolve(data);

			}, function (err) { future.reject(err); });
			return future.promise;
		}

		function getUserIdByMobileNumber() {
			var future = $q.defer();
			$http.get('/users/getUserIdByMobileNumber/' + mobileAndOtp.mobileNumber).success(function (data) {
				future.resolve(data);
				localStorage.setItem(configSrvc.uidLocalStorage, data);
			}, function (err) { future.reject(err); });
			return future.promise;
		}
		
		function getUserIdByContactMobileNumber(mobileNumber) {
			var future = $q.defer();
			$http.get('/users/getUserIdByMobileNumber/' + mobileNumber).success(function (data) {
				future.resolve(data);
			}, function (err) { future.reject(err); });
			return future.promise;
		}

		function addUser(user) {
			var future = $q.defer();
			$http.post('/users/addUser', user).success(function (data) {
				if (data != 'null') {
					localStorage.setItem(configSrvc.uidLocalStorage, data._id);
					future.resolve(data);
				}
				else {
					var promises = [];
					promises.push(getUserIdByMobileNumber());
					$q.all(promises).then(function (result) {
						future.resolve(result[0]);
					});
				}
			}, function (err) {
				future.reject(err);
			});
			return future.promise;
		}
		function getUserByUserId(){
			var future=$q.defer();
			$http.post('/users/getUserByUserId/'+localStorage.getItem(configSrvc.uidLocalStorage)).success(function(data){
				if(data!=null){
					future.resolve(data);
				}
			},function(err){
				future.reject(err);
			});
			return future.promise;
		}
		return {
			setMobileNumber: setMobileNumber,
			setOtp: setOtp,
			getMobileAndOtp: getMobileAndOtp,
			mobileAndOtp: mobileAndOtp,
			getallUsers: getallUsers,
			addUser: addUser,
			getUserIdByMobileNumber: getUserIdByMobileNumber,
			getUserId: getUserId,
			getUserByUserId:getUserByUserId,
			getUserIdByContactMobileNumber: getUserIdByContactMobileNumber
		};
	});
});
